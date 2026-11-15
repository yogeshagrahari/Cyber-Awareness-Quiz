import test from 'node:test';
import assert from 'node:assert/strict';
import { addAttempt, calculateStats, canUnlockNextLevel, getRecommendations, levelStatus, safeReadProgress } from '../src/core.js';

const question = (id, level = 'Beginner', category = 'Phishing') => ({ questionId: id, level, category, learningObjective: 'Identify safe actions', correctOptionId: 'B' });

test('safeReadProgress rejects malformed or incompatible storage safely', () => {
  assert.deepEqual(safeReadProgress('{bad'), { version: 2, attempts: [] });
  assert.deepEqual(safeReadProgress('{"version":1,"attempts":[]}'), { version: 2, attempts: [] });
  assert.deepEqual(safeReadProgress('{"version":9,"attempts":[]}'), { version: 2, attempts: [] });
});

test('addAttempt scores an answer and only counts first attempt for mastery', () => {
  let progress = { version: 2, attempts: [] };
  progress = addAttempt(progress, question('Q1'), 'A', '2026-11-12T00:00:00Z');
  progress = addAttempt(progress, question('Q1'), 'B', '2026-11-12T00:01:00Z');
  const stats = calculateStats(progress);
  assert.equal(stats.answered, 1);
  assert.equal(stats.correct, 0);
  assert.equal(stats.totalAttempts, 2);
});

test('level unlock threshold requires ten first attempts and at least 75 percent', () => {
  let progress = { version: 2, attempts: [] };
  for (let i = 0; i < 10; i++) progress = addAttempt(progress, question(`Q${i}`), i < 7 ? 'B' : 'A');
  assert.equal(canUnlockNextLevel(progress, 'Beginner'), false);
  progress = addAttempt(progress, question('Q10'), 'B');
  progress = addAttempt(progress, question('Q11'), 'B');
  assert.equal(canUnlockNextLevel(progress, 'Beginner'), true);
});

test('recommendations prioritize a weak topic when evidence is sufficient', () => {
  let progress = { version: 2, attempts: [] };
  progress = addAttempt(progress, question('Q1', 'Beginner', 'Password hygiene'), 'A');
  progress = addAttempt(progress, question('Q2', 'Beginner', 'Password hygiene'), 'A');
  const recommendation = getRecommendations(progress);
  assert.equal(recommendation.type, 'review_topic');
  assert.equal(recommendation.category, 'Password hygiene');
});


test('Expert Challenge unlock requires the Advanced first-attempt threshold', () => {
  let progress = { version: 2, attempts: [] };
  assert.equal(levelStatus(progress, 'Expert Challenge').unlocked, false);
  for (let i = 0; i < 10; i++) progress = addAttempt(progress, question(`A${i}`, 'Advanced', 'Incident response'), i < 7 ? 'B' : 'A');
  assert.equal(levelStatus(progress, 'Expert Challenge').unlocked, false);
  progress = addAttempt(progress, question('A10', 'Advanced', 'Incident response'), 'B');
  progress = addAttempt(progress, question('A11', 'Advanced', 'Incident response'), 'B');
  assert.equal(levelStatus(progress, 'Expert Challenge').unlocked, true);
  assert.equal(calculateStats(progress).byLevel['Expert Challenge'].answered, 0);
});

test('Expert Challenge first attempts are tracked independently from core levels', () => {
  let progress = { version: 2, attempts: [] };
  progress = addAttempt(progress, question('IR-E01', 'Expert Challenge', 'Incident response governance'), 'B');
  const stats = calculateStats(progress);
  assert.equal(stats.answered, 1);
  assert.equal(stats.byLevel['Expert Challenge'].answered, 1);
  assert.equal(stats.byLevel.Beginner.answered, 0);
});


test('recommendations point to Expert Challenge after Advanced mastery and before expert attempts', () => {
  let progress = { version: 2, attempts: [] };
  for (let i = 0; i < 10; i++) progress = addAttempt(progress, question(`ADV${i}`, 'Advanced', 'Risk governance'), i < 8 ? 'B' : 'A');
  const rec = getRecommendations(progress);
  assert.equal(rec.level, 'Expert Challenge');
  assert.equal(rec.type, 'next_level');
});

test('safeReadProgress sanitizes user-controlled local storage fields and deduplicates mastery attempts', () => {
  const payload = {
    version: 2,
    attempts: [
      { questionId: 'Q1', level: 'Beginner', category: 'Phishing', learningObjective: 'Identify phishing', selectedOptionId: 'A', correct: false, answeredAt: '2026-11-12T00:00:00Z', countedForMastery: true },
      { questionId: 'Q1', level: 'Beginner', category: 'Phishing', learningObjective: 'Identify phishing', selectedOptionId: 'B', correct: true, answeredAt: '2026-11-12T00:01:00Z', countedForMastery: true },
      { questionId: 'BAD<script>', level: 'Beginner', category: '<img src=x>', learningObjective: 'x', selectedOptionId: 'A', correct: true, answeredAt: '2026-11-12T00:02:00Z' },
      { questionId: 'Q2', level: 'Root', category: 'Phishing', learningObjective: 'x', selectedOptionId: 'A', correct: true, answeredAt: '2026-11-12T00:02:00Z' },
      { questionId: 'Q3', level: 'Beginner', category: 'x'.repeat(81), learningObjective: 'x', selectedOptionId: 'A', correct: true, answeredAt: '2026-11-12T00:02:00Z' },
      { questionId: 'Q4', level: 'Beginner', category: 'Valid', learningObjective: 'x', selectedOptionId: 'A', correct: 'true', answeredAt: '2026-11-12T00:02:00Z' }
    ]
  };
  const clean = safeReadProgress(JSON.stringify(payload));
  assert.equal(clean.attempts.length, 2);
  assert.equal(clean.attempts[0].countedForMastery, true);
  assert.equal(clean.attempts[1].countedForMastery, false);
  assert.equal(safeReadProgress('x'.repeat(2_000_001)).attempts.length, 0);
});

test('topic practice on locked levels is retained without counting toward mastery', () => {
  const q = question('LOCKED-PRACTICE', 'Advanced');
  const practice = addAttempt({version:2, attempts:[]}, q, 'A', '2026-11-13T00:00:00.000Z', false);
  assert.equal(practice.attempts[0].countedForMastery, false);
  assert.equal(calculateStats(practice).answered, 0);
  const restored = safeReadProgress(JSON.stringify(practice));
  assert.equal(restored.attempts[0].countedForMastery, false);
  const pathway = addAttempt(restored, q, 'A', '2026-11-14T00:00:00.000Z', true);
  assert.equal(pathway.attempts[1].countedForMastery, true);
  assert.equal(calculateStats(pathway).answered, 1);
});
