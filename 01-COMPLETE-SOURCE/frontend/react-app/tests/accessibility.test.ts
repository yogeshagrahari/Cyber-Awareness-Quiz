import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const appSource = await readFile(resolve(process.cwd(), 'src/App.tsx'), 'utf8');
const styleSource = await readFile(resolve(process.cwd(), 'src/styles.css'), 'utf8');

test('React app exposes skip navigation, labeled controls and live answer feedback', () => {
  assert.match(appSource, /className="skip-link" href="#main-content"/);
  assert.match(appSource, /aria-label="Primary navigation"/);
  assert.match(appSource, /role="switch" aria-labelledby="reduced-motion-label" aria-describedby="reduced-motion-description" aria-checked=\{reducedMotion\}/);
  assert.match(appSource, /className="answer-summary" role="status" aria-live="polite"/);
  assert.match(appSource, /aria-label="Assessment progress" aria-valuemin=/);
});

test('keyboard focus returns to the active view or question heading after progression', () => {
  assert.match(appSource, /heading\.tabIndex = -1; heading\.focus\(\{ preventScroll: true \}\)/);
  assert.match(appSource, /\}, \[view, quiz\?\.index, quiz\?\.finished\]\)/);
  assert.match(styleSource, /:focus-visible\{outline:3px solid/);
});

test('all external-tab links explicitly prevent opener access', () => {
  const externalLinks = [...appSource.matchAll(/target="_blank"[^>]*>/g)].map(match => match[0]);
  assert.ok(externalLinks.length >= 3, 'Expected source, transcript and simulation links.');
  for (const link of externalLinks) assert.match(link, /rel="noopener noreferrer"/);
});


test('reduced-motion switch, progress indicators and file import control have accessible names', () => {
  assert.match(appSource, /aria-labelledby="reduced-motion-label" aria-describedby="reduced-motion-description" aria-checked=\{reducedMotion\}/);
  assert.match(appSource, /id="reduced-motion-label"/);
  assert.match(appSource, /id="reduced-motion-description"/);
  assert.match(appSource, /<progress aria-label=\{`\$\{level\} questions completed`\}/);
  assert.match(appSource, /aria-label="Choose quiz progress JSON file"/);
});

test('active pathway navigation remains programmatically current during an assessment', () => {
  assert.match(appSource, /aria-current=\{view === item\.id \|\| \(view === 'quiz' && item\.id === 'paths'\) \? 'page' : undefined\}/);
});

test('topic library exposes every mapped question even when its learning path is locked', () => {
  assert.match(appSource, /All topic quizzes are available immediately across the four learning levels/);
  assert.match(appSource, /const available = data\.questions\.filter\(question => question\.category === topic\)/);
  assert.match(appSource, /!quiz\.topicPractice \|\| isUnlocked\(progress, currentQuestion\.level\)/);
});

test('attached research paper is available in the Research background view with its draft status', () => {
  assert.match(appSource, /PROJECT BACKGROUND · ATTACHED PAPER/);
  assert.match(appSource, /research-paper-preview\.pdf/);
  assert.match(appSource, /not submitted/);
  assert.match(appSource, /no empirical results/);
});
