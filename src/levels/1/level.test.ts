import { describe, expect, it } from "vitest";
import { evaluateGuess } from "#/game/evaluate";
import { simulatePlaythrough } from "#/game/simulate-level";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { getWordLists } from "#/game/words";
import { level1 } from "./index";

describe("level 1: Double Agent", () => {
	it("exposes inverted-color rules on standard dimensions", () => {
		expect(level1.id).toBe(1);
		expect(level1.wordLength).toBe(WORD_LENGTH);
		expect(level1.maxGuesses).toBe(MAX_GUESSES);
		expect(level1.blueHerring).toBeUndefined();
	});

	it("marks exact positions as present (yellow)", () => {
		expect(level1.evaluateGuess("crane", "crane")).toEqual([
			"present",
			"present",
			"present",
			"present",
			"present",
		]);
	});

	it("marks misplaced letters as correct (green)", () => {
		expect(level1.evaluateGuess("eagle", "lemon")).toEqual([
			"correct",
			"absent",
			"absent",
			"correct",
			"absent",
		]);
	});

	it("inverts only correct and present from standard scoring", () => {
		const guess = "eagle";
		const answer = "lemon";
		const standard = evaluateGuess(guess, answer);
		const inverted = level1.evaluateGuess(guess, answer);
		for (let i = 0; i < guess.length; i++) {
			if (standard[i] === "correct") expect(inverted[i]).toBe("present");
			else if (standard[i] === "present") expect(inverted[i]).toBe("correct");
			else expect(inverted[i]).toBe(standard[i]);
		}
	});

	it("wins in one guess with all present tiles", () => {
		const { answers } = getWordLists();
		const answer = level1.pickAnswer(answers, 200);
		const rows = simulatePlaythrough(level1, answer, [answer]);
		expect(rows[0].every((s) => s === "present")).toBe(true);
	});
});
