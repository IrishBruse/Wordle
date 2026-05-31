import { describe, expect, it } from "vitest";
import {
	cipherWinWordForScoringAnswer,
	shiftWordForward,
} from "#/game/cipher-shift";
import { evaluateGuess } from "#/game/evaluate";
import { simulatePlaythrough } from "#/game/simulate-level";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { getWordLists } from "#/game/words";
import { level8 } from "./index";

describe("level 8: Off by One", () => {
	const { answers } = getWordLists();

	it("uses standard layout and guess count", () => {
		expect(level8.id).toBe(8);
		expect(level8.wordLength).toBe(WORD_LENGTH);
		expect(level8.maxGuesses).toBe(MAX_GUESSES);
		expect(level8.cipherShift).toBe(true);
	});

	it("scores against the shifted answer, not the win word", () => {
		const scoring = level8.pickAnswer(answers, 42);
		const win = cipherWinWordForScoringAnswer(scoring);
		const guess = "crane";
		expect(level8.evaluateGuess(guess, scoring)).toEqual(
			evaluateGuess(guess, scoring),
		);
		expect(level8.evaluateGuess(guess, scoring)).not.toEqual(
			evaluateGuess(guess, win),
		);
	});

	it("turns a full shifted guess all green without counting as a win in simulation", () => {
		const scoring = level8.pickAnswer(answers, 7);
		const win = cipherWinWordForScoringAnswer(scoring);
		const rows = simulatePlaythrough(level8, scoring, [scoring], {
			winAgainst: win,
		});
		expect(rows[0]).toEqual([
			"correct",
			"correct",
			"correct",
			"correct",
			"correct",
		]);
	});

	it("wins only when the unshifted word is submitted", () => {
		const scoring = level8.pickAnswer(answers, 123);
		const win = cipherWinWordForScoringAnswer(scoring);
		const winRow = simulatePlaythrough(level8, scoring, [win], {
			winAgainst: win,
		});
		expect(winRow[0]).toEqual([
			"correct",
			"correct",
			"correct",
			"correct",
			"correct",
		]);

		const partial = simulatePlaythrough(level8, scoring, ["zzzzz"], {
			winAgainst: win,
		});
		expect(partial[0].every((s) => s === "absent")).toBe(true);
	});

	it("maps waver to xbwfs for a known word", () => {
		expect(shiftWordForward("waver")).toBe("xbwfs");
	});
});
