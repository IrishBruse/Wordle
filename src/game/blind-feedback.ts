import type { LetterState } from "./types";

/** Hide correct/present on tiles and keyboard; win still shows all green. */
export function applyBlindDisplay(
	scores: LetterState[],
	won: boolean,
): LetterState[] {
	if (won) {
		return scores.map(() => "correct");
	}
	return scores.map(() => "absent");
}
