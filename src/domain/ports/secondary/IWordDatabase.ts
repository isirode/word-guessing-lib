export interface IWordDatabase {
  getSequence (minOccurences: number, maxOccurences: number): string;
  getSequenceOccurences(sequence: string): number;
  wordExists (word: string): boolean;
  getWord (sequence: string): string;

  countWords(): number | undefined;
  countSequences(): number | undefined;
}
