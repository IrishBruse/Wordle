import { describe, expect, it } from "vitest";
import { evaluateGuess } from "#/game/evaluate";
import { pickAnswerForSeed } from "#/game/seed";
import { simulatePlaythrough } from "#/game/simulate-level";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { HARDCODED_ANSWER, level4 } from "./index";

describe("level 4: Hardcoded", () => {
	it("exposes blind feedback and a fixed answer", () => {
		expect(level4.id).toBe(4);
		expect(level4.wordLength).toBe(WORD_LENGTH);
		expect(level4.maxGuesses).toBe(MAX_GUESSES);
		expect(level4.blindFeedback).toBe(true);
	});

	it("always picks the hardcoded word regardless of seed", () => {
		const words = ["alpha", "bravo", "charlie"];
		expect(level4.pickAnswer(words, 1)).toBe(HARDCODED_ANSWER);
		expect(level4.pickAnswer(words, 99_999)).toBe(HARDCODED_ANSWER);
		expect(level4.pickAnswer(words, 1)).not.toBe(pickAnswerForSeed(words, 1));
	});

	it("still scores guesses normally for internal logic", () => {
		expect(level4.evaluateGuess("crane", HARDCODED_ANSWER)).toEqual(
			evaluateGuess("crane", HARDCODED_ANSWER),
		);
	});

	it("shows only gray tiles until the winning guess", () => {
		const rows = simulatePlaythrough(level4, HARDCODED_ANSWER, [
			"crane",
			"stare",
		]);
		expect(rows[0]).toEqual(["absent", "absent", "absent", "absent", "absent"]);
		expect(rows[1]).toEqual(["absent", "absent", "absent", "absent", "absent"]);
	});

	it("shows all green on the winning guess", () => {
		const rows = simulatePlaythrough(level4, HARDCODED_ANSWER, [
			HARDCODED_ANSWER,
		]);
		expect(rows[0]).toEqual([
			"correct",
			"correct",
			"correct",
			"correct",
			"correct",
		]);
	});
});
