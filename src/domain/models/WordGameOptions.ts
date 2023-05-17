export type SupportedLanguages = 'fra' | 'eng';

export interface WordGameOptions {
  minOccurences: number;
  maxOccurences: number;
  guessAsSession: boolean;
  maxAttempts: number;
  // TODO : mutualize the save system for the solo game
  // implement a system where we can move from code to user friendly language easily
  language: SupportedLanguages;
}
