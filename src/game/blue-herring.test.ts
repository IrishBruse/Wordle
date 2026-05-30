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
	it("overrides the chosen column with decoy", () => {
		const scores = [
			"correct",
			"present",
			"absent",
			"correct",
			"present",
		] as const;
		expect(applyBlueHerring([...scores], 2)).toEqual([
			"correct",
			"present",
			"decoy",
			"correct",
			"present",
		]);
	});
});
