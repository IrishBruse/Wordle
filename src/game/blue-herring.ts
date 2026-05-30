import type { LetterState } from "./types";

/** Pick a random column index for the permanent blue decoy slot. */
export function pickDecoyColumn(wordLength: number): number {
	return Math.floor(Math.random() * wordLength);
}

/** Force one column to decoy feedback, overriding its true score. */
export function applyBlueHerring(
	scores: LetterState[],
	decoyColumn: number,
): LetterState[] {
	const next = [...scores];
	next[decoyColumn] = "decoy";
	return next;
}
