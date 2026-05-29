import { describe, expect, it } from "vitest";
import { evaluateGuess, mergeLetterStates } from "./evaluate";

describe("evaluateGuess", () => {
	it("marks exact matches as correct", () => {
		expect(evaluateGuess("crane", "crane")).toEqual([
			"correct",
			"correct",
			"correct",
			"correct",
			"correct",
		]);
	});

	it("marks wrong position letters as present", () => {
		expect(evaluateGuess("eagle", "lemon")).toEqual([
			"present",
			"absent",
			"absent",
			"present",
			"absent",
		]);
	});

	it("handles duplicate letters in guess", () => {
		expect(evaluateGuess("speed", "erase")).toEqual([
			"present",
			"absent",
			"present",
			"present",
			"absent",
		]);
	});

	it("does not over-count duplicate present letters", () => {
		expect(evaluateGuess("aabbb", "abbba")).toEqual([
			"correct",
			"present",
			"correct",
			"correct",
			"present",
		]);
	});
});

describe("mergeLetterStates", () => {
	it("prefers correct over present", () => {
		expect(mergeLetterStates("present", "correct")).toBe("correct");
	});

	it("prefers present over absent", () => {
		expect(mergeLetterStates("absent", "present")).toBe("present");
	});
});
