import { describe, expect, it } from "vitest";
import { evaluateGuess } from "#/game/evaluate";
import { pickGibberishForSeed } from "#/game/gibberish";
import { simulatePlaythrough } from "#/game/simulate-level";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { getWordLists } from "#/game/words";
import { level6 } from "./index";

describe("level 6: Inverted", () => {
	const { allowed, answers } = getWordLists();

	it("configures inverted word list rules", () => {
		expect(level6.id).toBe(6);
		expect(level6.wordLength).toBe(WORD_LENGTH);
		expect(level6.maxGuesses).toBe(MAX_GUESSES);
	});

	it("picks seeded gibberish that is not a dictionary word", () => {
		const secret = level6.pickAnswer(answers, 42);
		expect(secret).toHaveLength(WORD_LENGTH);
		expect(allowed.has(secret)).toBe(false);
		expect(level6.pickAnswer(answers, 42)).toBe(secret);
		expect(level6.pickAnswer(answers, 99)).not.toBe(
			level6.pickAnswer(answers, 42),
		);
	});

	it("rejects dictionary words and accepts gibberish", () => {
		expect(level6.isGuessValid?.("crane", allowed)).toBe(false);
		expect(level6.isGuessValid?.("audio", allowed)).toBe(false);
		const secret = pickGibberishForSeed(1, WORD_LENGTH, allowed);
		expect(level6.isGuessValid?.(secret, allowed)).toBe(true);
		expect(level6.isGuessValid?.("zzzzz", allowed)).toBe(true);
	});

	it("rejects linear alphabet runs", () => {
		expect(level6.isGuessValid?.("abcde", allowed)).toBe(false);
		expect(level6.isGuessValid?.("edcba", allowed)).toBe(false);
		expect(level6.isGuessValid?.("bcdef", allowed)).toBe(false);
	});

	it("never picks a linear alphabet run as the secret", () => {
		for (let seed = 0; seed < 200; seed++) {
			const secret = level6.pickAnswer(answers, seed);
			expect(secret).toMatch(/^[a-z]{5}$/);
			expect(allowed.has(secret)).toBe(false);
			expect(level6.isGuessValid?.(secret, allowed)).toBe(true);
		}
	});

	it("scores guesses with standard Wordle rules", () => {
		const secret = level6.pickAnswer(answers, 7);
		const guess = `${secret.slice(0, 4)}x`;
		expect(level6.evaluateGuess(guess, secret)).toEqual(
			evaluateGuess(guess, secret),
		);
	});

	it("can be won by matching the gibberish secret", () => {
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
