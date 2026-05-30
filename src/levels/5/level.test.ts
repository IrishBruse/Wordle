import { describe, expect, it } from "vitest";
import { evaluateGuess } from "#/game/evaluate";
import { simulatePlaythrough } from "#/game/simulate-level";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { getWordLists } from "#/game/words";
import { HARDCODED_ANSWER, level5 } from "./index";

describe("level 5: Phantom", () => {
	it("shows five tiles but the secret has six letters", () => {
		expect(level5.id).toBe(5);
		expect(level5.wordLength).toBe(WORD_LENGTH);
		expect(level5.guessLength).toBe(6);
		expect(level5.backspaceStep).toBe(2);
		expect(level5.maxGuesses).toBe(MAX_GUESSES);
	});

	it("always picks wordle regardless of seed", () => {
		expect(level5.pickAnswer([], 1)).toBe(HARDCODED_ANSWER);
		expect(level5.pickAnswer([], 99_999)).toBe(HARDCODED_ANSWER);
	});

	it("accepts normal five-letter guesses and the hidden winning word", () => {
		const allowed = getWordLists().allowed;
		expect(level5.isGuessValid?.("crane", allowed)).toBe(true);
		expect(level5.isGuessValid?.("wordle", allowed)).toBe(true);
		expect(level5.isGuessValid?.("zzzzz", allowed)).toBe(false);
	});

	it("scores five-letter guesses against the full answer including the hidden letter", () => {
		expect(level5.evaluateGuess("waver", HARDCODED_ANSWER)).toEqual([
			"correct",
			"absent",
			"absent",
			"present",
			"present",
		]);
		expect(level5.evaluateGuess("overs", HARDCODED_ANSWER)).toEqual([
			"present",
			"absent",
			"present",
			"present",
			"absent",
		]);
	});

	it("scores a full six-letter guess normally", () => {
		expect(level5.evaluateGuess("wordle", HARDCODED_ANSWER)).toEqual(
			evaluateGuess("wordle", HARDCODED_ANSWER),
		);
	});

	it("reveals only the first five tiles on the board", () => {
		const rows = simulatePlaythrough(level5, HARDCODED_ANSWER, ["crane"]);
		expect(rows[0]).toHaveLength(5);
		expect(rows[0]).toEqual(
			evaluateGuess("crane", HARDCODED_ANSWER).slice(0, WORD_LENGTH),
		);

		const winRows = simulatePlaythrough(level5, HARDCODED_ANSWER, ["wordle"]);
		expect(winRows[0]).toEqual([
			"correct",
			"correct",
			"correct",
			"correct",
			"correct",
		]);
	});
});
