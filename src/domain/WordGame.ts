import { notNull } from "ts-mockito";
import { IWordGame, Sequence } from "./IWordGame";
import { GuessResult } from "./models/GuessResult";
import { SupportedLanguages, WordGameOptions } from "./models/WordGameOptions";
import { IWordDatabase } from "./ports/secondary/IWordDatabase";

// FIXME : added support for multi language quite rapidly
// Not sure I should've putted that functionality here
export class WordGame implements IWordGame {

  // FIXME : respect the string API formelly put ?
  currentSequence: Sequence;
  frenchWordDatabase: IWordDatabase;
  englishWordDatabase: IWordDatabase;

  overrideLanguage: SupportedLanguages | undefined;
  wordGameOptions: WordGameOptions;
  isGuessing: boolean = false;
  attempts: number = 0;

  // FIXME : should map a code to a Database probably
  constructor(frenchWordDatabase: IWordDatabase, englishWordDatabase: IWordDatabase, wordGameOptions: WordGameOptions) {
    this.frenchWordDatabase = frenchWordDatabase;
    this.englishWordDatabase = englishWordDatabase;

    this.wordGameOptions = wordGameOptions;
  }

  static getFullLanguage(languageCode: SupportedLanguages) {
    switch (languageCode) {
      case 'fra':
        return 'french';
      case 'eng':
          return 'english';
      default:
        throw new Error(`language '${languageCode}' is not supported`);
    }
  }

  get currentLanguage(): SupportedLanguages {
    if (this.overrideLanguage !== undefined) {
      return this.overrideLanguage;
    }
    return this.wordGameOptions.language;
  }

  get currentDatabase(): IWordDatabase {
    return this.getDatabase(this.currentLanguage);
  }

  getDatabase(language: SupportedLanguages) {
    switch (language) {
      case 'fra':
        return this.frenchWordDatabase;
      case 'eng':
        return this.englishWordDatabase;
      default:
        throw new Error(`language '${language}' is not supported`);
    }
  }

  getDatabaseHandleUndefined(language: SupportedLanguages | undefined = undefined) {
    let wordDatabase: IWordDatabase;
    if (language === undefined) {
      wordDatabase = this.currentDatabase;
    } else {
      wordDatabase = this.currentDatabase;
    }
    return wordDatabase;
  }

  getNewSequence(): string {
    const languageSequence = this.currentLanguage;
    const stringSequence = this.currentDatabase.getSequence(this.wordGameOptions.minOccurences, this.wordGameOptions.maxOccurences);
    this.currentSequence = {
      language: languageSequence,
      stringSequence: stringSequence,
    }
    if (this.wordGameOptions.guessAsSession) {
      this.isGuessing = true;
    }
    this.attempts = 0;
    return this.currentSequence.stringSequence;
  }
  
  // FIXME : should we bind the sequence to the language ?
  verifyGuess(word: string): GuessResult {
    this.attempts += 1;

    // FIXME
    // Property 'normalize' does not exist on type 'string'. Do you need to change your target library? Try changing the `lib` compiler option to 'es2015' or later.
    // When building with npm
    const normalizedWord = word.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()// TODO : locale lower case ?
    if (normalizedWord.search(new RegExp(this.currentSequence.stringSequence, 'i')) === -1) {
      return GuessResult.WORD_DO_NOT_MATCH_SEQUENCE;
    }

    // FIXME : should I use normalizedWord here ?
    let wordDatabase: IWordDatabase = this.getDatabase(this.currentSequence.language);

    const wordExists = wordDatabase.wordExists(word);
    if (wordExists) {
      if (this.wordGameOptions.guessAsSession) {
        this.isGuessing = false;
        this.currentSequence = this.getEmptySequence();
      }
      this.attempts = 0;
      return GuessResult.SUCCESSFUL_GUESS;
    }
    return GuessResult.WORD_DO_NOT_EXIST;
  }

  getExampleForSequence(): string {
    if (this.currentSequence.stringSequence === '') {
      throw new Error('You need to generate a sequence before calling this method.');
    }
    let wordDatabase: IWordDatabase = this.getDatabase(this.currentSequence.language);
    return wordDatabase.getWord(this.currentSequence.stringSequence);
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
    this.currentSequence = this.getEmptySequence();
    this.attempts = 0;
  }

  getEmptySequence(): Sequence {
    return {
      language: this.currentLanguage,
      stringSequence: "",
    };
  }

}
