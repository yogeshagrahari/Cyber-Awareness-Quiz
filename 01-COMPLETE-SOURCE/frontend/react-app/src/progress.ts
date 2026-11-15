import { CORE_LEVELS, EXPERT_LEVEL, type Attempt, type Level, type Progress, type Question } from './types.ts';

export const PROGRESS_KEY = 'cyberaware3d.progress.v2';
export const SETTINGS_KEY = 'cyberaware3d.settings.v1';
const ALL_LEVELS: readonly Level[] = [...CORE_LEVELS, EXPERT_LEVEL];
const EMPTY: Progress = { version: 2, attempts: [] };

export function safeReadProgress(raw: string | null): Progress {
  if (!raw || raw.length > 2_000_000) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return EMPTY;
    const value = parsed as { version?: unknown; attempts?: unknown };
    if (value.version !== 2 || !Array.isArray(value.attempts)) return EMPTY;
    const seen = new Set<string>();
    const attempts: Attempt[] = [];
    for (const item of value.attempts.slice(-2000)) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
      const row = item as Record<string, unknown>;
      if (typeof row.questionId !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(row.questionId)) continue;
      if (typeof row.level !== 'string' || !ALL_LEVELS.includes(row.level as Level)) continue;
      if (typeof row.category !== 'string' || !row.category.trim() || row.category.length > 80) continue;
      if (typeof row.learningObjective !== 'string' || row.learningObjective.length > 300) continue;
      if (typeof row.selectedOptionId !== 'string' || !/^[A-Za-z0-9_-]{1,24}$/.test(row.selectedOptionId)) continue;
      if (typeof row.correct !== 'boolean' || typeof row.answeredAt !== 'string' || row.answeredAt.length > 40 || Number.isNaN(Date.parse(row.answeredAt))) continue;
      const first = !seen.has(row.questionId);
      const countedForMastery = row.countedForMastery === false ? false : first;
      if (countedForMastery) seen.add(row.questionId);
      attempts.push({
        questionId: row.questionId, level: row.level as Level, category: row.category.trim(),
        learningObjective: row.learningObjective, selectedOptionId: row.selectedOptionId,
        correct: row.correct, answeredAt: row.answeredAt, countedForMastery
      });
    }
    return { version: 2, attempts };
  } catch { return EMPTY; }
}


export const PROGRESS_EXPORT_FORMAT = 'cyberaware3d-quiz-progress';
export function stringifyProgressExport(progress: Progress, exportedAt = new Date().toISOString()): string {
  return JSON.stringify({
    format: PROGRESS_EXPORT_FORMAT,
    formatVersion: 1,
    exportedAt,
    progress: safeReadProgress(JSON.stringify(progress))
  }, null, 2);
}

export function parseProgressExport(raw: string): Progress {
  if (typeof raw !== 'string' || raw.length > 2_000_000) throw new Error('Progress backup is empty or exceeds the 2 MB import limit.');
  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { throw new Error('Progress backup is not valid JSON.'); }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Progress backup has an invalid format.');
  const record = payload as Record<string, unknown>;
  if (record.format !== PROGRESS_EXPORT_FORMAT || record.formatVersion !== 1) throw new Error('This file is not a supported CYBERAWARE 3D quiz-progress backup.');
  if (typeof record.exportedAt !== 'string' || Number.isNaN(Date.parse(record.exportedAt))) throw new Error('Progress backup has an invalid export timestamp.');
  if (!record.progress || typeof record.progress !== 'object' || Array.isArray(record.progress)) throw new Error('Progress backup is missing its progress data.');
  const rawProgress = record.progress as Record<string, unknown>;
  if (rawProgress.version !== 2 || !Array.isArray(rawProgress.attempts)) throw new Error('Progress backup uses an unsupported progress schema.');
  const parsed = safeReadProgress(JSON.stringify(record.progress));
  if (parsed.attempts.length !== rawProgress.attempts.length) throw new Error('Progress backup contains invalid or unsupported attempt records.');
  return parsed;
}


export function validateProgressForQuestions(progress: Progress, questions: Question[]): Progress {
  const byId = new Map(questions.map(question => [question.questionId, question]));
  for (const attempt of progress.attempts) {
    const question = byId.get(attempt.questionId);
    if (!question) throw new Error(`Progress backup references unknown question ${attempt.questionId}.`);
    if (attempt.level !== question.level || attempt.category !== question.category) throw new Error(`Progress backup metadata does not match question ${attempt.questionId}.`);
    if (!question.options.some(option => option.id === attempt.selectedOptionId)) throw new Error(`Progress backup has an invalid selected option for ${attempt.questionId}.`);
    if (attempt.correct !== (attempt.selectedOptionId === question.correctOptionId)) throw new Error(`Progress backup contains an inconsistent result for ${attempt.questionId}.`);
  }
  return progress;
}

export function addAttempt(progress: Progress, question: Question, selectedOptionId: string, answeredAt = new Date().toISOString(), masteryEligible = true): Progress {
  const alreadyCounted = progress.attempts.some(attempt => attempt.questionId === question.questionId && attempt.countedForMastery);
  const optionExists = question.options.some(option => option.id === selectedOptionId);
  if (!optionExists) throw new Error('Selected answer is not part of this question.');
  const attempt: Attempt = {
    questionId: question.questionId, level: question.level, category: question.category,
    learningObjective: question.learningObjective, selectedOptionId,
    correct: selectedOptionId === question.correctOptionId, answeredAt,
    countedForMastery: masteryEligible && !alreadyCounted
  };
  return { version: 2, attempts: [...progress.attempts, attempt].slice(-2000) };
}

export function firstAttempts(progress: Progress): Attempt[] {
  const seen = new Set<string>();
  return progress.attempts.filter(row => {
    if (!row.countedForMastery || seen.has(row.questionId)) return false;
    seen.add(row.questionId);
    return true;
  });
}

export interface LevelStats { answered: number; correct: number; accuracy: number }
export interface Stats { answered: number; correct: number; accuracy: number; totalAttempts: number; byLevel: Record<Level, LevelStats>; byTopic: Array<{category: string; answered: number; correct: number; accuracy: number}> }
export function calculateStats(progress: Progress): Stats {
  const attempts = firstAttempts(progress);
  const byLevel = Object.fromEntries(ALL_LEVELS.map(level => {
    const rows = attempts.filter(row => row.level === level);
    const correct = rows.filter(row => row.correct).length;
    return [level, { answered: rows.length, correct, accuracy: rows.length ? correct / rows.length : 0 }];
  })) as Record<Level, LevelStats>;
  const categories = [...new Set(attempts.map(row => row.category))];
  const byTopic = categories.map(category => {
    const rows = attempts.filter(row => row.category === category);
    const correct = rows.filter(row => row.correct).length;
    return { category, answered: rows.length, correct, accuracy: rows.length ? correct / rows.length : 0 };
  }).sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered);
  const correct = attempts.filter(row => row.correct).length;
  return { answered: attempts.length, correct, accuracy: attempts.length ? correct / attempts.length : 0, totalAttempts: progress.attempts.length, byLevel, byTopic };
}

export function canUnlock(progress: Progress, level: Level, minAnswered = 10, threshold = 0.75): boolean {
  const stat = calculateStats(progress).byLevel[level];
  return stat.answered >= minAnswered && stat.accuracy >= threshold;
}
export function isUnlocked(progress: Progress, level: Level): boolean {
  if (level === 'Beginner') return true;
  const previous: Level = level === 'Intermediate' ? 'Beginner' : level === 'Advanced' ? 'Intermediate' : 'Advanced';
  return canUnlock(progress, previous);
}
export function percentage(value: number): string { return `${Math.round(value * 100)}%`; }
export function recommendations(progress: Progress): {title: string; detail: string; level?: Level; category?: string} {
  const stats = calculateStats(progress);
  const weak = stats.byTopic.find(topic => topic.answered >= 2 && topic.accuracy < 0.7);
  if (weak) return { title: `Revisit ${weak.category}`, detail: `First-attempt accuracy is ${percentage(weak.accuracy)} across ${weak.answered} questions. Review the explanations and practice again.`, category: weak.category };
  if (!stats.answered) return { title: 'Start with the fundamentals', detail: 'Begin with a short Beginner pathway and review every answer explanation.', level: 'Beginner' };
  if (canUnlock(progress, 'Beginner') && stats.byLevel.Intermediate.answered === 0) return { title: 'Move into Intermediate', detail: 'The Beginner practice threshold is met.', level: 'Intermediate' };
  if (canUnlock(progress, 'Intermediate') && stats.byLevel.Advanced.answered === 0) return { title: 'Explore Advanced scenarios', detail: 'The Intermediate practice threshold is met.', level: 'Advanced' };
  if (canUnlock(progress, 'Advanced') && stats.byLevel['Expert Challenge'].answered === 0) return { title: 'Take the Expert Challenge', detail: 'The Advanced practice threshold is met.', level: EXPERT_LEVEL };
  return { title: 'Keep building retrieval strength', detail: 'Continue practicing different topics. Quiz performance does not certify real-world security competency.', level: 'Beginner' };
}
