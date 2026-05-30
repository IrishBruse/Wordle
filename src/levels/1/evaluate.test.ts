import { describe, expect, it } from "vitest";
import { evaluateGuessInvertedColors } from "./evaluate";

describe("evaluateGuessInvertedColors", () => {
	it("swaps correct and present", () => {
		expect(evaluateGuessInvertedColors("crane", "crane")).toEqual([
			"present",
			"present",
			"present",
			"present",
			"present",
		]);
	});

	it("marks wrong position letters as correct", () => {
		expect(evaluateGuessInvertedColors("eagle", "lemon")).toEqual([
			"correct",
			"absent",
			"absent",
			"correct",
			"absent",
		]);
	});
});
