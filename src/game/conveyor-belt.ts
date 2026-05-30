import type { LetterState } from "./types";

/** Rotate a word one position to the left (e.g. waver -> averw). */
export function rotateWordLeft(word: string): string {
	if (word.length <= 1) return word;
	return word.slice(1) + word[0];
}

/** Rotate after a turn that found at least one green letter. */
export function shouldAdvanceConveyor(scores: LetterState[]): boolean {
	return scores.some((state) => state === "correct");
}
