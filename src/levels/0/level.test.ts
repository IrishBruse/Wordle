import { describe, expect, it } from "vitest";
import { simulatePlaythrough } from "#/game/simulate-level";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { getWordLists } from "#/game/words";
import { level0 } from "./index";

describe("level 0: Classic", () => {
	it("exposes standard Wordle dimensions", () => {
		expect(level0.id).toBe(0);
		expect(level0.wordLength).toBe(WORD_LENGTH);
		expect(level0.maxGuesses).toBe(MAX_GUESSES);
		expect(level0.blueHerring).toBeUndefined();
	});

	it("scores exact matches as correct (green)", () => {
		expect(level0.evaluateGuess("crane", "crane")).toEqual([
			"correct",
			"correct",
			"correct",
			"correct",
			"correct",
		]);
	});

	it("scores misplaced letters as present (yellow)", () => {
		expect(level0.evaluateGuess("eagle", "lemon")).toEqual([
			"present",
			"absent",
			"absent",
			"present",
			"absent",
		]);
	});

	it("wins in one guess when the word is found", () => {
		const { answers } = getWordLists();
		const answer = level0.pickAnswer(answers, 100);
		const rows = simulatePlaythrough(level0, answer, [answer]);
		expect(rows).toHaveLength(1);
		expect(rows[0].every((s) => s === "correct")).toBe(true);
	});

	it("picks the same answer for the same seed", () => {
		const words = ["alpha", "bravo", "charlie"];
		expect(level0.pickAnswer(words, 7)).toBe(level0.pickAnswer(words, 7));
	});
});
