import type { LetterState } from "./types";

/** Pick a random column index for the permanent blue decoy slot. */
export function pickDecoyColumn(wordLength: number): number {
	return Math.floor(Math.random() * wordLength);
}

/**
 * Apply blue herring display scoring.
 * Row 0: the chosen column establishes the herring letter (always shown as decoy).
 * Later rows: every tile with that letter is decoy; other letters use true scores.
 */
export function applyBlueHerring(
	scores: LetterState[],
	guess: string,
	decoyColumn: number,
	decoyLetter: string | null,
	rowIndex: number,
): LetterState[] {
	const herring = (
		rowIndex === 0 ? guess[decoyColumn] : decoyLetter
	)?.toUpperCase();
	if (!herring) return scores;

	const next = [...scores];
	for (let i = 0; i < guess.length; i++) {
		if (guess[i].toUpperCase() !== herring) continue;
		next[i] = "decoy";
	}
	return next;
}
