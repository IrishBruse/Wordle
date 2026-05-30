import { applyBlueHerring, pickDecoyColumn } from "./blue-herring";
import {
	rotateWordLeft,
	shouldAdvanceConveyor,
} from "./conveyor-belt";
import type { LetterState, LevelConfig } from "./types";

export type ScoreGuessOptions = {
	/** Pin the blue decoy column (level 2) instead of random. */
	fixedDecoyColumn?: number;
};

/** Score one submitted row the same way as useWordleGame. */
export function scoreGuessForLevel(
	level: LevelConfig,
	guess: string,
	answer: string,
	rowIndex: number,
	decoyColumn: number | null,
	decoyLetter: string | null,
	options?: ScoreGuessOptions,
): { scores: LetterState[]; decoyColumn: number | null; decoyLetter: string | null } {
	const trueScores = level.evaluateGuess(guess, answer);
	let column = decoyColumn ?? options?.fixedDecoyColumn ?? null;
	if (level.blueHerring && column === null && rowIndex === 0) {
		column = pickDecoyColumn(level.wordLength);
	}
	let letter = decoyLetter;
	if (level.blueHerring && column !== null && rowIndex === 0) {
		letter = guess[column].toUpperCase();
	}
	const scores =
		level.blueHerring && column !== null
			? applyBlueHerring(trueScores, guess, column, letter, rowIndex)
			: trueScores;
	return { scores, decoyColumn: column, decoyLetter: letter };
}

/** Run a sequence of guesses and return displayed tile states per row. */
export function simulatePlaythrough(
	level: LevelConfig,
	initialAnswer: string,
	guesses: string[],
	options?: ScoreGuessOptions,
): LetterState[][] {
	let decoyColumn: number | null = options?.fixedDecoyColumn ?? null;
	let decoyLetter: string | null = null;
	let target = initialAnswer;
	const rows: LetterState[][] = [];
	for (let i = 0; i < guesses.length; i++) {
		const guess = guesses[i];
		const result = scoreGuessForLevel(
			level,
			guess,
			target,
			i,
			decoyColumn,
			decoyLetter,
			options,
		);
		rows.push(result.scores);
		decoyColumn = result.decoyColumn;
		decoyLetter = result.decoyLetter;

		if (!level.conveyorBelt) continue;

		const won = guess === initialAnswer;
		if (won || !shouldAdvanceConveyor(result.scores)) continue;

		target = rotateWordLeft(target);
	}
	return rows;
}
