import type { LearningData, Question, Explanation, ReferenceRecord, VideoEntry } from './types.ts';

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { headers: { Accept: 'application/json' }, cache: 'no-cache' });
  if (!response.ok) throw new Error(`Could not load ${path} (${response.status}).`);
  return response.json() as Promise<T>;
}

function assertArray<T>(value: unknown, label: string): T[] {
  if (!Array.isArray(value)) throw new Error(`${label} is missing or malformed.`);
  return value as T[];
}

export function validateLearningData(data: LearningData): LearningData {
  if (!data || typeof data !== 'object' || !Array.isArray(data.questions) || !Array.isArray(data.explanations) || !Array.isArray(data.references) || !Array.isArray(data.videos)) {
    throw new Error('Learning data is incomplete or malformed.');
  }
  const { questions, explanations, references, videos } = data;
  if (questions.length < 1 || explanations.length !== questions.length || videos.length !== questions.length) throw new Error('Question, explanation and video manifest counts do not match.');
  if (questions.some(item => !item || typeof item !== 'object') || explanations.some(item => !item || typeof item !== 'object') || videos.some(item => !item || typeof item !== 'object') || references.some(item => !item || typeof item !== 'object')) throw new Error('Learning data contains a malformed record.');
  const questionIds = new Set(questions.map(question => question.questionId));
  if (questionIds.size !== questions.length) throw new Error('Duplicate question identifiers were found.');
  const topicCounts = new Map<string, number>();
  for (const question of questions) topicCounts.set(question.category, (topicCounts.get(question.category) || 0) + 1);
  for (const [topic, count] of topicCounts) if (count < 3) throw new Error(`${topic} has fewer than three questions in the topic library.`);
  if (new Set(explanations.map(item => item.questionId)).size !== explanations.length) throw new Error('Duplicate explanation-to-question mappings were found.');
  if (new Set(videos.map(item => item.questionId)).size !== videos.length || new Set(videos.map(item => item.videoId)).size !== videos.length) throw new Error('Duplicate video manifest mappings were found.');
  if (new Set(references.map(reference => reference.id)).size !== references.length) throw new Error('Duplicate research reference identifiers were found.');
  for (const reference of references) {
    if (!reference || typeof reference !== 'object' || typeof reference.id !== 'string' || !/^[A-Za-z0-9_-]{1,16}$/.test(reference.id) || typeof reference.text !== 'string' || !reference.text.trim()) throw new Error('A research reference has an invalid identifier or empty citation.');
    if (reference.url !== null && typeof reference.url !== 'string') throw new Error(`Research reference ${reference.id} has an invalid URL.`);
    if (reference.url !== null) {
      try { if (new URL(reference.url).protocol !== 'https:') throw new Error('Only HTTPS research links are allowed.'); }
      catch { throw new Error(`Research reference ${reference.id} has an invalid URL.`); }
    }
  }
  const referenceIds = new Set(references.map(reference => `[${reference.id}]`));
  const explanationByQuestion = new Map(explanations.map(item => [item.questionId, item]));
  const videoByQuestion = new Map(videos.map(item => [item.questionId, item]));
  for (const question of questions) {
    if (!question || typeof question !== 'object') throw new Error('A learning question is malformed.');
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(question.questionId) || !['Beginner', 'Intermediate', 'Advanced', 'Expert Challenge'].includes(question.level)) throw new Error('A question has an invalid identifier or learning level.');
    for (const [field, value] of Object.entries({category: question.category, title: question.title, learningObjective: question.learningObjective, scenario: question.scenario, question: question.question, explanation: question.explanation, keyTakeaway: question.keyTakeaway, recommendedDefensiveAction: question.recommendedDefensiveAction})) {
      if (typeof value !== 'string' || !value.trim()) throw new Error(`${question.questionId} has an empty ${field} field.`);
    }
    if (!Array.isArray(question.options) || question.options.length !== 4 || new Set(question.options.map(option => option.id)).size !== 4) throw new Error(`${question.questionId} must have four unique options.`);
    if (question.options.some(option => !/^[A-D]$/.test(option.id) || !option.text?.trim())) throw new Error(`${question.questionId} has a malformed answer option.`);
    if (question.options.some(option => !question.optionExplanations?.[option.id])) throw new Error(`${question.questionId} has an option without a rationale.`);
    if (!question.options.some(option => option.id === question.correctOptionId)) throw new Error(`${question.questionId} has an invalid correct option.`);
    if (Object.keys(question.optionExplanations || {}).length !== 4) throw new Error(`${question.questionId} has incomplete option explanations.`);
    if (question.options.filter(option => question.optionExplanations[option.id].isCorrect).length !== 1 || !question.optionExplanations[question.correctOptionId].isCorrect) throw new Error(`${question.questionId} has inconsistent correct-answer rationales.`);
    if (question.correctAnswer !== question.options.find(option => option.id === question.correctOptionId)?.text) throw new Error(`${question.questionId} has inconsistent correct-answer text.`);
    if (!Array.isArray(question.referenceIds) || !question.referenceIds.length || question.referenceIds.some(id => !referenceIds.has(id))) throw new Error(`${question.questionId} has an unresolved reference.`);
    const explanation = explanationByQuestion.get(question.questionId);
    if (explanation?.explanationId !== question.explanationId || explanation.videoId !== question.videoId) throw new Error(`${question.questionId} has an inconsistent explanation mapping.`);
    const video = videoByQuestion.get(question.questionId);
    if (video?.videoId !== question.videoId) throw new Error(`${question.questionId} has an inconsistent video mapping.`);
    if (video.status === 'deferred_by_owner_request') {
      if (video.mediaFileExists !== false || video.scriptPath !== null || video.captionsPath !== null || video.reviewStatus !== 'deferred_by_owner_request') throw new Error(`${question.questionId} has an inconsistent owner-deferred video record.`);
    } else {
      if (!video.scriptPath || !video.captionsPath) throw new Error(`${question.questionId} is missing its written video fallback paths.`);
      scriptRoute(video.scriptPath);
      captionsRoute(video.captionsPath);
    }
    if (video.mediaFileExists === true && mediaRoute(video) === null) throw new Error(`${question.questionId} claims media exists without a validated and approved media record.`);
  }
  if (explanations.some(item => !questionIds.has(item.questionId)) || videos.some(item => !questionIds.has(item.questionId))) throw new Error('An explanation or video manifest entry references an unknown question.');
  return data;
}

export async function loadLearningData(): Promise<LearningData> {
  const [coreDoc, expertDoc, coreExplDoc, expertExplDoc, coreVideoDoc, expertVideoDoc, refs] = await Promise.all([
    getJson<{questions: Question[]}>('/data/question-bank.json'),
    getJson<{questions: Question[]}>('/data/expert-challenge.json'),
    getJson<{explanations: Explanation[]}>('/data/explanations.json'),
    getJson<{explanations: Explanation[]}>('/data/expert-explanations.json'),
    getJson<{entries: VideoEntry[]}>('/data/video-manifest.json'),
    getJson<{entries: VideoEntry[]}>('/data/expert-video-manifest.json'),
    getJson<ReferenceRecord[]>('/data/references.json')
  ]);
  return validateLearningData({
    questions: [...assertArray<Question>(coreDoc.questions, 'Core questions'), ...assertArray<Question>(expertDoc.questions, 'Expert questions')],
    explanations: [...assertArray<Explanation>(coreExplDoc.explanations, 'Core explanations'), ...assertArray<Explanation>(expertExplDoc.explanations, 'Expert explanations')],
    videos: [...assertArray<VideoEntry>(coreVideoDoc.entries, 'Core video manifest'), ...assertArray<VideoEntry>(expertVideoDoc.entries, 'Expert video manifest')],
    references: assertArray<ReferenceRecord>(refs, 'Research references')
  });
}

export function scriptRoute(scriptPath: string): string {
  const match = /^content\/videos\/scripts\/([A-Za-z0-9_-]+\.md)$/.exec(scriptPath);
  if (!match) throw new Error('Invalid video script path.');
  return `/data/videos/scripts/${match[1]}`;
}
export function captionsRoute(captionsPath: string): string {
  const match = /^content\/videos\/captions\/([A-Za-z0-9_-]+\.vtt)$/.exec(captionsPath);
  if (!match) throw new Error('Invalid caption path.');
  return `/data/videos/captions/${match[1]}`;
}
export function mediaRoute(entry: VideoEntry): string | null {
  if (entry.status !== 'ready' || entry.mediaFileExists !== true || entry.reviewStatus !== 'approved' || entry.mediaValidated !== true || !entry.plannedOutputPath.startsWith('public/videos/')) return null;
  const route = entry.plannedOutputPath.replace(/^public\//, '/');
  if (route.includes('..') || !/^\/videos\/[A-Za-z0-9_./-]+\.mp4$/.test(route)) return null;
  return route;
}
