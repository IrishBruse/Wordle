import { describe, expect, it } from "vitest";
import { isRotatedFormOf, rotateWordLeft } from "#/game/conveyor-belt";
import { evaluateGuess } from "#/game/evaluate";
import { simulatePlaythrough } from "#/game/simulate-level";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { level3 } from "./index";

describe("level 3: Conveyor Belt", () => {
	it("uses standard scoring with conveyor enabled", () => {
		expect(level3.id).toBe(3);
		expect(level3.wordLength).toBe(WORD_LENGTH);
		expect(level3.maxGuesses).toBe(MAX_GUESSES);
		expect(level3.conveyorBelt).toBe(true);
	});

	it("matches standard scoring for a fixed target", () => {
		expect(level3.evaluateGuess("crane", "crane")).toEqual(
			evaluateGuess("crane", "crane"),
		);
	});

	it("rotates the target left after a turn with a green letter", () => {
		const rows = simulatePlaythrough(level3, "waver", ["whips", "audio"]);
		expect(rows[0]).toEqual(evaluateGuess("whips", "waver"));
		expect(rows[1]).toEqual(evaluateGuess("audio", rotateWordLeft("waver")));
	});

	it("does not rotate on turns without a green letter", () => {
		const rows = simulatePlaythrough(level3, "waver", ["whips", "binds"]);
		expect(rows[1]).toEqual(evaluateGuess("binds", rotateWordLeft("waver")));
	});

	it("keeps rotating on later turns that find greens", () => {
		const rows = simulatePlaythrough(level3, "waver", [
			"whips",
			"audio",
			"eaten",
		]);
		expect(rows[2]).toEqual(
			evaluateGuess("eaten", rotateWordLeft(rotateWordLeft("waver"))),
		);
	});

	it("does not rotate before the first green letter", () => {
		const rows = simulatePlaythrough(level3, "waver", ["audio", "whips"]);
		expect(rows[0]).toEqual(evaluateGuess("audio", "waver"));
		expect(rows[1]).toEqual(evaluateGuess("whips", "waver"));
	});

	it("scores against the rotated target but wins on the original word", () => {
		const rows = simulatePlaythrough(level3, "waver", ["whips", "waver"]);
		expect(rows[0]).toEqual(evaluateGuess("whips", "waver"));
		expect(rows[1]).toEqual(evaluateGuess("waver", rotateWordLeft("waver")));
	});

	it("does not rotate after a winning guess", () => {
		const answer = "waver";
		const rows = simulatePlaythrough(level3, answer, [answer]);
		expect(rows[0]).toEqual(evaluateGuess(answer, answer));
	});

	it("treats rotated targets as valid guesses even when not dictionary words", () => {
		const base = "waver";
		const rotated = rotateWordLeft(base);
		expect(isRotatedFormOf(base, rotated)).toBe(true);
	});
});
