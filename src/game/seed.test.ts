import { describe, expect, it } from "vitest";
import {
	answerForEncodedSeed,
	createSeededRng,
	decodeSeed,
	encodeSeed,
	pickAnswerForSeed,
} from "./seed";

describe("encodeSeed", () => {
	it("round-trips a seed", () => {
		expect(decodeSeed(encodeSeed(12_345_678))).toBe(12_345_678);
	});

	it("uses only alphanumeric characters", () => {
		expect(encodeSeed(3_041_456_789)).toMatch(/^[0-9a-zA-Z]+$/);
	});

	it("is always four characters", () => {
		expect(encodeSeed(0)).toHaveLength(4);
		expect(encodeSeed(1)).toBe("0001");
		expect(encodeSeed(3_041_456_789)).toHaveLength(4);
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

describe("answerForEncodedSeed", () => {
	it("returns null for empty or invalid codes", () => {
		const words = ["alpha", "bravo"];
		expect(answerForEncodedSeed("", words)).toBeNull();
		expect(answerForEncodedSeed("!!!!", words)).toBeNull();
	});

	it("matches pickAnswerForSeed for a valid code", () => {
		const words = ["alpha", "bravo", "charlie"];
		const code = encodeSeed(42);
		expect(answerForEncodedSeed(code, words)).toBe(
			pickAnswerForSeed(words, 42),
		);
	});
});

describe("createSeededRng", () => {
	it("returns the same sequence for the same seed", () => {
		const a = createSeededRng(99);
		const b = createSeededRng(99);
		expect([a(), a(), a()]).toEqual([b(), b(), b()]);
	});
});
