import { mock, when, instance } from 'ts-mockito';
import { IWordDatabase } from '../../src/domain/ports/secondary/IWordDatabase';
import { WordGame } from '../../src/domain/WordGame';
import { IWordGame } from '../../src/domain/IWordGame';
import { GuessResult } from '../../src/domain/models/GuessResult';

describe('WordGame', () => {
  describe('getNewSequence', () => {
    it('should return the sequence returned by the database', () => {
      // given
      const expectedSequence = 'test';
      const minOccurences = 0;
      const maxOccurences = 10;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: -1,
        language: "fra"
      });

      // when
      let sequence = wordGame.getNewSequence();

      // then
      expect(sequence).toBe(expectedSequence);
      expect(wordGame.currentSequence.stringSequence).toBe(expectedSequence);
    });

    it('should indicate that the game is in play if the option guessAsSession is true', () => {
      // given
      const expectedSequence = 'test';
      const minOccurences = 0;
      const maxOccurences = 10;
      const guessAsSession = true;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: guessAsSession,
        maxAttempts: -1,
        language: "fra"
      });

      // when
      let sequence = wordGame.getNewSequence();

      // then
      expect(wordGame.isGuessing).toBe(true);
    });
  });

  describe('verifyGuess', () => {
    it('should verify if it match the sequence', () => {
      // given
      const expectedSequence = 'test';
      const minOccurences = 0;
      const maxOccurences = 10;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame: IWordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: -1,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      let result = wordGame.verifyGuess('tet');

      // then
      expect(result).toBe(GuessResult.WORD_DO_NOT_MATCH_SEQUENCE);
    });

    it('should return a correct result if the word mach the sequence and the word exist', () => {
      // given
      const expectedSequence = 'test';
      const minOccurences = 0;
      const maxOccurences = 10;
      const guess = 'testing';
      const wordExist = true;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.wordExists(guess)).thenReturn(wordExist);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame: IWordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: -1,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      let result = wordGame.verifyGuess(guess);

      // then
      expect(result).toBe(GuessResult.SUCCESSFUL_GUESS);
    });

    it('should return a correct result if the word mach the sequence and the word exist, and the word contains accent at the sequence section', () => {
      // given
      const expectedSequence = 'test';
      const minOccurences = 0;
      const maxOccurences = 10;
      const guess = 'tésting';
      const wordExist = true;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.wordExists(guess)).thenReturn(wordExist);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame: IWordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: -1,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      let result = wordGame.verifyGuess(guess);

      // then
      expect(result).toBe(GuessResult.SUCCESSFUL_GUESS);
    });

    it('should return a incorrect result if the word mach the sequence and the word does not exist', () => {
      // given
      const expectedSequence = 'test';
      const minOccurences = 0;
      const maxOccurences = 10;
      const guess = 'testing';
      const wordExist = false;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.wordExists(guess)).thenReturn(wordExist);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame: IWordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: -1,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      let result = wordGame.verifyGuess(guess);

      // then
      expect(result).toBe(GuessResult.WORD_DO_NOT_EXIST);
    });

    it('should clear the state if guessAsSession is true', () => {
      // given
      const expectedSequence = 'test';
      const minOccurences = 0;
      const maxOccurences = 10;
      const guess = 'testing';
      const wordExist = true;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.wordExists(guess)).thenReturn(wordExist);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame: IWordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: true,
        maxAttempts: -1,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      let result = wordGame.verifyGuess(guess);

      // then
      expect(wordGame.isGuessing).toBe(false);
      expect(wordGame.currentSequence.stringSequence).toBe('');
      expect(wordGame.attempts).toBe(0);
    });

    it('should increase the attempts count', () => {
      // given
      const expectedSequence = 'test';
      const minOccurences = 0;
      const maxOccurences = 10;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame: IWordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: -1,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      let result = wordGame.verifyGuess('tet');

      // then
      expect(wordGame.attempts).toBe(1);
    });
  });

  describe('getExampleForSequence', () => {
    it('should return the example returned by the database', () => {
      // given
      const expectedSequence = 'test';
      const expectedExample = 'testing';
      const minOccurences = 0;
      const maxOccurences = 10;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.getWord(expectedSequence)).thenReturn(expectedExample);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: -1,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      let example = wordGame.getExampleForSequence();

      // then
      expect(example).toBe(expectedExample);
    });

    it('should throw if a sequence was not generated', () => {
      // given
      const expectedSequence = 'test';
      const expectedExample = 'testing';
      const minOccurences = 0;
      const maxOccurences = 10;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.getWord(expectedSequence)).thenReturn(expectedExample);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: -1,
        language: "fra"
      });

      // let sequence = wordGame.getNewSequence();

      // when
      // then
      expect(() => wordGame.getExampleForSequence()).toThrow(Error);
    });
  });

  describe('maxAttemptReached', () => {
    it('should not reach max attempts if max attempt is set to -1', () => {
      // given
      const expectedSequence = 'test';
      const expectedWord = 'testing';
      const minOccurences = 0;
      const maxOccurences = 10;
      const maxAttempts = -1;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.wordExists(expectedWord)).thenReturn(false);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: maxAttempts,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      let result = wordGame.verifyGuess(expectedWord);

      // then
      expect(wordGame.maxAttemptReached()).toBe(false);
    });

    it('should not reach max attempts if max attempt is set to 0', () => {
      // given
      const expectedSequence = 'test';
      const expectedWord = 'testing';
      const minOccurences = 0;
      const maxOccurences = 10;
      const maxAttempts = 0;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.wordExists(expectedWord)).thenReturn(false);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: maxAttempts,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      let result = wordGame.verifyGuess(expectedWord);

      // then
      expect(wordGame.maxAttemptReached()).toBe(false);
    });

    // TODO : make it a parametrized test
    it('should reach max attempts if max attempt is set to 1', () => {
      // given
      const expectedSequence = 'test';
      const expectedWord = 'testing';
      const minOccurences = 0;
      const maxOccurences = 10;
      const maxAttempts = 1;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.wordExists(expectedWord)).thenReturn(false);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: maxAttempts,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      let result = wordGame.verifyGuess(expectedWord);

      // then
      expect(wordGame.maxAttemptReached()).toBe(true);
    });

    it('should reach max attempts if max attempt is set to 2', () => {
      // given
      const expectedSequence = 'test';
      const expectedWord = 'testing';
      const minOccurences = 0;
      const maxOccurences = 10;
      const maxAttempts = 2;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.wordExists(expectedWord)).thenReturn(false);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: maxAttempts,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      wordGame.verifyGuess(expectedWord);
      wordGame.verifyGuess(expectedWord);

      // then
      expect(wordGame.maxAttemptReached()).toBe(true);
    });
  });

  // FIXME : make it parametrized
  describe('remainingAttempts', () => {
    it('should substract max attempts and current attempts', () => {
      // given
      const expectedSequence = 'test';
      const expectedWord = 'testing';
      const minOccurences = 0;
      const maxOccurences = 10;
      const maxAttempts = 2;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.wordExists(expectedWord)).thenReturn(false);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: maxAttempts,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      // when
      wordGame.verifyGuess(expectedWord);

      // then
      expect(wordGame.remainingAttempts()).toBe(1);
    });
  });

  describe('reset', () => {
    it('should reset the state', () => {
      // given
      const expectedSequence = 'test';
      const expectedWord = 'testing';
      const minOccurences = 0;
      const maxOccurences = 10;
      const maxAttempts = 2;

      let mockedWordDatabase: IWordDatabase = mock<IWordDatabase>();
      when(mockedWordDatabase.getSequence(minOccurences, maxOccurences)).thenReturn(expectedSequence);
      when(mockedWordDatabase.wordExists(expectedWord)).thenReturn(false);

      let wordDatabase: IWordDatabase = instance(mockedWordDatabase);
      let englishWordDatabase: IWordDatabase = instance(mockedWordDatabase);

      let wordGame = new WordGame(wordDatabase, englishWordDatabase, {
        minOccurences: minOccurences,
        maxOccurences: maxOccurences,
        guessAsSession: false,
        maxAttempts: maxAttempts,
        language: "fra"
      });

      let sequence = wordGame.getNewSequence();

      wordGame.verifyGuess(expectedWord);

      // when
      wordGame.reset();

      // then
      expect(wordGame.currentSequence.stringSequence).toBe('');
      expect(wordGame.isGuessing).toBe(false);
      expect(wordGame.remainingAttempts()).toBe(2);
    });
  });
});