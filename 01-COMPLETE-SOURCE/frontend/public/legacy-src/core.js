export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
export const EXPERT_LEVEL = 'Expert Challenge';
export const ALL_LEVELS = [...LEVELS, EXPERT_LEVEL];
export const STORAGE_KEY = 'cyberaware3d.progress.v2';
export const SETTINGS_KEY = 'cyberaware3d.settings.v1';

export function safeReadProgress(raw) {
  const empty = { version: 2, attempts: [] };
  // Browser storage is user-controlled. Bound parsing work and accept only the
  // primitive fields the dashboard needs; never trust stored objects as UI data.
  if (!raw || typeof raw !== 'string' || raw.length > 2_000_000) return empty;
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 2 || !Array.isArray(parsed.attempts)) return empty;
    const seen = new Set();
    const clean = [];
    for (const row of parsed.attempts) {
      if (!row || typeof row !== 'object' || Array.isArray(row)) continue;
      if (typeof row.questionId !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(row.questionId)) continue;
      if (!ALL_LEVELS.includes(row.level)) continue;
      if (typeof row.category !== 'string' || !row.category.trim() || row.category.length > 80) continue;
      if (typeof row.learningObjective !== 'string' || row.learningObjective.length > 300) continue;
      if (typeof row.selectedOptionId !== 'string' || !/^[A-Za-z0-9_-]{1,24}$/.test(row.selectedOptionId)) continue;
      if (typeof row.correct !== 'boolean') continue;
      if (typeof row.answeredAt !== 'string' || row.answeredAt.length > 40 || Number.isNaN(Date.parse(row.answeredAt))) continue;
      const firstForQuestion = !seen.has(row.questionId);
      // Preserve explicit non-mastery library practice while allowing a later
      // unlocked-path attempt to become the first attempt counted for mastery.
      const countedForMastery = row.countedForMastery === false ? false : firstForQuestion;
      if (countedForMastery) seen.add(row.questionId);
      clean.push({
        questionId: row.questionId,
        level: row.level,
        category: row.category.trim(),
        learningObjective: row.learningObjective,
        selectedOptionId: row.selectedOptionId,
        correct: row.correct,
        answeredAt: row.answeredAt,
        countedForMastery
      });
    }
    return { version: 2, attempts: clean };
  } catch {
    return empty;
  }
}

export function addAttempt(progress, question, selectedOptionId, answeredAt = new Date().toISOString(), masteryEligible = true) {
  const alreadyCounted = progress.attempts.some(a => a.questionId === question.questionId && a.countedForMastery !== false);
  const correct = selectedOptionId === question.correctOptionId;
  return {
    version: 2,
    attempts: [...progress.attempts, {
      questionId: question.questionId,
      level: question.level,
      category: question.category,
      learningObjective: question.learningObjective,
      selectedOptionId,
      correct,
      answeredAt,
      countedForMastery: masteryEligible && !alreadyCounted
    }]
  };
}

export function firstAttempts(progress) {
  const seen = new Set();
  return progress.attempts.filter(a => {
    if (a.countedForMastery === false || seen.has(a.questionId)) return false;
    seen.add(a.questionId);
    return true;
  });
}

export function calculateStats(progress) {
  const attempts = firstAttempts(progress);
  const correct = attempts.filter(a => a.correct).length;
  const byLevel = Object.fromEntries(ALL_LEVELS.map(level => {
    const rows = attempts.filter(a => a.level === level);
    const hits = rows.filter(a => a.correct).length;
    return [level, { answered: rows.length, correct: hits, accuracy: rows.length ? hits / rows.length : 0 }];
  }));
  const categories = [...new Set(attempts.map(a => a.category))];
  const byTopic = categories.map(category => {
    const rows = attempts.filter(a => a.category === category);
    const hits = rows.filter(a => a.correct).length;
    return { category, answered: rows.length, correct: hits, accuracy: rows.length ? hits / rows.length : 0 };
  }).sort((a, b) => a.accuracy - b.accuracy || b.answered - a.answered);
  return {
    answered: attempts.length,
    correct,
    accuracy: attempts.length ? correct / attempts.length : 0,
    byLevel,
    byTopic,
    totalAttempts: progress.attempts.length
  };
}

export function canUnlockNextLevel(progress, level, minAnswered = 10, threshold = 0.75) {
  const stats = calculateStats(progress).byLevel[level];
  return Boolean(stats && stats.answered >= minAnswered && stats.accuracy >= threshold);
}

export function levelStatus(progress, level) {
  if (level === 'Beginner') return { unlocked: true, reason: 'Available from the start.' };
  if (level === EXPERT_LEVEL) {
    const ready = canUnlockNextLevel(progress, 'Advanced');
    return { unlocked: ready, reason: ready ? 'Unlocked: Advanced practice threshold met.' : 'Complete at least 10 Advanced questions with 75% first-attempt accuracy to unlock this optional challenge.' };
  }
  const previous = level === 'Intermediate' ? 'Beginner' : 'Intermediate';
  const ready = canUnlockNextLevel(progress, previous);
  return {
    unlocked: ready,
    reason: ready ? `Unlocked: ${previous} mastery threshold met.` : `Complete at least 10 ${previous} questions with 75% first-attempt accuracy.`
  };
}

export function getRecommendations(progress) {
  const stats = calculateStats(progress);
  const weak = stats.byTopic.find(topic => topic.answered >= 2 && topic.accuracy < 0.7);
  if (weak) return {
    type: 'review_topic',
    title: `Revisit ${weak.category}`,
    detail: `Your first-attempt accuracy is ${Math.round(weak.accuracy * 100)}% across ${weak.answered} item(s). Review the explanations, then retry with new scenarios.`,
    category: weak.category
  };
  if (canUnlockNextLevel(progress, 'Intermediate') && stats.byLevel.Intermediate.answered === 0) return {
    type: 'next_level', title: 'Move into Intermediate', detail: 'You met the Beginner progression rule. Try multi-step scenarios involving impersonation, QR-code fraud and account protection.', level: 'Intermediate'
  };
  if (canUnlockNextLevel(progress, 'Advanced') && stats.byLevel.Advanced.answered === 0) return {
    type: 'next_level', title: 'Explore Advanced scenarios', detail: 'You met the Intermediate progression rule. Practice complex organizational decisions and incident response.', level: 'Advanced'
  };
  if (canUnlockNextLevel(progress, 'Advanced') && stats.byLevel[EXPERT_LEVEL].answered === 0) return {
    type: 'next_level', title: 'Take the Expert Challenge', detail: 'You met the Advanced practice threshold. Test organizational decision-making across incident response, supplier risk and governance.', level: EXPERT_LEVEL
  };
  if (stats.answered === 0) return {
    type: 'start', title: 'Start with the fundamentals', detail: 'Begin with a short Beginner pathway. The first attempt on each item is used for your progress summary.', level: 'Beginner'
  };
  return {
    type: 'practice', title: 'Keep building retrieval strength', detail: 'Continue with new scenarios across different topics. This dashboard measures learning activity, not real-world security competency.', level: 'Beginner'
  };
}

export function formatPercent(value) { return `${Math.round(value * 100)}%`; }
export function getUniqueQuestionCount(progress) { return firstAttempts(progress).length; }
