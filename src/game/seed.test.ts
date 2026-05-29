import { describe, expect, it } from "vitest";
import {
	createSeededRng,
	decodeSeed,
	encodeSeed,
	pickAnswerForSeed,
} from "./seed";

describe("encodeSeed", () => {
	it("round-trips a seed", () => {
		expect(decodeSeed(encodeSeed(2_147_483_647))).toBe(2_147_483_647);
	});

	it("uses only alphanumeric characters", () => {
		expect(encodeSeed(3_041_456_789)).toMatch(/^[0-9a-zA-Z]+$/);
	});

	it("is shorter than decimal for large seeds", () => {
		const seed = 3_041_456_789;
		expect(encodeSeed(seed).length).toBeLessThan(String(seed).length);
	});
});

describe("pickAnswerForSeed", () => {
	it("picks the same word for the same seed", () => {
		const words = ["alpha", "bravo", "charlie"];
		expect(pickAnswerForSeed(words, 42)).toBe(pickAnswerForSeed(words, 42));
	});

	it("can pick different words for different seeds", () => {
		const words = ["alpha", "bravo", "charlie", "delta", "echo"];
		const picks = new Set(
			[1, 2, 3, 4, 5].map((seed) => pickAnswerForSeed(words, seed)),
		);
		expect(picks.size).toBeGreaterThan(1);
	});
});

describe("createSeededRng", () => {
	it("returns the same sequence for the same seed", () => {
		const a = createSeededRng(99);
		const b = createSeededRng(99);
		expect([a(), a(), a()]).toEqual([b(), b(), b()]);
	});
});
