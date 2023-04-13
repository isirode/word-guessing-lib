export interface IWordDatabase {
  getSequence (minOccurences: number, maxOccurences: number): string
  wordExists (word: string): boolean
  getWord (sequence: string): string
}
