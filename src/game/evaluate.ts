import type { LetterState } from "./types";

/** Standard Wordle scoring (handles duplicate letters correctly). */
export function evaluateGuess(guess: string, answer: string): LetterState[] {
	const length = answer.length;
	const result: LetterState[] = Array.from({ length }, () => "absent");
	const answerCounts = new Map<string, number>();

	for (const char of answer) {
		answerCounts.set(char, (answerCounts.get(char) ?? 0) + 1);
	}

	for (let i = 0; i < length; i++) {
		if (guess[i] !== answer[i]) continue;
		result[i] = "correct";
		answerCounts.set(guess[i], (answerCounts.get(guess[i]) ?? 1) - 1);
	}

	for (let i = 0; i < length; i++) {
		if (result[i] === "correct") continue;
		const char = guess[i];
		const remaining = answerCounts.get(char) ?? 0;
		if (remaining <= 0) continue;
		result[i] = "present";
		answerCounts.set(char, remaining - 1);
	}

	return result;
}

/** Level 2: green/yellow meanings are swapped. */
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

const STATE_RANK: Record<LetterState, number> = {
	empty: 0,
	tbd: 0,
	absent: 1,
	present: 2,
	correct: 3,
};

/** Merge keyboard hints: correct beats present beats absent. */
export function mergeLetterStates(
	current: LetterState | undefined,
	next: LetterState,
): LetterState {
	if (!current || current === "empty" || current === "tbd") return next;
	if (STATE_RANK[next] > STATE_RANK[current]) return next;
	return current;
}
