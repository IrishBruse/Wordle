import { evaluateGuess } from "#/game/evaluate";
import { type LetterState } from "#/game/types";

/** Green/yellow meanings are swapped from standard Wordle. */
export function evaluateGuessInvertedColors(
	guess: string,
	answer: string,
): LetterState[] {
	return evaluateGuess(guess, answer).map((state) => {
		if (state === "correct") return "present";
		if (state === "present") return "correct";
		return state;
	});
}
