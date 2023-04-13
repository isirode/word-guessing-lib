import { GuessResult } from "./models/GuessResult";

export interface IWordGame {
  getNewSequence(): string;
  verifyGuess(word: string): GuessResult;
  getExampleForSequence(): string;
  remainingAttempts(): number;
  reset(): void;
  currentSequence: string;
  isGuessing: boolean;
  attempts: number;
}
