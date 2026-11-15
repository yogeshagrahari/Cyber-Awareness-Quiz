import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { loadLearningData, scriptRoute, captionsRoute, mediaRoute } from './data.ts';
import { addAttempt, calculateStats, isUnlocked, percentage, recommendations, safeReadProgress, PROGRESS_KEY, SETTINGS_KEY, stringifyProgressExport, parseProgressExport, validateProgressForQuestions } from './progress.ts';
import { CORE_LEVELS, EXPERT_LEVEL, type LearningData, type Level, type Question, type Progress, type View, type VideoEntry } from './types.ts';

const nav: Array<{id: View; label: string; glyph: string}> = [
  { id: 'dashboard', label: 'Overview', glyph: '⌂' }, { id: 'paths', label: 'Learning paths', glyph: '◈' },
  { id: 'topics', label: 'Topic library', glyph: '▦' }, { id: 'simulations', label: 'Simulations', glyph: '◉' },
  { id: 'progress', label: 'My progress', glyph: '◷' }, { id: 'research', label: 'Research sources', glyph: '⌕' },
  { id: 'achievements', label: 'Achievements', glyph: '✧' }, { id: 'settings', label: 'Settings', glyph: '⚙' }
];
const viewTitles: Record<View, string> = { dashboard: 'Overview', paths: 'Learning paths', topics: 'Topic library', quiz: 'Assessment', simulations: 'Simulation lab', progress: 'My progress', research: 'Research sources', achievements: 'Achievements', settings: 'Settings' };

function readLocal(key: string): string | null { try { const value = localStorage.getItem(key); return value && value.length <= 2_000_000 ? value : null; } catch { return null; } }
function writeLocal(key: string, value: string): void { try { localStorage.setItem(key, value); } catch { /* app remains usable in memory */ } }
function initialReducedMotion(): boolean {
  try { const parsed: unknown = JSON.parse(readLocal(SETTINGS_KEY) || '{}'); if (parsed && typeof parsed === 'object' && 'reducedMotion' in parsed && typeof parsed.reducedMotion === 'boolean') return parsed.reducedMotion; } catch { /* use system preference */ }
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export default function App() {
  const [data, setData] = useState<LearningData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [progress, setProgress] = useState<Progress>(() => safeReadProgress(readLocal(PROGRESS_KEY)));
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion);
  const [toast, setToast] = useState('');
  const [quiz, setQuiz] = useState<{questions: Question[]; index: number; selected: string | null; answered: boolean; finished: boolean; sessionCorrect: number; levelLabel: string; topicPractice: boolean} | null>(null);
  const [topicFilter, setTopicFilter] = useState('All');
  const [resetConfirmation, setResetConfirmation] = useState(false);
  const [pendingImport, setPendingImport] = useState<{ progress: Progress; fileName: string } | null>(null);
  const stats = useMemo(() => calculateStats(progress), [progress]);
  const recommendation = useMemo(() => recommendations(progress), [progress]);

  useEffect(() => { let cancelled = false; loadLearningData().then(value => { if (!cancelled) setData(value); }).catch(error => { if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Learning content could not be loaded.'); }); return () => { cancelled = true; }; }, []);
  useEffect(() => { writeLocal(PROGRESS_KEY, JSON.stringify(progress)); }, [progress]);
  useEffect(() => { writeLocal(SETTINGS_KEY, JSON.stringify({ reducedMotion })); document.body.classList.toggle('reduce-motion', reducedMotion); }, [reducedMotion]);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(''), 2800); return () => window.clearTimeout(timer); }, [toast]);
  useEffect(() => { const heading = document.querySelector<HTMLElement>('.view-content h1'); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); } }, [view, quiz?.index, quiz?.finished]);

  const navigate = (next: View) => { setView(next); if (next !== 'quiz') setQuiz(null); setResetConfirmation(false); window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }); };
  const beginQuiz = (level: Level | 'Topic practice', category?: string) => {
    if (!data) return;
    let questions = data.questions.filter(question => level === 'Topic practice' ? question.category === category : question.level === level);
    if (!questions.length) { setToast('No questions match this selection.'); return; }
    const unanswered = questions.filter(question => !progress.attempts.some(attempt => attempt.questionId === question.questionId && (level === 'Topic practice' || attempt.countedForMastery)));
    const pool = unanswered.length ? unanswered : questions;
    setQuiz({ questions: pool, index: 0, selected: null, answered: false, finished: false, sessionCorrect: 0, levelLabel: level === 'Topic practice' ? `${category} practice` : level, topicPractice: level === 'Topic practice' });
    navigate('quiz');
  };
  const currentQuestion = quiz?.questions[quiz.index] ?? null;
  const answerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!quiz || !currentQuestion || !quiz.selected || quiz.answered) return;
    const next = addAttempt(progress, currentQuestion, quiz.selected, new Date().toISOString(), !quiz.topicPractice || isUnlocked(progress, currentQuestion.level));
    const newlyCounted = next.attempts.at(-1)?.countedForMastery === true;
    setProgress(next);
    const isCorrect = quiz.selected === currentQuestion.correctOptionId;
    setQuiz({ ...quiz, answered: true, sessionCorrect: quiz.sessionCorrect + (isCorrect ? 1 : 0) });
    setToast(isCorrect ? (newlyCounted ? 'Correct answer. First-attempt progress recorded.' : 'Correct answer. Additional practice recorded.') : 'Answer recorded. Review each explanation below.');
  };
  const nextQuestion = () => {
    if (!quiz) return;
    if (quiz.index + 1 >= quiz.questions.length) { setQuiz({ ...quiz, finished: true }); return; }
    setQuiz({ ...quiz, index: quiz.index + 1, selected: null, answered: false });
  };

  const exportQuizProgress = () => {
    try {
      const blob = new Blob([stringifyProgressExport(progress)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `cyberaware3d-quiz-progress-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      setToast('Quiz progress backup downloaded.');
    } catch {
      setToast('Progress backup could not be created in this browser.');
    }
  };

  const selectQuizProgressImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    if (file.size > 2_000_000) { setToast('Choose a progress backup smaller than 2 MB.'); return; }
    try {
      const imported = parseProgressExport(await file.text());
      const validated = validateProgressForQuestions(imported, data?.questions ?? []);
      setPendingImport({ progress: validated, fileName: file.name });
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Progress backup could not be read.');
    }
  };

  const confirmQuizProgressImport = () => {
    if (!pendingImport) return;
    setProgress(pendingImport.progress);
    setPendingImport(null);
    setToast('Quiz progress imported. This replaces the current quiz progress on this device.');
  };

  if (loadError) return <div className="fatal-state"><h1>Learning content unavailable</h1><p>{loadError}</p><p>Check that the server exposes the project's <code>/data</code> assets and reload.</p><a href="/legacy.html">Open the verified legacy demonstrator</a></div>;
  if (!data) return <div className="boot-state" role="status">Loading CYBERAWARE 3D learning content…</div>;

  const topics = [...new Set(data.questions.map(question => question.category))].sort((a, b) => a.localeCompare(b));
  const unlockedLevels = CORE_LEVELS.filter(level => isUnlocked(progress, level)).length;
  const currentVideo = currentQuestion ? data.videos.find(entry => entry.questionId === currentQuestion.questionId) : undefined;
  const currentReferences = currentQuestion ? currentQuestion.referenceIds.map(id => data.references.find(reference => `[${reference.id}]` === id)).filter((reference): reference is NonNullable<typeof reference> => Boolean(reference)) : [];
  const earned = [
    { title: 'First steps', detail: 'Submit your first scenario.', done: stats.answered >= 1 },
    { title: 'Five scenarios', detail: 'Submit first attempts on five unique questions.', done: stats.answered >= 5 },
    { title: 'Ten scenarios', detail: 'Submit first attempts on ten unique questions.', done: stats.answered >= 10 },
    { title: 'Careful analyst', detail: 'Reach 80% first-attempt accuracy across ten questions.', done: stats.answered >= 10 && stats.accuracy >= .8 },
    { title: 'Three-topic learner', detail: 'Attempt at least three different categories.', done: stats.byTopic.length >= 3 },
    { title: 'Learning explorer', detail: 'Attempt all three core pathways.', done: CORE_LEVELS.every(level => stats.byLevel[level].answered > 0) },
    { title: 'Governance challenger', detail: `Complete all ${data.questions.filter(question => question.level === EXPERT_LEVEL).length} Expert Challenge scenarios.`, done: stats.byLevel[EXPERT_LEVEL].answered >= data.questions.filter(question => question.level === EXPERT_LEVEL).length }
  ];

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <aside className="sidebar" aria-label="Main navigation">
      <button className="brand" onClick={() => navigate('dashboard')} aria-label="CYBERAWARE 3D dashboard"><span className="brand-mark"><i/><i/><i/></span><span><strong>CYBERAWARE</strong><small>3D LEARNING SYSTEM</small></span></button>
      <div className="sidebar-label">WORKSPACE</div>
      <nav className="nav-list" aria-label="Primary navigation">{nav.slice(0, 6).map(item => <button key={item.id} className={`nav-item ${view === item.id || (view === 'quiz' && item.id === 'paths') ? 'active' : ''}`} aria-current={view === item.id || (view === 'quiz' && item.id === 'paths') ? 'page' : undefined} onClick={() => navigate(item.id)}><span aria-hidden="true">{item.glyph}</span>{item.label}</button>)}</nav>
      <div className="sidebar-label side-label-lower">SYSTEM</div>
      <nav className="nav-list" aria-label="System navigation">{nav.slice(6).map(item => <button key={item.id} className={`nav-item ${view === item.id ? 'active' : ''}`} aria-current={view === item.id ? 'page' : undefined} onClick={() => navigate(item.id)}><span aria-hidden="true">{item.glyph}</span>{item.label}</button>)}</nav>
      <div className="sidebar-bottom"><span className="local-dot"/> <div><strong>Local learning mode</strong><small>Progress stays on this device</small></div></div>
    </aside>
    <main id="main-content" className="main-content" tabIndex={-1}>
      <header className="topbar"><div className="breadcrumbs">Workspace <b>/</b> <strong>{viewTitles[view]}</strong></div><div className="top-actions"><span>{new Date().toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span><button className="motion-btn" onClick={() => setReducedMotion(value => !value)} aria-label="Toggle reduced motion" aria-pressed={reducedMotion}>◌</button></div></header>
      <section className="view-content" aria-live="off">
        {view === 'dashboard' && <>
          <section className="hero"><div><div className="eyebrow">YOUR SECURITY LEARNING COMMAND CENTER</div><h1>Build the instinct.<br/><em>Defend the digital.</em></h1><p>Practice real-world security decisions through progressive scenarios, clear explanations and research-linked learning.</p><div className="button-row"><button className="btn primary" onClick={() => beginQuiz('Beginner')}>Start learning →</button><button className="btn secondary" onClick={() => navigate('paths')}>Explore pathways</button></div></div><div className="hero-orb" role="img" aria-label="Abstract network globe representing connected digital systems"><span/><i/><b/></div></section>
          <div className="section-head"><div><h2>Your learning snapshot</h2><p>Unique first-attempt outcomes, not a measure of real-world security competence.</p></div><span className="pill">LOCAL PROFILE</span></div>
          <div className="metric-grid"><Metric label="SCENARIOS ANSWERED" value={stats.answered} note="Unique first attempts"/><Metric label="ACCURACY" value={percentage(stats.accuracy)} note={`${stats.correct} correct responses`}/><Metric label="LEARNING XP" value={stats.correct * 25 + (stats.answered - stats.correct) * 8} note="25 XP correct · 8 XP attempted"/><Metric label="PATHWAYS UNLOCKED" value={`${unlockedLevels}/3`} note="Core learning pathways"/></div>
          <div className="section-head"><div><h2>Recommended next step</h2><p>Transparent recommendations based on your recorded practice.</p></div></div><section className="panel recommendation"><div><strong>{recommendation.title}</strong><p>{recommendation.detail}</p></div><button className="btn primary" onClick={() => recommendation.category ? beginQuiz('Topic practice', recommendation.category) : recommendation.level ? beginQuiz(recommendation.level) : navigate('paths')}>Continue →</button></section>
          <div className="callout">Quiz performance is a limited measure of scenario knowledge. It does not establish that a learner will behave securely in real operational environments.</div>
        </>}
        {view === 'paths' && <><Eyebrow>PROGRESSIVE LEARNING</Eyebrow><h1>Choose your learning path</h1><p className="subtitle">Three progressive core pathways with an expanded topic bank, plus a separate organizational-level Expert Challenge.</p><div className="level-grid">{CORE_LEVELS.map(level => <LevelCard key={level} level={level} count={data.questions.filter(question => question.level === level).length} stats={stats.byLevel[level]} unlocked={isUnlocked(progress, level)} reason={level === 'Beginner' ? 'Available from the start.' : `Complete at least 10 ${level === 'Intermediate' ? 'Beginner' : 'Intermediate'} first attempts with 75% accuracy.`} onStart={() => beginQuiz(level)}/>)}</div><div className="section-head"><div><h2>Expert Challenge</h2><p>Optional organizational decision scenarios.</p></div><span className="pill amber">{data.questions.filter(question => question.level === EXPERT_LEVEL).length} SCENARIOS</span></div><LevelCard level={EXPERT_LEVEL} count={data.questions.filter(question => question.level === EXPERT_LEVEL).length} stats={stats.byLevel[EXPERT_LEVEL]} unlocked={isUnlocked(progress, EXPERT_LEVEL)} reason="Complete 10 Advanced first attempts with at least 75% accuracy." onStart={() => beginQuiz(EXPERT_LEVEL)}/></>}
        {view === 'topics' && <><Eyebrow>KNOWLEDGE LIBRARY</Eyebrow><h1>Practice by topic</h1><p className="subtitle">All topic quizzes are available immediately across the four learning levels. Practice on a locked pathway is saved, but does not count toward that pathway's mastery threshold until it is unlocked.</p><div className="topic-filter"><label htmlFor="topic-filter">Filter topics</label><select id="topic-filter" value={topicFilter} onChange={(event: {target: {value: string}}) => setTopicFilter(event.target.value)}><option>All</option>{topics.map(topic => <option key={topic}>{topic}</option>)}</select></div><div className="topic-grid">{topics.filter(topic => topicFilter === 'All' || topic === topicFilter).map(topic => { const available = data.questions.filter(question => question.category === topic); const topicStats = stats.byTopic.find(item => item.category === topic); return <article className="topic-card" key={topic}><div className="eyebrow">{available.length} QUESTIONS · ALL LEVELS</div><h2>{topic}</h2><p>{topicStats ? `${topicStats.answered} first attempts · ${percentage(topicStats.accuracy)} accuracy` : 'Not attempted yet'}</p><button className="btn secondary" disabled={!available.length} onClick={() => beginQuiz('Topic practice', topic)}>Practice {available.length} →</button></article>; })}</div></>}
        {view === 'quiz' && quiz?.finished && <section className="panel empty-state"><Eyebrow>ASSESSMENT COMPLETE</Eyebrow><h1>Practice session finished</h1><p>You answered {quiz.questions.length} question(s) and selected {quiz.sessionCorrect} correct answer(s). Your dashboard counts only the first attempt on each unique question toward progression.</p><div className="button-row center-actions"><button className="btn primary" onClick={() => navigate('progress')}>View progress</button><button className="btn secondary" onClick={() => navigate('paths')}>Choose another pathway</button></div></section>}
        {view === 'quiz' && quiz && !quiz.finished && currentQuestion && <>
          <div className="quiz-topline"><button className="btn quiet" onClick={() => navigate('paths')}>← Exit assessment</button><span>{quiz.levelLabel}</span><span>Question {quiz.index + 1} of {quiz.questions.length}</span></div><div className="quiz-progress" role="progressbar" aria-label="Assessment progress" aria-valuemin={0} aria-valuemax={quiz.questions.length} aria-valuenow={quiz.index + (quiz.answered ? 1 : 0)}><span style={{width: `${((quiz.index + (quiz.answered ? 1 : 0)) / quiz.questions.length) * 100}%`}}/></div>
          <div className="question-layout"><section className="panel question-panel"><div className="eyebrow">{currentQuestion.level.toUpperCase()} · {currentQuestion.category.toUpperCase()}</div><h1>{currentQuestion.title}</h1><p className="objective">Learning objective: {currentQuestion.learningObjective}</p><div className="scenario"><strong>SCENARIO</strong><p>{currentQuestion.scenario}</p></div><h2>{currentQuestion.question}</h2><form onSubmit={answerSubmit}><fieldset disabled={quiz.answered}><legend className="sr-only">Select one answer</legend>{currentQuestion.options.map(option => <label className={`option-card ${quiz.selected === option.id ? 'selected' : ''} ${quiz.answered && option.id === currentQuestion.correctOptionId ? 'correct' : ''} ${quiz.answered && quiz.selected === option.id && option.id !== currentQuestion.correctOptionId ? 'incorrect' : ''}`} key={option.id}><input type="radio" name="answer" value={option.id} checked={quiz.selected === option.id} onChange={() => setQuiz({ ...quiz, selected: option.id })}/><span className="option-letter">{option.id}</span><span>{option.text}</span></label>)}</fieldset>{!quiz.answered ? <button className="btn primary" type="submit" disabled={!quiz.selected}>Submit answer</button> : <div className="answer-summary" role="status" aria-live="polite"><strong>{quiz.selected === currentQuestion.correctOptionId ? 'Correct answer' : 'Review the correct answer'}</strong><p>{currentQuestion.explanation}</p></div>}</form>
          {quiz.answered && <section className="explanations"><h2>Why each option is safe or unsafe</h2>{currentQuestion.options.map(option => { const note = currentQuestion.optionExplanations[option.id]; return <article className={`rationale ${note.isCorrect ? 'is-correct' : ''}`} key={option.id}><strong>Option {option.id} · {note.isCorrect ? 'Correct' : 'Not recommended'}</strong><p>{note.explanation}</p></article>; })}<div className="key-takeaway"><strong>Key takeaway</strong><p>{currentQuestion.keyTakeaway}</p><strong>Recommended defensive action</strong><p>{currentQuestion.recommendedDefensiveAction}</p></div><VideoPanel entry={currentVideo} questionId={currentQuestion.questionId}/><button className="btn primary" onClick={nextQuestion}>{quiz.index + 1 === quiz.questions.length ? 'Finish assessment' : 'Next question →'}</button></section>}
          </section><aside className="panel question-aside"><div className="eyebrow">RESEARCH SUPPORT</div><h3>Linked references</h3>{currentReferences.map(ref => <div className="reference-item" key={ref.id}><strong>[{ref.id}]</strong><p>{ref.text}</p>{ref.url && /^https:\/\//.test(ref.url) && <a href={ref.url} target="_blank" rel="noopener noreferrer">Open source ↗</a>}</div>)}<div className="callout">Estimated time: {Math.ceil(currentQuestion.estimatedCompletionSeconds / 60)} min</div></aside></div>
        </>}
        {view === 'quiz' && !quiz && <Empty title="No active assessment" detail="Choose a learning pathway or topic to begin." action="Browse pathways" onAction={() => navigate('paths')}/>}
        {view === 'simulations' && <><Eyebrow>INTERACTIVE LEARNING ENVIRONMENT</Eyebrow><h1>Simulation laboratory</h1><p className="subtitle">The existing WebGL simulation environment is retained as an isolated compatibility module while the main product moves to React.</p><section className="panel simulation-launch"><div className="hero-orb small" aria-hidden="true"><span/><i/><b/></div><div><h2>Open the interactive simulation environment</h2><p>The WebGL simulation lab is retained as a separate same-origin experience while its components are migrated into React. It contains phishing inspection, password-profile configuration, MFA fatigue and incident-response activities.</p><a className="btn primary link-button" href="/legacy.html?view=simulations" target="_blank" rel="noopener noreferrer">Open simulation laboratory ↗</a></div></section><p className="footnote">Exercises use fictional data. No real passwords, OTPs or operational systems are accessed. The separate page is opened in a new tab to preserve the legacy server's frame-deny security policy.</p></>}
        {view === 'progress' && <><Eyebrow>LEARNING ANALYTICS</Eyebrow><h1>My progress</h1><p className="subtitle">First-attempt performance and learning activity stored on this device.</p><div className="metric-grid"><Metric label="UNIQUE QUESTIONS" value={stats.answered} note="First attempts"/><Metric label="ACCURACY" value={percentage(stats.accuracy)} note="Correct first attempts"/><Metric label="TOTAL ATTEMPTS" value={stats.totalAttempts} note="Including practice retries"/><Metric label="TOPICS TO REVIEW" value={stats.byTopic.filter(topic => topic.answered >= 2 && topic.accuracy < .7).length} note="At least two attempts below 70%"/></div><section className="panel"><h2>Pathway breakdown</h2>{([...CORE_LEVELS, EXPERT_LEVEL] as Level[]).map(level => <div className="progress-row" key={level}><div><strong>{level}</strong><span>{stats.byLevel[level].answered} answered · {percentage(stats.byLevel[level].accuracy)} accuracy</span></div><progress aria-label={`${level} questions completed`} max={data.questions.filter(question => question.level === level).length} value={stats.byLevel[level].answered}/></div>)}</section><section className="panel"><h2>Topics needing review</h2>{stats.byTopic.length ? stats.byTopic.map(topic => <div className="progress-row" key={topic.category}><div><strong>{topic.category}</strong><span>{topic.answered} attempts · {percentage(topic.accuracy)}</span></div><button className="btn small secondary" onClick={() => beginQuiz('Topic practice', topic.category)}>Practice</button></div>) : <p className="muted">Topic analytics will appear after your first assessment.</p>}</section></>}
        {view === 'research' && <><Eyebrow>EVIDENCE LIBRARY</Eyebrow><h1>Research sources</h1><p className="subtitle">Numbered sources supporting the content traceability map. Verify caveats in the research verification register before using a source to support a broader claim.</p><section className="panel research-background"><div className="eyebrow">PROJECT BACKGROUND · ATTACHED PAPER</div><h2>CyberAware 3D: A Research-Driven AI-Enhanced Framework</h2><p>The supplied draft identifies a practical gap in cybersecurity awareness: common phishing-training approaches show limited or mixed field effects, while learners may skip post-failure feedback. The proposed design therefore puts scenario-based retrieval practice, per-option explanations and evidence traceability at the centre. AI explainer videos and concept-bearing 3D scenes are optional supporting layers, with a 2D alternative to manage cognitive load.</p><p>Page 5 presents the conceptual framework linking evidence, learning objectives, questions, feedback, media and adaptive recommendations. Page 6 presents the static-first web architecture, offline content pipeline and four progressive learning levels.</p><p className="footnote">Document status: the supplied PDF labels itself Draft v0.1, preview layout (not the official IEEEtran class), not submitted, and with no empirical results. The affiliation placeholder remains to be completed. This is a project background manuscript, not a publication or peer-reviewed result.</p><div className="button-row"><a className="btn secondary link-button" href="/data/research-paper-preview.pdf" target="_blank" rel="noopener noreferrer">Open attached research paper (PDF) ↗</a><a href="/data/research-paper-preview.pdf" download>Download PDF</a></div></section><div className="reference-list">{data.references.map(reference => <article className="panel" key={reference.id}><div className="eyebrow">REFERENCE [{reference.id}]</div><p>{reference.text}</p>{reference.url && /^https:\/\//.test(reference.url) && <a href={reference.url} target="_blank" rel="noopener noreferrer">Open reference ↗</a>}</article>)}</div></>}
        {view === 'achievements' && <><Eyebrow>MILESTONES</Eyebrow><h1>Achievements</h1><p className="subtitle">Motivational milestones for learning activity, not security qualifications.</p><div className="topic-grid">{earned.map(item => <article className="topic-card" key={item.title}><div className={`achievement-icon ${item.done ? 'earned' : ''}`}>{item.done ? '✓' : '✧'}</div><h2>{item.title}</h2><p>{item.detail}</p><span className={`pill ${item.done ? 'green' : ''}`}>{item.done ? 'EARNED' : 'IN PROGRESS'}</span></article>)}</div></>}
        {view === 'settings' && <><Eyebrow>PREFERENCES & PRIVACY</Eyebrow><h1>Settings</h1><p className="subtitle">Manage this device's learning preferences and stored progress.</p><section className="panel settings-panel"><div className="setting-row"><div><strong id="reduced-motion-label">Reduced motion</strong><small id="reduced-motion-description">Reduce non-essential transitions and movement.</small></div><button className={`switch ${reducedMotion ? 'on' : ''}`} type="button" role="switch" aria-labelledby="reduced-motion-label" aria-describedby="reduced-motion-description" aria-checked={reducedMotion} onClick={() => setReducedMotion(value => !value)}><span aria-hidden="true"/></button></div><div className="setting-row"><div><strong>Local progress</strong><small>Quiz outcomes remain in this browser. No account or credential data is collected.</small></div><span className="pill green">ON DEVICE</span></div><div className="setting-row"><div><strong>Export quiz progress</strong><small>Download a JSON backup of quiz answers and timestamps. Keep this file private.</small></div><button className="btn secondary" onClick={exportQuizProgress}>Export JSON</button></div><div className="setting-row"><div><strong>Import quiz progress</strong><small>Choose a CYBERAWARE 3D JSON backup. Import replaces existing quiz attempts after confirmation.</small></div><label className="btn secondary import-file-label">Choose JSON<input className="sr-only" type="file" accept="application/json,.json" aria-label="Choose quiz progress JSON file" onChange={selectQuizProgressImport}/></label></div>{pendingImport && <section className="import-confirm" role="group" aria-label="Confirm progress import"><p><strong>{pendingImport.fileName}</strong> contains {pendingImport.progress.attempts.length} quiz {pendingImport.progress.attempts.length === 1 ? 'attempt' : 'attempts'}. Replace the current quiz progress on this device?</p><div className="button-row"><button className="btn primary" onClick={confirmQuizProgressImport}>Replace progress</button><button className="btn quiet" onClick={() => setPendingImport(null)}>Cancel</button></div></section>}<div className="setting-row"><div><strong>Reset learning data</strong><small>Delete quiz attempts and local pathway progress.</small></div>{!resetConfirmation ? <button className="btn secondary" onClick={() => setResetConfirmation(true)}>Reset data</button> : <div className="confirm-actions"><button className="btn danger" onClick={() => { setProgress({version: 2, attempts: []}); setPendingImport(null); try { localStorage.removeItem('cyberaware3d.simulations.v1'); } catch { /* local storage may be unavailable */ } setResetConfirmation(false); setToast('Local learning data reset.'); }}>Confirm reset</button><button className="btn quiet" onClick={() => setResetConfirmation(false)}>Cancel</button></div>}</div></section><div className="callout">Quiz progress backups do not include Simulation Lab activity. Resetting site storage does not delete a backup file you downloaded.</div></>}
      </section>
      <footer className="app-footer"><span>CYBERAWARE 3D · RESEARCH-DRIVEN SECURITY EDUCATION</span><span>REACT MIGRATION <b>0.10.0-rc.16</b></span></footer>
    </main>
    <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">{toast}</div>
  </div>;
}

function Metric({label, value, note}: {label:string; value:string|number; note:string}) { return <article className="metric-card"><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-note">{note}</div></article>; }
function Eyebrow({children}:{children:string}) { return <div className="eyebrow">{children}</div>; }
function LevelCard({level,count,stats,unlocked,reason,onStart}:{level:Level;count:number;stats:{answered:number;accuracy:number};unlocked:boolean;reason:string;onStart:()=>void}) { return <article className={`level-card ${level === EXPERT_LEVEL ? 'expert' : ''}`}><div className="eyebrow">{level === EXPERT_LEVEL ? '04 / GOVERNANCE' : `${CORE_LEVELS.indexOf(level as typeof CORE_LEVELS[number]) + 1} / LEARNING PATH`}</div><h2>{level}</h2><p>{level === 'Beginner' ? 'Build essential habits for recognizing common threats and protecting accounts.' : level === 'Intermediate' ? 'Practice multi-step decisions involving impersonation, QR scams and MFA fatigue.' : level === 'Advanced' ? 'Analyze complex organizational scenarios and prioritize security incidents.' : 'Make coordinated decisions across incident response, supplier risk and governance.'}</p><div className="card-meta">{stats.answered}/{count} answered · {percentage(stats.accuracy)} first-attempt accuracy</div><button className={`btn ${unlocked ? 'primary' : 'secondary'}`} disabled={!unlocked} onClick={onStart}>{unlocked ? 'Enter pathway →' : 'Locked · prerequisite needed'}</button><small>{reason}</small></article>; }
function Empty({title,detail,action,onAction}:{title:string;detail:string;action:string;onAction:()=>void}) { return <div className="panel empty-state"><h2>{title}</h2><p>{detail}</p><button className="btn primary" onClick={onAction}>{action}</button></div>; }
function VideoPanel({entry,questionId}:{entry:VideoEntry|undefined;questionId:string}) {
  const [fallback,setFallback] = useState(false);
  if (!entry) return <div className="video-pending"><strong>Video explanation unavailable</strong><p>The written explanation remains available for question {questionId}.</p></div>;
  const src = mediaRoute(entry);
  if (src && entry.captionsPath && !fallback) return <section className="video-panel"><h3>Question-level video explanation</h3><video controls preload="metadata" playsInline onError={() => setFallback(true)}><source src={src} type="video/mp4"/><track kind="captions" src={captionsRoute(entry.captionsPath)} srcLang="en" label="English" default/></video></section>;
  return <section className="video-pending"><strong>Video production status: {entry.status === 'deferred_by_owner_request' ? 'Deferred by owner request' : entry.status === 'ready' ? 'Playback issue — written fallback available' : 'Script ready · MP4 not generated or approved'}</strong><p>Video ID: {entry.videoId}. The complete written explanation and option rationales remain available above.</p>{entry.scriptPath ? <a href={scriptRoute(entry.scriptPath)} target="_blank" rel="noopener noreferrer">Read narration transcript ↗</a> : <span className="muted">No script or caption file is claimed for this deferred item.</span>}{fallback && <p className="muted">The video file could not be played in this browser.</p>}</section>; 
}
