import { initGlobe } from './globe.js';
import { SIMULATION_DEFS, PHISHING_INDICATORS, PASSWORD_INITIAL_PROFILE, normalizeSimulationProgress, scorePasswordProfile, MFA_STEPS, INCIDENT_STEPS, initSimulationScene, stopSimulationScene } from './simulations.js';
import {
  LEVELS, STORAGE_KEY, SETTINGS_KEY, safeReadProgress, addAttempt,
  calculateStats, canUnlockNextLevel, levelStatus, getRecommendations,
  formatPercent, getUniqueQuestionCount
} from './core.js';

const $ = (selector, root = document) => root.querySelector(selector);
const appView = $('#app-view');
const toast = $('#toast');
function storageAvailable() { try { const k = '__cyberaware_probe__'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; } catch { return false; } }
const hasLocalStorage = storageAvailable();
const SIMULATION_PROGRESS_KEY = 'cyberaware3d.simulations.v1';
function readSimulationProgress() { try { return normalizeSimulationProgress(JSON.parse(readStorage(SIMULATION_PROGRESS_KEY) || '{}')); } catch { return {}; } }
function writeSimulationProgress() { writeStorage(SIMULATION_PROGRESS_KEY, JSON.stringify(state.simulationProgress)); }
function readStorage(key) { try { const value = hasLocalStorage ? localStorage.getItem(key) : null; return value && value.length > 1_000_000 ? null : value; } catch { return null; } }
function writeStorage(key, value) { try { if (hasLocalStorage) localStorage.setItem(key, value); } catch { /* The session remains usable in memory if storage is blocked or full. */ } }
const state = {
  view: 'dashboard',
  topicFilter: 'All',
  progress: safeReadProgress(readStorage(STORAGE_KEY)),
  sessions: readSessions(),
  settings: readSettings(),
  questions: [], expertQuestions: [], explanations: [], manifest: [], references: [],
  quiz: null,
  lastQuiz: null,
  mediaValidated: {},
  transcript: { id: null, text: '', loading: false },
  simulationProgress: readSimulationProgress(),
  simulation: createSimulationAttempt(null)
};

function createSimulationAttempt(activeId) { return { activeId, selectedIndicators: [], submitted: false, password: { ...PASSWORD_INITIAL_PROFILE }, passwordAssessed: false, stepIndex: 0, stepChoice: null, feedback: null, complete: false, runRecorded: false }; }
function saveSimulationResult(id, score, countAttempt = true) { const previous = state.simulationProgress[id] || {}; state.simulationProgress[id] = { completed: score >= 100 || previous.completed === true, bestScore: Math.max(Number(previous.bestScore || 0), score), attempts: Number(previous.attempts || 0) + (countAttempt ? 1 : 0), completedAt: score >= 100 ? new Date().toISOString() : previous.completedAt || null }; writeSimulationProgress(); }
function simulationDefinition(id) { return SIMULATION_DEFS.find(item => item.id === id); }
function renderSimulationSceneBlock(sim) { return `<div class="simulation-scene"><canvas id="simulation-scene-canvas" aria-label="Interactive three-dimensional ${esc(sim.title)} learning illustration. Drag to rotate or focus and use arrow keys." tabindex="0" role="img"></canvas><div class="scene-2d-fallback" hidden aria-hidden="true"><div class="fallback-orb ${esc(sim.id)}"><span></span><i></i><b></b></div></div><div class="scene-overlay"><span>${esc(sim.sceneLabel)}</span><small>DRAG OR ARROW KEYS · DECORATIVE MODEL</small></div></div>`; }

function readSessions() {
  try {
    const raw = JSON.parse(readStorage('cyberaware3d.sessions.v1') || '[]');
    if (!Array.isArray(raw)) return [];
    const allowed = new Set(['Beginner','Intermediate','Advanced','Expert Challenge','Topic practice']);
    return raw.filter(row => row && typeof row === 'object' && allowed.has(row.level) && Number.isInteger(row.correct) && Number.isInteger(row.total) && row.correct >= 0 && row.total >= 1 && row.correct <= row.total && typeof row.completedAt === 'string' && !Number.isNaN(Date.parse(row.completedAt)))
      .slice(0,12).map(row => ({ level: row.level, category: typeof row.category === 'string' ? row.category.slice(0,80) : null, total: row.total, correct: row.correct, accuracy: row.correct/row.total, completedAt: row.completedAt }));
  } catch { return []; }
}
function readSettings() {
  try { const s = JSON.parse(readStorage(SETTINGS_KEY) || '{}'); return { reducedMotion: typeof s.reducedMotion === 'boolean' ? s.reducedMotion : matchMedia('(prefers-reduced-motion: reduce)').matches }; }
  catch { return { reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }; }
}
function persistProgress() { writeStorage(STORAGE_KEY, JSON.stringify(state.progress)); }
function persistSettings() { writeStorage(SETTINGS_KEY, JSON.stringify(state.settings)); document.body.classList.toggle('reduce-motion', state.settings.reducedMotion); }
function persistSessions() { writeStorage('cyberaware3d.sessions.v1', JSON.stringify(state.sessions.slice(0, 12))); }
function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
function showToast(message) {
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}
function setView(view) {
  state.view = view; state.quiz = null; state.transcript = { id: null, text: '', loading: false };
  render('h1');
}
function levelSlug(level) { return level.toLowerCase().replaceAll(' ', '-'); }
function allQuestions() { return [...state.questions, ...state.expertQuestions]; }
function questionsFor(level) { return allQuestions().filter(q => q.level === level); }
function questionById(id) { return allQuestions().find(q => q.questionId === id); }
function explanationById(id) { return state.explanations.find(e => e.questionId === id); }
function manifestByVideoId(id) { return state.manifest.find(e => e.videoId === id); }
function uniqueTopics() { return [...new Set(allQuestions().map(q => q.category))].sort((a,b) => a.localeCompare(b)); }
function levelCountLabel(level) { return `${questionsFor(level).length} scenarios`; }
function percentWidth(value) { return `${Math.max(0, Math.min(100, value * 100))}%`; }
function sourceFor(refId) { return state.references.find(r => r.id === String(refId).replace(/\D/g, '')); }
function referenceChips(refs = []) {
  if (!refs.length) return '<span class="muted">No linked references</span>';
  return `<div class="reference-chips">${refs.map(ref => {
    const source = sourceFor(ref);
    return `<span class="reference-chip" title="${esc(source?.text || 'Reference in the research manuscript')}">${esc(ref)}</span>`;
  }).join('')}</div>`;
}
function metricCard(label, value, note, icon) {
  return `<div class="metric-card"><span class="metric-icon">${icon}</span><div class="metric-label">${esc(label)}</div><div class="metric-value">${esc(value)}</div><div class="metric-note">${esc(note)}</div></div>`;
}
function renderLevelRows(stats) {
  return LEVELS.map((level, i) => {
    const data = stats.byLevel[level];
    const icon = ['⌁','◈','⬡'][i];
    const total = questionsFor(level).length;
    return `<div class="level-row"><div class="level-emblem" aria-hidden="true">${icon}</div><div><strong>${level}</strong><small>${data.answered} of ${total} first attempts · ${formatPercent(data.accuracy)} accuracy</small><div class="mini-progress" role="progressbar" aria-label="${esc(level)} pathway questions answered" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${Math.min(total, data.answered)}" aria-valuetext="${Math.min(total, data.answered)} of ${total} first attempts"><span style="width:${data.answered ? data.answered / total * 100 : 0}%"></span></div></div><div class="level-score">${data.correct}/${data.answered}</div></div>`;
  }).join('');
}
function renderTopicBars(stats) {
  const rows = stats.byTopic.slice(0, 5);
  if (!rows.length) return '<div class="empty-note">Your topic performance will appear after your first quiz.</div>';
  return `<div class="topic-bars">${rows.map(row => `<div class="topic-bar-row"><div class="topic-bar-label"><span>${esc(row.category)}</span><span>${formatPercent(row.accuracy)}</span></div><div class="bar-track"><div class="bar-fill" style="width:${percentWidth(row.accuracy)}"></div></div></div>`).join('')}</div>`;
}
function renderRecommendation(stats) {
  const rec = getRecommendations(state.progress);
  const icon = rec.type === 'review_topic' ? '↗' : rec.type === 'next_level' ? '⇢' : '✧';
  let action = '';
  if (rec.type === 'review_topic') action = `<button class="btn btn-secondary" data-action="topic-practice" data-category="${esc(rec.category)}">Practice this topic <span>↗</span></button>`;
  else if (rec.level) action = `<button class="btn btn-primary" data-action="start-level" data-level="${esc(rec.level)}">Open learning path <span>→</span></button>`;
  return `<div class="recommendation"><div class="recommendation-icon">${icon}</div><div><strong>${esc(rec.title)}</strong><p>${esc(rec.detail)}</p><div style="margin-top:10px">${action}</div></div></div>`;
}
function renderDashboard() {
  const stats = calculateStats(state.progress);
  const rec = getRecommendations(state.progress);
  return `
    <div class="hero">
      <div class="hero-copy">
        <div class="hero-tag"><span></span> YOUR SECURITY LEARNING COMMAND CENTER</div>
        <h1>Build the instinct.<br><em>Defend the digital.</em></h1>
        <p>Practice real-world security decisions through progressive scenarios, clear explanations and research-linked learning. Start with the fundamentals and advance as your knowledge develops.</p>
        <div class="button-row"><button class="btn btn-primary" data-action="start-level" data-level="Beginner">Start learning <span>→</span></button><button class="btn btn-secondary" data-view="paths">Explore pathways</button><button class="btn btn-quiet" data-view="simulations">Open simulations ↗</button></div>
      </div>
      <div class="globe-stage" role="img" aria-label="Illustrative two-dimensional network globe representing connected digital systems. This is a decorative visual, not a live threat map.">
        <div class="orbit"><span class="orbit-dot"></span></div><div class="orbit o2"><span class="orbit-dot"></span></div>
        <canvas id="cyber-globe" class="globe-canvas" width="480" height="480" aria-label="Interactive cybersecurity learning globe. Drag to rotate."></canvas>
        <div id="globe-fallback" class="globe-fallback hide"><div class="globe"><div class="globe-lat l1"></div><div class="globe-lat l2"></div><div class="globe-lat l3"></div><div class="globe-lat l4"></div><div class="globe-grid"></div><span class="globe-node n1"></span><span class="globe-node n2"></span><span class="globe-node n3"></span><span class="globe-node n4"></span></div></div>
        <div class="globe-label">CONNECTED · AWARE · RESILIENT</div>
      </div>
    </div>
    <div class="section-head"><div><h2>Your learning snapshot</h2><p>First-attempt performance across unique scenarios.</p></div><span class="pill">LOCAL PROFILE</span></div>
    <div class="metric-grid">
      ${metricCard('SCENARIOS ANSWERED', stats.answered, 'Unique first attempts', '◷')}
      ${metricCard('ACCURACY', formatPercent(stats.accuracy), `${stats.correct} correct responses`, '◎')}
      ${metricCard('LEARNING XP', stats.correct * 25 + (stats.answered - stats.correct) * 8, '25 XP correct · 8 XP attempted', '✧')}
      ${metricCard('PATHWAYS IN PROGRESS', LEVELS.filter(l => stats.byLevel[l].answered > 0).length, 'Of 3 core pathways', '◈')}
    </div>
    <div class="section-head"><div><h2>Learning progression</h2><p>Progression is a practice recommendation, not proof of real-world competency.</p></div><button class="btn btn-quiet" data-view="paths">View all paths →</button></div>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><h3>Pathway progress</h3><span>FIRST-ATTEMPT ACCURACY</span></div><div class="level-list">${renderLevelRows(stats)}</div></section>
      <section class="panel"><div class="panel-head"><h3>Knowledge signals</h3><span>TOPIC BREAKDOWN</span></div>${renderTopicBars(stats)}</section>
    </div>
    <div class="section-head"><div><h2>Recommended next step</h2><p>Transparent guidance based on recorded practice only.</p></div></div>
    <section class="panel">${renderRecommendation(stats)}</section>
    <div class="callout" style="margin-top:14px"><strong>Learning note:</strong> Quiz performance is a limited measure of knowledge in these scenarios. It does not establish that a learner will behave securely in real operational environments.</div>
  `;
}
function renderPaths() {
  const stats = calculateStats(state.progress);
  const descriptors = {
    Beginner: { num: '01 / FOUNDATION', icon: '⌁', desc: 'Build essential habits for recognizing common threats, protecting accounts and handling suspicious messages.', topics: 'Phishing · Password hygiene · OTP safety · Safe browsing' },
    Intermediate: { num: '02 / PRACTICE', icon: '◈', desc: 'Work through multi-step decisions involving impersonation, QR scams, MFA fatigue and incident reporting.', topics: 'Spear phishing · Smishing · QR fraud · MFA fatigue' },
    Advanced: { num: '03 / DECISION', icon: '⬡', desc: 'Analyze complex organizational scenarios, prioritize incidents and respond to high-impact security events.', topics: 'BEC · Insider risk · AI impersonation · Incident response' }
  };
  return `<div class="eyebrow">PROGRESSIVE LEARNING</div><h1 class="page-title">Choose your learning path</h1><p class="page-subtitle">Three progressively challenging pathways. The expanded bank contains more than the initial pilot set, with a rationale for every answer choice.</p>
    <div class="section-head"><div><h2>Core pathways</h2><p>Complete at your own pace. Your first response on each question counts toward progression.</p></div><span class="pill">${state.questions.length} CORE SCENARIOS</span></div>
    <div class="level-grid">${LEVELS.map((level, i) => {
      const d = descriptors[level], s = stats.byLevel[level], access = levelStatus(state.progress, level);
      const cls = levelSlug(level);
      return `<article class="level-card ${cls}"><div class="level-top"><span class="level-number">${d.num}</span><span class="level-symbol">${d.icon}</span></div><h3>${level}</h3><p>${d.desc}</p><p style="margin-top:10px;color:#66849f">${d.topics}</p><div class="level-card-footer"><span>${s.answered}/${state.questions.filter(q => q.level === level).length} ANSWERED · ${formatPercent(s.accuracy)}</span><button class="btn ${access.unlocked ? 'btn-primary' : 'btn-secondary'}" data-action="start-level" data-level="${level}" ${access.unlocked ? '' : 'disabled'}>${access.unlocked ? 'Enter path →' : 'Locked · 75% needed'}</button></div><div style="font-size:8px;color:#7188a1;margin-top:11px">${esc(access.reason)}</div></article>`;
    }).join('')}</div>
    <div class="section-head"><div><h2>Expert Challenge</h2><p>Optional organizational-level decision exercises. Kept separate from the core pathways.</p></div><span class="pill amber">${state.expertQuestions.length} SCENARIOS</span></div>
    ${(() => { const access = levelStatus(state.progress, 'Expert Challenge'); const data = stats.byLevel['Expert Challenge']; return `<article class="level-card expert"><div class="level-top"><span class="level-number">04 / GOVERNANCE</span><span class="level-symbol">✦</span></div><h3>Expert Challenge</h3><p>Make coordinated decisions across incident response, supplier risk, insider-risk governance, payment controls, board communication and ransomware recovery.</p><p style="margin-top:10px;color:#66849f">Incident command · C-SCRM · Governance · Resilience</p><div class="level-card-footer"><span>${data.answered}/${state.expertQuestions.length} ANSWERED · ${formatPercent(data.accuracy)}</span><button class="btn ${access.unlocked ? 'btn-primary' : 'btn-secondary'}" data-action="start-level" data-level="Expert Challenge" ${access.unlocked ? '' : 'disabled'}>${access.unlocked ? 'Enter challenge →' : 'Locked · Advanced prerequisite'}</button></div><div style="font-size:8px;color:#7188a1;margin-top:11px">${esc(access.reason)}</div><div style="font-size:8px;color:#7188a1;margin-top:6px">This is a practice gate, not an organizational competency certification.</div></article>`; })()}
  `;
}
function renderTopics() {
  const topics = uniqueTopics();
  const filtered = state.topicFilter === 'All' ? topics : topics.filter(t => t === state.topicFilter);
  const countFor = topic => allQuestions().filter(q => q.category === topic).length;
  return `<div class="eyebrow">KNOWLEDGE CATALOG</div><h1 class="page-title">Topic library</h1><p class="page-subtitle">Explore all topic scenarios across Beginner, Intermediate, Advanced and Expert Challenge. You can practice every topic immediately; practice on a locked level is retained but does not count toward that pathway's unlock threshold.</p>
    <div class="filter-row"><button class="filter-chip ${state.topicFilter === 'All' ? 'active' : ''}" data-action="topic-filter" data-filter="All">All topics</button>${topics.map(t => `<button class="filter-chip ${state.topicFilter === t ? 'active' : ''}" data-action="topic-filter" data-filter="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    <div class="topic-grid">${filtered.map(topic => {
      const q = allQuestions().filter(q => q.category === topic);
      const levels = [...new Set(q.map(x => x.level))];
      const first = q[0];
      return `<article class="topic-card"><span class="topic-tag">${esc(levels.join(' / '))}</span><h3>${esc(topic)}</h3><p>${esc(first?.learningObjective || 'Practice safe and informed security decisions.')}</p><div class="topic-meta"><span>${countFor(topic)} QUESTIONS</span><button class="btn btn-quiet" style="padding:6px 8px" data-action="topic-practice" data-category="${esc(topic)}">Practice →</button></div></article>`;
    }).join('')}</div>`;
}
function unlockedQuestions() {
  return allQuestions().filter(q => levelStatus(state.progress, q.level).unlocked);
}
function startLevel(level) {
  const access = levelStatus(state.progress, level);
  if (!access.unlocked) { showToast(access.reason); return; }
  const list = questionsFor(level);
  state.quiz = { level, category: null, questionIds: list.map(q => q.questionId), index: 0, selected: null, answered: false, answers: [], score: 0 };
  state.transcript = { id: null, text: '', loading: false };
  state.view = 'quiz'; render('h2');
}
function startTopic(category) {
  const list = allQuestions().filter(q => q.category === category);
  if (!list.length) { showToast('No questions are currently mapped to this topic.'); return; }
  state.quiz = { level: null, category, questionIds: list.map(q => q.questionId), index: 0, selected: null, answered: false, answers: [], score: 0 };
  state.transcript = { id: null, text: '', loading: false };
  state.view = 'quiz'; render('h2');
}
function currentQuestion() { return questionById(state.quiz?.questionIds[state.quiz.index]); }
function renderQuestionMap() {
  return state.quiz.questionIds.map((id, i) => {
    const done = state.quiz.answers.some(a => a.questionId === id);
    return `<span class="q-dot ${i === state.quiz.index ? 'current' : ''} ${done ? 'done' : ''}" aria-label="Question ${i + 1}${done ? ', answered' : ''}">${String(i + 1).padStart(2, '0')}</span>`;
  }).join('');
}
function renderRationales(q) {
  const ids = ['A','B','C','D'];
  return `<div class="rationale-list">${ids.map(id => {
    const r = q.optionExplanations[id];
    return `<div class="rationale ${r.isCorrect ? 'correct-rationale' : ''}"><b>${id}${r.isCorrect ? ' ✓' : ''}</b><span>${esc(r.explanation)}</span></div>`;
  }).join('')}</div>`;
}
function videoStatusLabel(entry) {
  if (!entry) return 'not mapped';
  if (entry.status === 'ready' && entry.mediaFileExists === true) return 'rendered and approved';
  if (entry.mediaFileExists === true) return 'rendered; awaiting validation/review';
  return 'not generated';
}
function renderVideoFallback(q) {
  const entry = manifestByVideoId(q.videoId);
  if (!entry) return '';
  if (entry.status === 'deferred_by_owner_request') return `<div class="video-fallback"><div class="video-thumb">ⓘ</div><div style="min-width:0"><strong>Video production deferred</strong><small>Video creation is intentionally deferred. The written explanation and all four option rationales are available above.</small></div></div>`;
  const open = state.transcript.id === q.videoId && state.transcript.text;
  const loading = state.transcript.id === q.videoId && state.transcript.loading;
  const ready = state.mediaValidated[q.videoId] === true;
  const validating = state.mediaValidated[q.videoId] === 'checking';
  const failed = state.mediaValidated[q.videoId] === false && entry.status === 'ready' && entry.mediaFileExists === true;
  const importedPending = entry.mediaFileExists === true && entry.status !== 'ready';
  const video = ready ? `<video class="question-video" data-video="${esc(q.videoId)}" controls preload="metadata" playsinline aria-label="${esc(entry.title)}"><source src="/${esc(entry.plannedOutputPath.replace(/^public\//,''))}" type="video/mp4"><track data-video="${esc(q.videoId)}" kind="captions" src="/data/videos/captions/${esc(q.videoId)}.vtt" srclang="en" label="English captions" default>Your browser does not support HTML video. Read the transcript instead.</video>` : '';
  const message = validating ? 'Checking that the MP4 and caption file exist before enabling playback.' : failed ? 'The approved asset could not be played or its caption track failed to load. The written transcript remains available.' : importedPending ? 'A rendered MP4 exists but is not yet approved for learner playback. The written script remains available.' : 'MP4 not generated. Script, storyboard, prompt and caption draft are available for review.';
  return `${ready ? `<div class="video-ready">${video}</div>` : `<div class="video-fallback"><div class="video-thumb">▶</div><div style="min-width:0"><strong>Question video · ${esc(entry.title)}</strong><small>${esc(message)}</small></div>`}<button class="btn btn-secondary" style="padding:7px 9px" data-action="toggle-transcript" data-video="${esc(q.videoId)}">${loading ? 'Loading…' : open ? 'Hide script' : 'View script'}</button>${ready ? '' : '</div>'}${open ? `<pre id="video-transcript" class="transcript" tabindex="-1">${esc(state.transcript.text)}</pre>` : ''}`;
}
function renderQuiz() {
  const q = currentQuestion();
  if (!q) return renderQuizEmpty();
  const index = state.quiz.index + 1;
  const total = state.quiz.questionIds.length;
  const done = state.quiz.answered;
  const selectedOption = q.options.find(o => o.id === state.quiz.selected);
  const correct = state.quiz.selected === q.correctOptionId;
  const exp = explanationById(q.questionId);
  const levelLabel = state.quiz.level || 'Topic practice';
  return `<div class="eyebrow">${esc(levelLabel.toUpperCase())} · ${esc(q.category.toUpperCase())}</div>
    <div class="section-head" style="margin-top:8px"><div><h1 class="page-title" style="font-size:25px;margin:0">${esc(q.title)}</h1><p>${esc(q.learningObjective)}</p></div><button class="btn btn-quiet" data-action="exit-quiz">Exit practice ×</button></div>
    <div class="quiz-layout">
      <section class="panel quiz-main">
        <div class="quiz-topline"><span class="quiz-progress-label">QUESTION ${String(index).padStart(2,'0')} <span style="color:#4e6a84">/ ${String(total).padStart(2,'0')}</span></span><span class="pill">${esc(q.level.toUpperCase())}</span></div>
        <div class="quiz-progress" role="progressbar" aria-label="Quiz progress" aria-valuemin="1" aria-valuemax="${total}" aria-valuenow="${index}" aria-valuetext="Question ${index} of ${total}"><span style="width:${index / total * 100}%"></span></div>
        <div class="question-kicker">SCENARIO-BASED ASSESSMENT</div>
        <h2>${esc(q.title)}</h2>
        <div class="scenario-box"><small>SCENARIO</small><p>${esc(q.scenario)}</p></div>
        <div class="question-prompt">${esc(q.question)}</div>
        <div class="options-list" role="group" aria-label="Answer choices">${q.options.map(o => {
          let cls = state.quiz.selected === o.id ? 'selected' : '';
          if (done && o.id === q.correctOptionId) cls += ' correct';
          else if (done && o.id === state.quiz.selected) cls += ' incorrect';
          return `<button class="option ${cls}" data-action="select-option" data-option="${o.id}" aria-pressed="${state.quiz.selected === o.id}" ${done ? 'disabled' : ''}><span class="option-letter">${o.id}</span><span>${esc(o.text)}</span></button>`;
        }).join('')}</div>
        ${done ? `<div class="feedback-panel"><div class="feedback-heading ${correct ? 'good' : 'bad'}" tabindex="-1" role="status">${correct ? '✓ Correct decision' : '✕ Not the safest decision'}</div><p>${esc(selectedOption ? q.optionExplanations[selectedOption.id].explanation : q.explanation)}</p>${renderRationales(q)}<div class="takeaway"><strong>KEY TAKEAWAY</strong><br>${esc(q.keyTakeaway)}<br><br><strong>DEFENSIVE ACTION</strong><br>${esc(q.recommendedDefensiveAction)}</div>${renderVideoFallback(q)}<div style="margin-top:12px"><strong style="font-size:9px">Research references</strong>${referenceChips(q.referenceIds)}</div></div>` : ''}
        <div class="quiz-actions"><span class="muted" style="font-size:9px">Estimated ${Math.round(q.estimatedCompletionSeconds / 60) || 1} min · No real credentials required</span>${done ? `<button class="btn btn-primary" data-action="next-question">${index === total ? 'View results' : 'Continue'} →</button>` : `<button class="btn btn-primary" data-action="submit-answer" ${state.quiz.selected ? '' : 'disabled'}>Submit answer →</button>`}</div>
      </section>
      <aside class="quiz-side"><section class="panel"><div class="panel-head"><h3>Question navigator</h3><span>${index}/${total}</span></div><div class="quiz-question-map">${renderQuestionMap()}</div><p style="margin-top:12px">Complete each scenario to see the answer rationale and defensive action.</p></section><section class="panel"><h3>Learning objective</h3><p>${esc(q.learningObjective)}</p><div style="height:12px"></div><h3>Progression rule</h3><p>At least 10 first attempts and 75% accuracy are required to unlock the next core learning level. Expert Challenge additionally requires the Advanced threshold. These are provisional practice heuristics, not competency certification.</p></section><section class="panel"><h3>Content status</h3><p>Question-level explanation: available<br>Video script: drafted<br>Rendered media: ${esc(videoStatusLabel(manifestByVideoId(q.videoId)))}<br>Human review: ${esc(manifestByVideoId(q.videoId)?.reviewStatus || 'not recorded')}</p></section></aside>
    </div>`;
}
function renderQuizEmpty() { return `<div class="panel empty-state"><strong>Practice session unavailable</strong>Return to learning paths and select an available pathway.<br><button class="btn btn-primary" data-view="paths" style="margin-top:14px">Browse pathways</button></div>`; }
function submitAnswer() {
  const q = currentQuestion();
  if (!q || !state.quiz || state.quiz.answered || !state.quiz.selected) return;
  const selected = state.quiz.selected;
  const correct = selected === q.correctOptionId;
  state.quiz.answered = true;
  state.quiz.score += correct ? 1 : 0;
  state.quiz.answers.push({ questionId: q.questionId, selectedOptionId: selected, correct });
  state.progress = addAttempt(state.progress, q, selected, new Date().toISOString(), levelStatus(state.progress, q.level).unlocked);
  persistProgress();
  render('.feedback-heading');
}
function nextQuestion() {
  if (!state.quiz?.answered) return;
  if (state.quiz.index < state.quiz.questionIds.length - 1) {
    state.quiz.index += 1; state.quiz.selected = null; state.quiz.answered = false;
    state.transcript = { id: null, text: '', loading: false }; render('h2');
  } else finishQuiz();
}
function finishQuiz() {
  const quiz = state.quiz;
  const row = {
    level: quiz.level || 'Topic practice', category: quiz.category,
    total: quiz.questionIds.length, correct: quiz.score,
    accuracy: quiz.questionIds.length ? quiz.score / quiz.questionIds.length : 0,
    completedAt: new Date().toISOString(), answers: quiz.answers
  };
  state.lastQuiz = row;
  state.sessions.unshift(row); state.sessions = state.sessions.slice(0, 12); persistSessions();
  state.quiz = null; state.view = 'results'; render('.result-hero h2');
}
function renderResultSummary() {
  const row = state.lastQuiz || state.sessions[0];
  if (!row) return '<div class="empty-state"><strong>No completed sessions yet</strong>Start a pathway to see your learning history.</div>';
  const pct = Math.round(row.accuracy * 100);
  let label = pct >= 85 ? 'Strong scenario performance' : pct >= 65 ? 'Good progress — keep practicing' : 'A useful starting point for revision';
  return `<div class="panel result-hero"><span class="eyebrow">SESSION COMPLETE</span><div class="result-ring" style="--score:${pct * 3.6}deg"><strong>${pct}%</strong></div><h2>${label}</h2><p>You answered ${row.correct} of ${row.total} scenarios correctly in ${esc(row.level)}.</p><div class="result-stat-grid"><div class="result-stat"><strong>${row.correct}/${row.total}</strong><small>CORRECT ANSWERS</small></div><div class="result-stat"><strong>${row.total - row.correct}</strong><small>REVIEW ITEMS</small></div><div class="result-stat"><strong>+${row.correct * 25 + (row.total - row.correct) * 8}</strong><small>SESSION XP</small></div></div><div class="button-row" style="justify-content:center"><button class="btn btn-primary" data-action="start-level" data-level="${esc(row.level === 'Topic practice' ? 'Beginner' : row.level)}">Practice again →</button><button class="btn btn-secondary" data-view="paths">Other pathways</button></div></div><div class="callout" style="margin-top:13px"><strong>Interpretation:</strong> This score describes performance on this question set only. It is not a certification, risk rating or evidence of real-world security behaviour.</div>`;
}
function renderHistoryTable() {
  if (!state.sessions.length) return '<div class="empty-note">Your completed sessions will appear here.</div>';
  return `<div style="overflow-x:auto"><table class="history-table"><thead><tr><th>PATHWAY</th><th>DATE</th><th>SCORE</th><th>ACCURACY</th></tr></thead><tbody>${state.sessions.map(s => `<tr><td>${esc(s.level)}</td><td>${new Date(s.completedAt).toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'})}</td><td>${s.correct}/${s.total}</td><td><span class="pill ${s.accuracy >= .75 ? 'green' : 'amber'}">${formatPercent(s.accuracy)}</span></td></tr>`).join('')}</tbody></table></div>`;
}
function renderResults() {
  const stats = calculateStats(state.progress);
  return `<div class="eyebrow">PERFORMANCE & RETENTION</div><h1 class="page-title">My progress</h1><p class="page-subtitle">Review your recorded first attempts, recent practice sessions and topic-level signals. Data is stored locally on this device.</p>
    <div class="section-head"><div><h2>${state.lastQuiz ? 'Latest session' : 'Learning summary'}</h2><p>${state.lastQuiz ? 'Your most recently completed session.' : 'Summary across unique questions attempted.'}</p></div></div>
    ${state.lastQuiz ? renderResultSummary() : `<div class="metric-grid">${metricCard('QUESTIONS ANSWERED',stats.answered,'Unique first attempts','◷')}${metricCard('FIRST-ATTEMPT ACCURACY',formatPercent(stats.accuracy),'Across all topics','◎')}${metricCard('CORRECT ANSWERS',stats.correct,'First responses only','✓')}${metricCard('SESSIONS COMPLETED',state.sessions.length,'Recent local history','▤')}</div>`}
    <div class="section-head"><div><h2>Session history</h2><p>Most recent 12 sessions on this device.</p></div></div><section class="panel">${renderHistoryTable()}</section>
    <div class="section-head"><div><h2>Topic strengths and gaps</h2><p>Topics with lower practice accuracy may benefit from review.</p></div></div><section class="panel">${renderTopicBars(stats)}</section>`;
}
function renderResearch() {
  return `<div class="eyebrow">EVIDENCE & TRACEABILITY</div><h1 class="page-title">Research sources</h1><p class="page-subtitle">Questions link to the numbered sources in the project's IEEE-structured manuscript. These references provide supporting guidance; they do not constitute experimental validation of this application.</p>
    <section class="panel research-background"><div class="panel-head"><h2>Project background & attached research paper</h2><span class="pill amber">DRAFT · NOT SUBMITTED</span></div><p><strong>CyberAware 3D:</strong> A Research-Driven AI-Enhanced Framework for Progressive Cybersecurity Awareness Training Through Interactive Three-Dimensional Simulations and Question-Level Educational Videos.</p><p>The attached draft frames cybersecurity awareness as a decision-support problem: users must recognize suspicious actions, verify identity and authority, report concerns and avoid unsafe approvals. It notes that large field studies have found limited or mixed effects from common phishing training, while feedback engagement is often weak. It therefore places scenario-based retrieval practice, per-option explanations and item-level research traceability at the centre; videos and 3D are optional supporting layers that must not add cognitive load or replace clear 2D alternatives.</p><p>The conceptual framework on page 5 connects evidence and standards to learning objectives, scenario questions, explanations, optional media, adaptive recommendations and measurable simulated decisions. The architecture and learning-level diagrams on page 6 describe a static-first web application, offline content pipeline and four progressive learning levels.</p><p class="muted">Source status: the supplied 9-page PDF is labelled Draft v0.1, preview layout (not the official IEEEtran class), not submitted, and reports no empirical results. Affiliation details remain to be confirmed. The paper is presented as the project’s background document, not as an accepted or published paper.</p><p><a class="btn btn-secondary" href="/data/research-paper-preview.pdf" target="_blank" rel="noopener noreferrer">Open attached research paper (PDF) ↗</a> <a class="source-link" href="/data/research-paper-preview.pdf" download>Download PDF</a></p></section>
    <div class="section-head"><div><h2>Reference library</h2><p>${state.references.length} numbered manuscript references available locally.</p></div><span class="pill">IEEE NUMBERING</span></div>
    <div class="source-list">${state.references.map(r => {
      const rawUrl = (r.text.match(/https?:\/\/[^\s]+/) || [])[0];
      const doi = (r.text.match(/doi:\s*([^,.; ]+)/i) || [])[1];
      const url = (rawUrl || (doi ? `https://doi.org/${doi}` : '')).replace(/[.,;]+$/,'');
      return `<article class="source-row"><span class="source-id">[${esc(r.id)}]</span><p>${esc(r.text)}</p>${url ? `<a class="source-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Open source ↗</a>` : ''}</article>`;
    }).join('')}</div>
    <div class="callout" style="margin-top:15px"><strong>Evidence boundary:</strong> The project’s manuscript is an initial rapid scoping synthesis. Source identifiers are included for traceability; each item still requires cybersecurity subject-matter and pedagogical review before public release.</div>`;
}
function renderAchievements() {
  const stats = calculateStats(state.progress);
  const achievements = [
    { title:'First steps', desc:'Complete your first scenario.', earned:stats.answered >= 1, icon:'✧' },
    { title:'Five scenarios', desc:'Submit first attempts on five unique questions.', earned:stats.answered >= 5, icon:'◈' },
    { title:'Ten scenarios', desc:'Submit first attempts on ten unique questions.', earned:stats.answered >= 10, icon:'⬡' },
    { title:'Careful analyst', desc:'Reach at least 80% first-attempt accuracy across ten questions.', earned:stats.answered >= 10 && stats.accuracy >= .8, icon:'◎' },
    { title:'Three-topic learner', desc:'Attempt questions across three different categories.', earned:stats.byTopic.length >= 3, icon:'▦' },
    { title:'Learning explorer', desc:'Attempt all three core learning levels.', earned:LEVELS.every(l => stats.byLevel[l].answered > 0), icon:'⌁' },
    { title:'Governance challenger', desc:'Complete all Expert Challenge scenarios.', earned:stats.byLevel['Expert Challenge'].answered >= state.expertQuestions.length, icon:'✦' }
  ];
  return `<div class="eyebrow">MILESTONES</div><h1 class="page-title">Achievements</h1><p class="page-subtitle">Recognition for consistent learning activity. Badges are motivational indicators, not security qualifications.</p><div class="level-grid" style="margin-top:24px">${achievements.map(a => `<article class="level-card" style="min-height:160px"><div class="level-top"><span class="level-number">${a.earned ? 'UNLOCKED' : 'IN PROGRESS'}</span><span class="level-symbol" style="${a.earned ? 'color:var(--green);background:rgba(72,215,161,.1)' : ''}">${a.icon}</span></div><h3>${esc(a.title)}</h3><p>${esc(a.desc)}</p><div class="level-card-footer"><span>${a.earned ? '<span class="pill green">EARNED</span>' : '<span class="pill">NOT YET EARNED</span>'}</span></div></article>`).join('')}</div>`;
}
function renderSettings() {
  return `<div class="eyebrow">PREFERENCES & PRIVACY</div><h1 class="page-title">Settings</h1><p class="page-subtitle">Manage this device's learning experience and locally stored progress.</p>
    <div class="settings-grid" style="margin-top:22px"><section class="panel"><div class="panel-head"><h3>Accessibility</h3><span>DISPLAY</span></div><div class="setting-row"><div><strong>Reduced motion</strong><small>Reduce non-essential movement and transitions.</small></div><button class="switch" role="switch" aria-checked="${state.settings.reducedMotion}" data-action="toggle-motion" aria-label="Reduced motion"><span></span></button></div><div class="setting-row"><div><strong>2D learning interface</strong><small>Core learning remains available without WebGL or 3D interaction.</small></div><span class="pill green">AVAILABLE</span></div></section>
    <section class="panel"><div class="panel-head"><h3>Data & privacy</h3><span>LOCAL STORAGE</span></div><div class="setting-row"><div><strong>Progress storage</strong><small>First-attempt outcomes and recent session summaries stay in this browser.</small></div><span class="pill green">ON DEVICE</span></div><div class="setting-row"><div><strong>External account</strong><small>No account, password, OTP or private credential is collected by this demo.</small></div><span class="pill">NOT USED</span></div><div class="setting-row"><div><strong>Reset learning data</strong><small>Delete locally stored progress and session history.</small></div><button class="btn btn-secondary" data-action="reset-progress">Reset data</button></div></section></div>
    <div class="callout" style="margin-top:15px"><strong>Privacy boundary:</strong> Clearing this site's browser storage removes progress from this device. This demonstrator does not synchronize activity to a server.</div>`;
}
function renderSimulationCard(sim) {
  const progress = state.simulationProgress[sim.id] || {};
  const done = progress.completed === true;
  return `<article class="simulation-card ${esc(sim.id)}"><div class="simulation-card-top"><span class="pill">${esc(sim.level)}</span><span class="simulation-card-icon" aria-hidden="true">${({phishing:'✉',password:'▣',mfa:'◈',incident:'⬡'})[sim.id]}</span></div><h2>${esc(sim.title)}</h2><p>${esc(sim.description)}</p><div class="simulation-card-meta"><span>${done ? '<span class="pill green">COMPLETED</span>' : 'INTERACTIVE EXERCISE'}</span><span>${progress.attempts || 0} attempt(s)</span></div><button class="btn ${done ? 'btn-secondary' : 'btn-primary'}" data-action="open-simulation" data-simulation="${esc(sim.id)}">${done ? 'Practice again →' : 'Enter simulation →'}</button></article>`;
}
function renderSimulationFeedback(complete, message) {
  if (!message) return '';
  return `<div class="simulation-feedback ${complete ? 'success' : 'review'}" role="status"><strong>${complete ? 'Learning objective achieved' : 'Review this decision'}</strong><p>${esc(message)}</p></div>`;
}
function renderPhishingTask() {
  const selected = new Set(state.simulation.selectedIndicators);
  const indicators = PHISHING_INDICATORS.map(item => `<button type="button" class="simulation-choice ${selected.has(item.id) ? 'selected' : ''}" data-action="sim-phish-toggle" data-indicator="${item.id}" aria-pressed="${selected.has(item.id)}"><span class="choice-check">${selected.has(item.id) ? '✓' : '+'}</span><span>${esc(item.label)}</span></button>`).join('');
  const result = state.simulation.submitted ? (() => { const correct = PHISHING_INDICATORS.filter(x=>x.correct).map(x=>x.id); const exact = correct.length===selected.size && correct.every(id=>selected.has(id)); return `<div class="simulation-review"><strong>${exact ? 'All indicators correctly identified.' : 'Compare your selections with the evidence.'}</strong><ul>${PHISHING_INDICATORS.map(x=>`<li class="${x.correct?'is-correct':'is-neutral'}"><b>${x.correct?'Warning sign':'Not reliable by itself'}:</b> ${esc(x.why)}</li>`).join('')}</ul>${renderSimulationFeedback(exact, exact ? 'You identified the sender-domain mismatch, urgency, mismatched destination and unexpected credential request. Verify through a separate trusted channel.' : 'Select all four evidence-based indicators and leave the two neutral details unselected. A logo or polished grammar does not authenticate a message.')}${exact ? '<span class="pill green">SIMULATION COMPLETED</span>' : '<button class="btn btn-secondary" data-action="sim-retry">Try again</button>'}</div>`; })() : `<p class="simulation-instruction">Select every true warning sign. Two details are deliberately included because they are not reliable indicators on their own.</p><div class="simulation-options">${indicators}</div><div class="simulation-actions"><span class="muted">${selected.size} selected · 4 evidence-based indicators</span><button class="btn btn-primary" data-action="sim-phish-submit" ${selected.size ? '' : 'disabled'}>Check evidence →</button></div>`;
  return `<section class="simulation-task"><div class="task-kicker">01 / INSPECT THE MESSAGE</div><div class="fake-email"><div class="email-toolbar"><span class="email-dot"></span><span class="email-dot"></span><span class="email-dot"></span><small>INCOMING MESSAGE · TRAINING ENVIRONMENT</small></div><div class="email-content"><div class="vendor-logo">NORTHSTAR <span>SUPPLIES</span></div><div class="email-subject">Supplier account verification required</div><div class="email-meta"><span>Known domain</span><strong>northstar-supplies.example <em>· vendor register</em></strong></div><div class="email-meta"><span>From</span><strong>Northstar Supplies</strong><code>billing@northstar-supplies.verify-account.example</code></div><div class="email-meta"><span>To</span><strong>accounts@example.org</strong></div><p>We detected an issue with your supplier account. Sign in through the link below within 10 minutes to prevent a payment hold.</p><div class="email-link"><strong>Visible link text</strong><span>https://northstar-supplies.example/account</span><small>Destination shown by the message preview: https://northstar-supplies.verify-account.example/login</small></div><p class="email-signoff">Northstar Supplies Accounts Team</p></div></div>${result}</section>`;
}
function renderPasswordTask() {
  const profile=state.simulation.password, result=scorePasswordProfile(profile);
  return `<section class="simulation-task"><div class="task-kicker">01 / CONFIGURE A FICTIONAL PROFILE</div><div class="privacy-note"><strong>Training safety:</strong> Do not type or paste a real password here. This exercise stores only the selected security characteristics, never a credential.</div><div class="profile-builder"><div class="builder-row"><div><strong>Length or passphrase size</strong><small>Prefer long, unique credentials.</small></div><div class="choice-group">${[12,16,20,24].map(n=>`<button class="choice-pill ${profile.length===n?'active':''}" data-action="sim-password-length" data-value="${n}" aria-pressed="${profile.length===n}">${n}+</button>`).join('')}</div></div>${[['unique','Unique for this account','Avoid reuse across services.'],['manager','Password manager used','Generate and store a unique credential.'],['mfa','MFA enabled','Use phishing-resistant MFA where available.']].map(([key,label,note])=>`<div class="builder-row"><div><strong>${label}</strong><small>${note}</small></div><button class="switch" role="switch" aria-checked="${profile[key]}" data-action="sim-password-toggle" data-key="${key}" aria-label="${label}"><span></span></button></div>`).join('')}</div>${state.simulation.passwordAssessed ? `<div class="strength-result"><div class="strength-score"><strong>${result.score}%</strong><span>PROFILE CHECKS MET</span></div><div class="strength-track"><span style="width:${result.score}%"></span></div><ul>${result.checks.map(c=>`<li class="${c.passed?'pass':'fail'}">${c.passed?'✓':'○'} ${esc(c.label)}</li>`).join('')}</ul>${renderSimulationFeedback(result.ready, result.ready ? 'Good training configuration: long, unique, manager-stored credentials with MFA. This is a characteristics checklist, not a password-cracking or cryptographic strength test.' : 'Improve the unchecked characteristics, then reassess. Length alone does not compensate for reuse or unsafe storage.')}${result.ready ? '<span class="pill green">SIMULATION COMPLETED</span>' : '<button class="btn btn-secondary" data-action="sim-password-adjust">Adjust profile</button>'}</div>` : `<div class="simulation-actions"><span class="muted">No credential input · local characteristics only</span><button class="btn btn-primary" data-action="sim-password-assess">Assess configuration →</button></div>`}<p class="muted small-note">The score is a simple educational checklist, not a formal entropy calculation, password audit or guarantee of account security.</p></section>`;
}
function renderDecisionSteps(kind, steps) {
  const current=state.simulation.stepIndex, step=steps[current];
  if (state.simulation.complete) return `<section class="simulation-task"><div class="task-kicker">DECISION SEQUENCE COMPLETE</div><div class="simulation-feedback success" role="status"><strong>Safe response sequence completed.</strong><p>${kind==='mfa'?'You denied and reported unexpected prompts, used a trusted route to secure the account, and preserved useful evidence without sharing secrets.':'You prioritized containment, reported through an approved channel, and preserved evidence for authorized responders.'}</p></div><span class="pill green">SIMULATION COMPLETED</span><button class="btn btn-secondary" data-action="sim-retry">Run again</button></section>`;
  const choice=state.simulation.stepChoice;
  return `<section class="simulation-task"><div class="task-kicker">STEP ${current+1} / ${steps.length} · ${kind==='mfa'?'AUTHENTICATION RESPONSE':'INCIDENT RESPONSE'}</div><div class="step-progress" role="progressbar" aria-label="Simulation sequence progress" aria-valuemin="0" aria-valuemax="${steps.length}" aria-valuenow="${current}"><span style="width:${current/steps.length*100}%"></span></div><h3 class="decision-prompt">${esc(step.prompt)}</h3><div class="simulation-options">${step.options.map((o,i)=>`<button class="simulation-choice ${choice===o.id?'selected':''}" data-action="sim-step-choice" data-choice="${o.id}" aria-pressed="${choice===o.id}" ${choice?'disabled':''}><span class="choice-check">${String.fromCharCode(65+i)}</span><span>${esc(o.label)}</span></button>`).join('')}</div>${choice ? (()=>{const selected=step.options.find(o=>o.id===choice);return `<div class="simulation-feedback ${selected.correct?'success':'review'}" role="status"><strong>${selected.correct?'Correct decision':'Not the safest action'}</strong><p>${esc(selected.feedback)}</p></div>${selected.correct ? `<button class="btn btn-primary" data-action="sim-step-continue">${current===steps.length-1?'Complete simulation':'Continue →'}</button>` : '<button class="btn btn-secondary" data-action="sim-step-retry">Choose again</button>'}`;})() : '<p class="muted small-note">Choose the safest defensive action. Incorrect choices provide feedback; you can retry this step.</p>'}</section>`;
}
function renderSimulationDetail(sim) {
  const completed=state.simulationProgress[sim.id]?.completed;
  let task=sim.id==='phishing'?renderPhishingTask():sim.id==='password'?renderPasswordTask():sim.id==='mfa'?renderDecisionSteps('mfa',MFA_STEPS):renderDecisionSteps('incident',INCIDENT_STEPS);
  return `<div class="eyebrow">INTERACTIVE LEARNING ENVIRONMENT · ${esc(sim.level.toUpperCase())}</div><div class="simulation-detail-head"><div><h1 class="page-title">${esc(sim.title)}</h1><p class="page-subtitle">${esc(sim.description)}</p></div><button class="btn btn-quiet" data-action="back-simulations">← All simulations</button></div><div class="simulation-detail-grid"><div class="simulation-visual-column">${renderSimulationSceneBlock(sim)}<section class="panel simulation-objective"><span class="task-kicker">LEARNING OBJECTIVE</span><p>${esc(sim.objective)}</p><div class="reference-chips">${sim.references.map(ref=>`<span class="reference-chip">${esc(ref)}</span>`).join('')}</div><small>Related question IDs: ${esc(sim.questionIds.join(' · '))}</small></section></div><div class="simulation-interaction-column">${task}</div></div>${completed?'<div class="callout" style="margin-top:15px"><strong>Previous completion recorded:</strong> You have completed this simulation before. Repeated practice is allowed; the record stores completion and attempts, not sensitive input.</div>':''}`;
}
function renderSimulations() {
  const sim=simulationDefinition(state.simulation.activeId);
  if(sim) return renderSimulationDetail(sim);
  const completed=SIMULATION_DEFS.filter(x=>state.simulationProgress[x.id]?.completed).length;
  return `<div class="eyebrow">SCENARIO LABORATORY</div><h1 class="page-title">Interactive simulations</h1><p class="page-subtitle">Practice defensive decisions in four guided environments. 3D scenes are locally rendered illustrations; all exercises remain usable through the accessible 2D interface.</p><div class="simulation-summary"><div><strong>${completed}/4</strong><span>SIMULATIONS COMPLETED</span></div><div><strong>WEBGL</strong><span>LOCAL 3D RENDERING</span></div><div><strong>2D</strong><span>FALLBACK AVAILABLE</span></div></div><div class="simulation-card-grid">${SIMULATION_DEFS.map(renderSimulationCard).join('')}</div><div class="callout" style="margin-top:18px"><strong>Safety boundary:</strong> These are fictional, defensive exercises. Do not enter real passwords, OTPs, recovery codes, tokens or confidential information. The simulations do not perform network actions or test live systems.</div>`;
}

const viewRenderers = {
  dashboard: renderDashboard,
  paths: renderPaths,
  topics: renderTopics,
  quiz: renderQuiz,
  results: renderResults,
  research: renderResearch,
  achievements: renderAchievements,
  settings: renderSettings,
  simulations: renderSimulations
};
const viewLabels = { dashboard:'Overview', paths:'Learning paths', topics:'Topic library', quiz:'Assessment', results:'My progress', research:'Research sources', achievements:'Achievements', settings:'Settings', simulations:'Simulations' };
async function verifyCurrentVideo() {
  if (!state.quiz?.answered) return;
  const q = currentQuestion();
  const entry = q ? manifestByVideoId(q.videoId) : null;
  if (!entry || entry.status !== 'ready' || entry.mediaFileExists !== true || !entry.plannedOutputPath || state.mediaValidated[q.videoId] !== undefined) return;
  state.mediaValidated[q.videoId] = 'checking';
  const mediaPath = `/${entry.plannedOutputPath.replace(/^public\//,'')}`;
  const captionPath = `/${(entry.captionsPath || '').replace(/^content\//,'data/')}`;
  try {
    const [media, captions] = await Promise.all([fetch(mediaPath, { method: 'HEAD' }), fetch(captionPath, { method: 'HEAD' })]);
    const validMedia = media.ok && (media.headers.get('content-type') || '').includes('video/mp4');
    const validCaptions = captions.ok && (captions.headers.get('content-type') || '').includes('text/vtt');
    state.mediaValidated[q.videoId] = Boolean(validMedia && validCaptions);
  } catch { state.mediaValidated[q.videoId] = false; }
  if (state.view === 'quiz' && currentQuestion()?.videoId === q.videoId) render();
}
function render(focusSelector = null) {
  const renderer = viewRenderers[state.view] || renderDashboard;
  appView.innerHTML = renderer();
  appView.setAttribute('aria-busy', 'false');
  stopSimulationScene();
  if (state.view === 'dashboard') initGlobe($('#cyber-globe'), $('#globe-fallback'), state.settings.reducedMotion);
  if (state.view === 'simulations' && state.simulation.activeId) initSimulationScene($('#simulation-scene-canvas'), state.simulation.activeId, state.settings.reducedMotion);
  if (state.view === 'quiz' && state.quiz?.answered) verifyCurrentVideo();
  $('#page-label').textContent = viewLabels[state.view] || 'Overview';
  document.querySelectorAll('.nav-item').forEach(btn => {
    const active = btn.dataset.view === state.view || (state.view === 'quiz' && btn.dataset.view === 'paths');
    btn.classList.toggle('active', active);
    if (active) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
  });
  document.body.classList.toggle('reduce-motion', state.settings.reducedMotion);
  const storageNote = document.querySelector('.secure-status small');
  if (storageNote) storageNote.textContent = hasLocalStorage ? 'Progress stays on this device' : 'Progress is temporary in this session';
  $('#today-label').textContent = new Date().toLocaleDateString(undefined,{weekday:'short',day:'2-digit',month:'short',year:'numeric'}).toUpperCase();
  if (focusSelector) {
    requestAnimationFrame(() => {
      const target = $(focusSelector, appView);
      if (target) {
        if (!target.matches('button, a, input, select, textarea, [tabindex]')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  }
}
async function toggleTranscript(videoId) {
  if (state.transcript.id === videoId && state.transcript.text) { state.transcript = { id: null, text: '', loading: false }; render('button[data-action="toggle-transcript"]'); return; }
  const entry = manifestByVideoId(videoId);
  if (!entry) return;
  state.transcript = { id: videoId, text: '', loading: true }; render('button[data-action="toggle-transcript"]');
  try {
    const path = entry.transcriptPath || entry.scriptPath;
    if (!path || typeof path !== 'string') throw new Error('This question’s video work is deferred by owner direction.');
    const relative = path.replace(/^content\//,'/data/');
    const response = await fetch(relative);
    if (!response.ok) throw new Error('Transcript is not available');
    const content = await response.text();
    state.transcript = { id: videoId, text: content, loading: false };
  } catch (error) {
    state.transcript = { id: videoId, text: 'The draft transcript could not be loaded. Use the project package at content/videos/scripts for the source file.', loading: false };
  }
  render('#video-transcript');
}
function handleClick(event) {
  const button = event.target.closest('button, [data-view]');
  if (!button) return;
  if (button.dataset.view) { setView(button.dataset.view); return; }
  const action = button.dataset.action;
  if (!action) return;
  switch (action) {
    case 'start-level': startLevel(button.dataset.level); break;
    case 'open-simulation': state.simulation = createSimulationAttempt(button.dataset.simulation); state.view = 'simulations'; render('h1'); break;
    case 'back-simulations': state.simulation = createSimulationAttempt(null); render('h1'); break;
    case 'sim-phish-toggle': {
      if (!state.simulation.submitted) { const id=button.dataset.indicator, rows=new Set(state.simulation.selectedIndicators); rows.has(id) ? rows.delete(id) : rows.add(id); state.simulation.selectedIndicators=[...rows]; render(`button[data-indicator="${id}"]`); }
      break;
    }
    case 'sim-phish-submit': {
      const selected=new Set(state.simulation.selectedIndicators), correct=PHISHING_INDICATORS.filter(x=>x.correct).map(x=>x.id);
      const passed=selected.size===correct.length&&correct.every(id=>selected.has(id)); state.simulation.submitted=true;
      saveSimulationResult('phishing',passed?100:Math.round(correct.filter(id=>selected.has(id)).length/correct.length*100)); render('h1'); break;
    }
    case 'sim-password-length': state.simulation.password.length=Number(button.dataset.value); state.simulation.passwordAssessed=false; render(`button[data-value="${button.dataset.value}"]`); break;
    case 'sim-password-toggle': { const key=button.dataset.key; state.simulation.password[key]=!state.simulation.password[key]; state.simulation.passwordAssessed=false; render(`button[data-key="${key}"]`); break; }
    case 'sim-password-assess': { const result=scorePasswordProfile(state.simulation.password); state.simulation.passwordAssessed=true; saveSimulationResult('password',result.score); render('h1'); break; }
    case 'sim-password-adjust': state.simulation.passwordAssessed=false; render('h1'); break;
    case 'sim-step-choice': {
      if (!state.simulation.stepChoice) { const steps=state.simulation.activeId==='mfa'?MFA_STEPS:INCIDENT_STEPS; const option=steps[state.simulation.stepIndex]?.options.find(o=>o.id===button.dataset.choice); if(option){ state.simulation.stepChoice=option.id; state.simulation.feedback=option.feedback; if(!option.correct&&!state.simulation.runRecorded){saveSimulationResult(state.simulation.activeId,0);state.simulation.runRecorded=true;} render(`button[data-choice="${option.id}"]`); } }
      break;
    }
    case 'sim-step-continue': {
      const steps=state.simulation.activeId==='mfa'?MFA_STEPS:INCIDENT_STEPS;
      if(state.simulation.stepIndex<steps.length-1){state.simulation.stepIndex++;state.simulation.stepChoice=null;state.simulation.feedback=null;} else {state.simulation.complete=true;saveSimulationResult(state.simulation.activeId,100,!state.simulation.runRecorded);state.simulation.runRecorded=true;}
      render('h1'); break;
    }
    case 'sim-step-retry': state.simulation.stepChoice=null; state.simulation.feedback=null; render('h1'); break;
    case 'sim-retry': state.simulation=createSimulationAttempt(state.simulation.activeId); render('h1'); break;
    case 'topic-practice': startTopic(button.dataset.category); break;
    case 'topic-filter': state.topicFilter = button.dataset.filter; render(`button[data-filter="${CSS.escape(button.dataset.filter)}"]`); break;
    case 'select-option':
      if (state.quiz && !state.quiz.answered) { state.quiz.selected = button.dataset.option; render(`button[data-option="${button.dataset.option}"]`); }
      break;
    case 'submit-answer': submitAnswer(); break;
    case 'next-question': nextQuestion(); break;
    case 'exit-quiz': state.quiz = null; setView('paths'); break;
    case 'toggle-transcript': toggleTranscript(button.dataset.video); break;
    case 'toggle-motion':
      state.settings.reducedMotion = !state.settings.reducedMotion; persistSettings(); render('#motion-toggle'); showToast(`Reduced motion ${state.settings.reducedMotion ? 'enabled' : 'disabled'}.`); break;
    case 'reset-progress':
      if (confirm('Delete all locally stored CyberAware 3D progress and session history from this browser?')) {
        state.progress = { version: 2, attempts: [] }; state.sessions = []; state.lastQuiz = null; state.simulationProgress = {};
        persistProgress(); persistSessions(); writeSimulationProgress(); showToast('Local learning data has been reset.'); render('button[data-action="reset-progress"]');
      }
      break;
  }
}
async function boot() {
  persistSettings();
  if (!hasLocalStorage) showToast('Browser storage is unavailable; progress will not persist after this session.');
  appView.addEventListener('click', handleClick);
  appView.addEventListener('error', event => {
    const mediaId = event.target?.dataset?.video || event.target?.closest?.('video')?.dataset?.video;
    if (!mediaId) return;
    state.mediaValidated[mediaId] = false;
    if (currentQuestion()?.videoId === mediaId) {
      render();
      showToast('Video playback or captions failed. The written explanation and transcript remain available.');
    }
  }, true);
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', handleClick));
  $('#motion-toggle').addEventListener('click', () => {
    state.settings.reducedMotion = !state.settings.reducedMotion; persistSettings(); render('#motion-toggle');
    showToast(`Reduced motion ${state.settings.reducedMotion ? 'enabled' : 'disabled'}.`);
  });
  try {
    const [questionsDoc, explanationsDoc, manifestDoc, referencesDoc, expertDoc, expertExplanationsDoc, expertManifestDoc] = await Promise.all([
      fetch('/data/question-bank.json').then(r => { if (!r.ok) throw new Error('Question bank could not be loaded'); return r.json(); }),
      fetch('/data/explanations.json').then(r => { if (!r.ok) throw new Error('Explanations could not be loaded'); return r.json(); }),
      fetch('/data/video-manifest.json').then(r => { if (!r.ok) throw new Error('Video manifest could not be loaded'); return r.json(); }),
      fetch('/data/references.json').then(r => { if (!r.ok) throw new Error('Research references could not be loaded'); return r.json(); }),
      fetch('/data/expert-challenge.json').then(r => { if (!r.ok) throw new Error('Expert Challenge content could not be loaded'); return r.json(); }),
      fetch('/data/expert-explanations.json').then(r => { if (!r.ok) throw new Error('Expert Challenge explanations could not be loaded'); return r.json(); }),
      fetch('/data/expert-video-manifest.json').then(r => { if (!r.ok) throw new Error('Expert Challenge video manifest could not be loaded'); return r.json(); })
    ]);
    state.questions = questionsDoc.questions || [];
    state.expertQuestions = expertDoc.questions || [];
    state.explanations = [...(explanationsDoc.explanations || []), ...(expertExplanationsDoc.explanations || [])];
    state.manifest = [...(manifestDoc.entries || []), ...(expertManifestDoc.entries || [])];
    state.references = referencesDoc || [];
    const error = validateClientContent();
    if (error) throw new Error(error);
    const requestedView = new URLSearchParams(location.search).get('view');
    if (requestedView && Object.hasOwn(viewRenderers, requestedView)) state.view = requestedView;
    render();
  } catch (error) {
    appView.innerHTML = `<div class="panel empty-state"><strong>Learning content unavailable</strong>${esc(error.message)}<br><br>Run the local server from the frontend directory and reload this page.</div>`;
  }
}
function validateClientContent() {
  if (state.explanations.length !== state.questions.length + state.expertQuestions.length || state.manifest.length !== state.explanations.length) return 'Core and Expert Challenge explanation/video manifest count mismatch.';
  const all = allQuestions();
  const ids = new Set(all.map(q => q.questionId));
  if (ids.size !== state.questions.length + state.expertQuestions.length) return 'Duplicate question identifiers were detected across the core and Expert Challenge banks.';
  for (const q of all) {
    if (!state.explanations.some(e => e.questionId === q.questionId && e.explanationId === q.explanationId)) return `Missing explanation mapping for ${q.questionId}.`;
    if (!state.manifest.some(v => v.questionId === q.questionId && v.videoId === q.videoId)) return `Missing video mapping for ${q.questionId}.`;
    if (q.options?.length !== 4 || !q.optionExplanations || Object.keys(q.optionExplanations).length !== 4) return `Incomplete answer options for ${q.questionId}.`;
    if (!q.referenceIds?.length || q.referenceIds.some(id => !state.references.some(ref => `[${ref.id}]` === id))) return `Unresolved research reference for ${q.questionId}.`;
  }
  return null;
}
boot();
