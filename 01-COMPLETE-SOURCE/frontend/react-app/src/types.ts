export const CORE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;
export const EXPERT_LEVEL = 'Expert Challenge' as const;
export type CoreLevel = typeof CORE_LEVELS[number];
export type Level = CoreLevel | typeof EXPERT_LEVEL;

export interface AnswerOption { id: string; text: string }
export interface OptionRationale { isCorrect: boolean; explanation: string }
export interface Question {
  questionId: string;
  level: Level;
  category: string;
  title: string;
  learningObjective: string;
  scenario: string;
  question: string;
  options: AnswerOption[];
  correctOptionId: string;
  correctAnswer: string;
  optionExplanations: Record<string, OptionRationale>;
  explanation: string;
  explanationId: string;
  videoId: string;
  keyTakeaway: string;
  recommendedDefensiveAction: string;
  referenceIds: string[];
  estimatedCompletionSeconds: number;
}
export interface Explanation { questionId: string; explanationId: string; referenceIds: string[]; videoId: string; [key: string]: unknown }
export interface ReferenceRecord { id: string; text: string; url: string | null }
export interface VideoEntry {
  videoId: string;
  questionId: string;
  status: string;
  mediaFileExists: boolean;
  plannedOutputPath: string;
  scriptPath: string | null;
  captionsPath: string | null;
  storyboardPath?: string | null;
  transcriptPath?: string | null;
  promptPath?: string | null;
  reviewStatus: string;
  mediaValidated?: boolean;
  title: string;
}
export interface LearningData {
  questions: Question[];
  explanations: Explanation[];
  references: ReferenceRecord[];
  videos: VideoEntry[];
}
export interface Attempt {
  questionId: string;
  level: Level;
  category: string;
  learningObjective: string;
  selectedOptionId: string;
  correct: boolean;
  answeredAt: string;
  countedForMastery: boolean;
}
export interface Progress { version: 2; attempts: Attempt[] }
export type View = 'dashboard' | 'paths' | 'topics' | 'quiz' | 'simulations' | 'progress' | 'research' | 'achievements' | 'settings';
