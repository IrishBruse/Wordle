import { describe, expect, it } from "vitest";
import { evaluateGuess } from "#/game/evaluate";
import { simulatePlaythrough } from "#/game/simulate-level";
import { pickSymbolsForSeed } from "#/game/symbols";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { getWordLists } from "#/game/words";
import { level7 } from "./index";

describe("level 7: Symbols", () => {
	const { allowed, answers } = getWordLists();

	it("configures symbol keyboard and length", () => {
		expect(level7.id).toBe(7);
		expect(level7.wordLength).toBe(WORD_LENGTH);
		expect(level7.maxGuesses).toBe(MAX_GUESSES);
		expect(level7.symbolsKeyboard).toBe(true);
	});

	it("picks a seeded symbol-only answer", () => {
		const secret = level7.pickAnswer(answers, 42);
		expect(secret).toHaveLength(WORD_LENGTH);
		expect(level7.isGuessValid?.(secret, allowed)).toBe(true);
		expect(level7.pickAnswer(answers, 42)).toBe(secret);
		expect(level7.pickAnswer(answers, 99)).not.toBe(secret);
	});

	it("rejects letters and accepts symbol-only guesses", () => {
		expect(level7.isGuessValid?.("crane", allowed)).toBe(false);
		expect(level7.isGuessValid?.("12ab3", allowed)).toBe(false);
		const secret = pickSymbolsForSeed(1, WORD_LENGTH);
		expect(level7.isGuessValid?.(secret, allowed)).toBe(true);
		expect(level7.isGuessValid?.("@$&!?", allowed)).toBe(true);
	});

	it("scores guesses with standard Wordle rules", () => {
		const secret = level7.pickAnswer(answers, 7);
		const guess = `${secret.slice(0, 4)}?`;
		expect(level7.evaluateGuess(guess, secret)).toEqual(
			evaluateGuess(guess, secret),
		);
	});

	it("can be won by matching the symbol secret", () => {
		const secret = level7.pickAnswer(answers, 123);
		const rows = simulatePlaythrough(level7, secret, [secret]);
		expect(rows[0]).toEqual([
			"correct",
			"correct",
			"correct",
			"correct",
			"correct",
		]);
	});
});
