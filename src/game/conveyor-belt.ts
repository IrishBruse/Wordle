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

/** True when `candidate` is a left-rotation of `word` (e.g. waver / averw). */
export function isRotatedFormOf(word: string, candidate: string): boolean {
	if (word.length !== candidate.length || word.length === 0) return false;
	let rotated = word;
	for (let i = 0; i < word.length; i++) {
		if (rotated === candidate) return true;
		rotated = rotateWordLeft(rotated);
	}
	return false;
}
