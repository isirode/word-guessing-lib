import { GuessResult } from "./models/GuessResult";
import { SupportedLanguages } from "./models/WordGameOptions";

export interface Sequence {
  language: SupportedLanguages;
  stringSequence: string;
}

export interface IWordGame {
  getNewSequence(): string;
  verifyGuess(word: string): GuessResult;
  getExampleForSequence(): string;
  remainingAttempts(): number;
  reset(): void;
  overrideLanguage: SupportedLanguages | undefined;
  currentSequence: Sequence;
  isGuessing: boolean;
  attempts: number;
}
