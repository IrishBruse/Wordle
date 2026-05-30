import { describe, expect, it } from "vitest";
import { evaluateGuess } from "#/game/evaluate";
import {
	letterDifferenceCount,
	pickMutatedAnswerForSeed,
} from "#/game/mutated";
import { pickAnswerForLevel } from "#/game/seed";
import { simulatePlaythrough } from "#/game/simulate-level";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { getWordLists } from "#/game/words";
import { level6 } from "./index";

describe("level 6: Almost", () => {
	const { allowed, answers } = getWordLists();

	it("configures standard word list rules", () => {
		expect(level6.id).toBe(6);
		expect(level6.wordLength).toBe(WORD_LENGTH);
		expect(level6.maxGuesses).toBe(MAX_GUESSES);
		expect(level6.isGuessValid).toBeUndefined();
	});

	it("secret is not in the dictionary but differs by one letter from the base word", () => {
		const secret = level6.pickAnswer(answers, 42);
		expect(allowed.has(secret)).toBe(false);
		expect(allowed.has("crane")).toBe(true);
	});

	it("picks a one-letter mutation of a seeded answer word", () => {
		const secret = level6.pickAnswer(answers, 42);
		const base = pickAnswerForLevel(answers, 42, 6);
		expect(secret).toHaveLength(WORD_LENGTH);
		expect(allowed.has(secret)).toBe(false);
		expect(letterDifferenceCount(base, secret)).toBe(1);
		expect(level6.pickAnswer(answers, 42)).toBe(secret);
		expect(level6.pickAnswer(answers, 99)).not.toBe(
			level6.pickAnswer(answers, 42),
		);
	});

	it("matches pickMutatedAnswerForSeed", () => {
		expect(level6.pickAnswer(answers, 7)).toBe(
			pickMutatedAnswerForSeed(answers, 7, allowed),
		);
	});

	it("scores guesses with standard Wordle rules", () => {
		const secret = level6.pickAnswer(answers, 7);
		const guess = `${secret.slice(0, 4)}x`;
		expect(level6.evaluateGuess(guess, secret)).toEqual(
			evaluateGuess(guess, secret),
		);
	});

	it("can be won by matching the mutated secret", () => {
		const secret = level6.pickAnswer(answers, 123);
		const rows = simulatePlaythrough(level6, secret, [secret]);
		expect(rows[0]).toEqual([
			"correct",
			"correct",
			"correct",
			"correct",
			"correct",
		]);
	});
});
