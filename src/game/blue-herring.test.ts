import { describe, expect, it, vi } from "vitest";
import { applyBlueHerring, pickDecoyColumn } from "./blue-herring";

describe("pickDecoyColumn", () => {
	it("returns an index in range", () => {
		const spy = vi.spyOn(Math, "random").mockReturnValue(0.99);
		expect(pickDecoyColumn(5)).toBe(4);
		spy.mockRestore();
	});
});

describe("applyBlueHerring", () => {
	it("overrides the chosen column on the first guess", () => {
		const scores = [
			"correct",
			"present",
			"absent",
			"correct",
			"present",
		] as const;
		expect(applyBlueHerring([...scores], "crane", 2, "A", 0)).toEqual([
			"correct",
			"present",
			"decoy",
			"correct",
			"present",
		]);
	});

	it("marks every herring letter on later guesses", () => {
		const scores = ["absent", "present", "absent", "absent", "absent"] as const;
		expect(applyBlueHerring([...scores], "lower", 0, "W", 2)).toEqual([
			"absent",
			"present",
			"decoy",
			"absent",
			"absent",
		]);
	});

	it("does not decoy other letters in the herring column", () => {
		const scores = ["present", "absent", "absent", "absent", "absent"] as const;
		expect(applyBlueHerring([...scores], "audio", 3, "E", 1)).toEqual([
			...scores,
		]);
	});
});
