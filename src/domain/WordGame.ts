import { IWordGame } from "./IWordGame";
import { GuessResult } from "./models/GuessResult";
import { WordGameOptions } from "./models/WordGameOptions";
import { IWordDatabase } from "./ports/secondary/IWordDatabase";

export class WordGame implements IWordGame {

  currentSequence: string = '';
  wordDatabase: IWordDatabase;
  wordGameOptions: WordGameOptions;
  isGuessing: boolean = false;
  attempts: number = 0;

  constructor(wordDatabase: IWordDatabase, wordGameOptions: WordGameOptions) {
    this.wordDatabase = wordDatabase;
    this.wordGameOptions = wordGameOptions;
  }

  getNewSequence(): string {
    this.currentSequence = this.wordDatabase.getSequence(this.wordGameOptions.minOccurences, this.wordGameOptions.maxOccurences);
    if (this.wordGameOptions.guessAsSession) {
      this.isGuessing = true;
    }
    this.attempts = 0;
    return this.currentSequence;
  }
  
  verifyGuess(word: string): GuessResult {
    this.attempts += 1;

    // FIXME
    // Property 'normalize' does not exist on type 'string'. Do you need to change your target library? Try changing the `lib` compiler option to 'es2015' or later.
    // When building with npm
    const normalizedWord = word.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()// TODO : locale lower case ?
    if (normalizedWord.search(new RegExp(this.currentSequence, 'i')) === -1) {
      return GuessResult.WORD_DO_NOT_MATCH_SEQUENCE;
    }

    // FIXME : should I use normalizedWord here ? 
    const wordExists = this.wordDatabase.wordExists(word);
    if (wordExists) {
      if (this.wordGameOptions.guessAsSession) {
        this.isGuessing = false;
        this.currentSequence = '';
      }
      this.attempts = 0;
      return GuessResult.SUCCESSFUL_GUESS;
    }
    return GuessResult.WORD_DO_NOT_EXIST;
  }

  getExampleForSequence(): string {
    if (this.currentSequence === '') {
      throw new Error('You need to generate a sequence before calling this method.');
    }
    return this.wordDatabase.getWord(this.currentSequence);
  }

  maxAttemptReached(): boolean {
    if (this.wordGameOptions.maxAttempts <= 0) {
      return false;
    }
    return this.attempts >= this.wordGameOptions.maxAttempts;
  }

  remainingAttempts(): number {
    if (this.wordGameOptions.maxAttempts <= 0) {
      return -1;
    }
    return this.wordGameOptions.maxAttempts - this.attempts;
  }

  reset(): void {
    this.isGuessing = false;
    this.currentSequence = '';
    this.attempts = 0;
  }

}
