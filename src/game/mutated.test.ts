import { describe, expect, it } from "vitest";
import {
	formatMutationChange,
	letterDifferenceCount,
	mutatedAnswerDetailsForEncodedSeed,
	mutatedAnswerForEncodedSeed,
	pickMutatedAnswerDetailsForSeed,
	pickMutatedAnswerForSeed,
} from "./mutated";
import { encodeSeed, pickAnswerForLevel } from "./seed";
import { getWordLists } from "./words";

describe("pickMutatedAnswerForSeed", () => {
	const { allowed, answers } = getWordLists();

	it("returns the same string for the same seed", () => {
		expect(pickMutatedAnswerForSeed(answers, 42, allowed)).toBe(
			pickMutatedAnswerForSeed(answers, 42, allowed),
		);
	});

	it("can return different strings for different seeds", () => {
		const picks = new Set(
			[1, 2, 3, 4, 5].map((seed) =>
				pickMutatedAnswerForSeed(answers, seed, allowed),
			),
		);
		expect(picks.size).toBeGreaterThan(1);
	});

	it("differs by one letter from the seeded base word and is not in the list", () => {
		for (let seed = 0; seed < 200; seed++) {
			const base = pickAnswerForLevel(answers, seed, 6);
			const word = pickMutatedAnswerForSeed(answers, seed, allowed);
			expect(word).toHaveLength(5);
			expect(word).toMatch(/^[a-z]+$/);
			expect(allowed.has(word)).toBe(false);
			expect(letterDifferenceCount(base, word)).toBe(1);
		}
	});
});

describe("mutatedAnswerForEncodedSeed", () => {
	it("returns null for empty or invalid codes", () => {
		const { allowed, answers } = getWordLists();
		expect(mutatedAnswerForEncodedSeed("", answers, allowed)).toBeNull();
		expect(mutatedAnswerForEncodedSeed("!!!!", answers, allowed)).toBeNull();
	});

	it("matches pickMutatedAnswerForSeed for a valid code", () => {
		const { allowed, answers } = getWordLists();
		const code = encodeSeed(42);
		expect(mutatedAnswerForEncodedSeed(code, answers, allowed)).toBe(
			pickMutatedAnswerForSeed(answers, 42, allowed),
		);
	});

	it("returns details for a valid code", () => {
		const { allowed, answers } = getWordLists();
		const code = encodeSeed(42);
		expect(mutatedAnswerDetailsForEncodedSeed(code, answers, allowed)).toEqual(
			pickMutatedAnswerDetailsForSeed(answers, 42, allowed),
		);
	});
});

describe("formatMutationChange", () => {
	it("shows base word and mutated answer", () => {
		const line = formatMutationChange({
			answer: "brxne",
			base: "crane",
			position: 2,
			from: "a",
			to: "x",
		});
		expect(line).toBe("CRANE | BRXNE");
	});
});
