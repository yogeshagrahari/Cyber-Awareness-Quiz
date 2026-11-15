import test from 'node:test';
import assert from 'node:assert/strict';
import { addAttempt, calculateStats, canUnlock, isUnlocked, safeReadProgress, parseProgressExport, stringifyProgressExport, validateProgressForQuestions } from '../src/progress.ts';
import type { Question } from '../src/types.ts';

const question = (id: string, level: Question['level'], correct = true): Question => ({
  questionId: id, level, category: 'Phishing indicators', title: id, learningObjective: 'Recognize suspicious communication.',
  scenario: 'A fictional message requests urgent action.', question: 'What should you do?',
  options: [{id:'A',text:'A'},{id:'B',text:'B'},{id:'C',text:'C'},{id:'D',text:'D'}],
  correctOptionId: correct ? 'A' : 'B', correctAnswer: 'A',
  optionExplanations: {A:{isCorrect:true,explanation:'Correct.'},B:{isCorrect:false,explanation:'Unsafe.'},C:{isCorrect:false,explanation:'Unsafe.'},D:{isCorrect:false,explanation:'Unsafe.'}},
  explanation: 'Verify independently.', explanationId: `EXPL-${id}`, videoId: `VIDEO-${id}`,
  keyTakeaway: 'Pause and verify.', recommendedDefensiveAction: 'Use a known-good channel.', referenceIds: ['[1]'], estimatedCompletionSeconds: 60
});

test('malformed and oversized local progress fails closed', () => {
  assert.deepEqual(safeReadProgress('{not-json'), {version:2,attempts:[]});
  assert.deepEqual(safeReadProgress('x'.repeat(2_000_001)), {version:2,attempts:[]});
  assert.deepEqual(safeReadProgress(JSON.stringify({version:1,attempts:[]})), {version:2,attempts:[]});
});

test('progress parser normalizes first-attempt mastery and rejects poisoned records', () => {
  const raw = JSON.stringify({version:2,attempts:[
    {questionId:'Q1',level:'Beginner',category:'Topic',learningObjective:'Objective',selectedOptionId:'A',correct:true,answeredAt:'2026-01-01T00:00:00.000Z'},
    {questionId:'Q1',level:'Beginner',category:'Topic',learningObjective:'Objective',selectedOptionId:'B',correct:false,answeredAt:'2026-01-02T00:00:00.000Z'},
    {questionId:'<script>',level:'Beginner',category:'Topic',learningObjective:'Objective',selectedOptionId:'A',correct:true,answeredAt:'2026-01-03T00:00:00.000Z'}
  ]});
  const parsed = safeReadProgress(raw);
  assert.equal(parsed.attempts.length,2);
  assert.equal(parsed.attempts[0].countedForMastery,true);
  assert.equal(parsed.attempts[1].countedForMastery,false);
});

test('repeat attempts do not inflate first-attempt accuracy', () => {
  const first = addAttempt({version:2,attempts:[]}, question('Q1','Beginner',false), 'A');
  const second = addAttempt(first, question('Q1','Beginner',true), 'A');
  const stats = calculateStats(second);
  assert.equal(stats.answered,1);
  assert.equal(stats.totalAttempts,2);
  assert.equal(stats.accuracy,0);
});

test('unlock threshold is 10 first attempts with at least 75% accuracy', () => {
  let progress = {version:2 as const, attempts:[] as ReturnType<typeof addAttempt>['attempts']};
  for (let i=0;i<10;i++) progress = addAttempt(progress, question(`B${i}`,'Beginner',i<8), i<8?'A':'B');
  assert.equal(canUnlock(progress,'Beginner'),true);
  assert.equal(isUnlocked(progress,'Intermediate'),true);
  assert.equal(isUnlocked(progress,'Advanced'),false);
});

test('invalid option cannot be committed', () => {
  assert.throws(() => addAttempt({version:2,attempts:[]}, question('Q1','Beginner'), '<img>'), /not part/);
});


test('quiz progress export round-trips validated records and recomputes mastery flags', () => {
  let progress = { version: 2 as const, attempts: [] as ReturnType<typeof addAttempt>['attempts'] };
  progress = addAttempt(progress, question('EXPORT-Q1', 'Beginner', false), 'A', '2026-11-12T12:00:00.000Z');
  progress = addAttempt(progress, question('EXPORT-Q1', 'Beginner', true), 'A', '2026-11-12T12:01:00.000Z');
  const backup = stringifyProgressExport(progress, '2026-11-12T12:02:00.000Z');
  const restored = parseProgressExport(backup);
  assert.equal(restored.attempts.length, 2);
  assert.equal(restored.attempts[0].countedForMastery, true);
  assert.equal(restored.attempts[1].countedForMastery, false);
  assert.equal(restored.attempts[0].correct, false);
});

test('quiz progress import rejects wrong formats, poisoned records and oversized files', () => {
  assert.throws(() => parseProgressExport('not-json'), /not valid JSON/);
  assert.throws(() => parseProgressExport('x'.repeat(2_000_001)), /2 MB import limit/);
  assert.throws(() => parseProgressExport(JSON.stringify({ format: 'other', formatVersion: 1 })), /not a supported/);
  const poisoned = {
    format: 'cyberaware3d-quiz-progress',
    formatVersion: 1,
    exportedAt: '2026-11-12T12:00:00.000Z',
    progress: { version: 2, attempts: [{ questionId: '<script>', level: 'Beginner' }] }
  };
  assert.throws(() => parseProgressExport(JSON.stringify(poisoned)), /invalid or unsupported attempt records/);
});


test('imported progress must map to canonical questions, options and scoring', () => {
  const canonical = question('CANONICAL-Q1', 'Beginner', false);
  const progress = addAttempt({version:2, attempts:[]}, canonical, 'A');
  assert.doesNotThrow(() => validateProgressForQuestions(progress, [canonical]));
  assert.throws(() => validateProgressForQuestions(progress, []), /unknown question/);
  assert.throws(() => validateProgressForQuestions({
    ...progress,
    attempts: [{...progress.attempts[0], category:'Other topic'}]
  }, [canonical]), /metadata does not match/);
  assert.throws(() => validateProgressForQuestions({
    ...progress,
    attempts: [{...progress.attempts[0], correct:true}]
  }, [canonical]), /inconsistent result/);
});

test('topic-library practice does not count toward locked pathway mastery, but later eligible practice can', () => {
  const q = question('LOCKED-PRACTICE', 'Advanced', true);
  const optional = addAttempt({version:2, attempts:[]}, q, 'A', '2026-11-13T00:00:00.000Z', false);
  assert.equal(optional.attempts[0].countedForMastery, false);
  assert.equal(calculateStats(optional).answered, 0);
  const restored = safeReadProgress(JSON.stringify(optional));
  assert.equal(restored.attempts[0].countedForMastery, false);
  const eligible = addAttempt(restored, q, 'A', '2026-11-14T00:00:00.000Z', true);
  assert.equal(eligible.attempts[1].countedForMastery, true);
  assert.equal(calculateStats(eligible).answered, 1);
});
