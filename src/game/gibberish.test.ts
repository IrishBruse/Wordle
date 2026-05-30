import { describe, expect, it } from "vitest";
import {
	gibberishForEncodedSeed,
	isLinearAlphabetRun,
	pickGibberishForSeed,
} from "./gibberish";
import { encodeSeed } from "./seed";
import { getWordLists } from "./words";

describe("isLinearAlphabetRun", () => {
	it("detects ascending and descending runs", () => {
		expect(isLinearAlphabetRun("abcde")).toBe(true);
		expect(isLinearAlphabetRun("bcdef")).toBe(true);
		expect(isLinearAlphabetRun("edcba")).toBe(true);
	});

	it("allows non-linear strings", () => {
		expect(isLinearAlphabetRun("zzzzz")).toBe(false);
		expect(isLinearAlphabetRun("acegi")).toBe(false);
		expect(isLinearAlphabetRun("abcef")).toBe(false);
	});
});

describe("pickGibberishForSeed", () => {
	it("returns the same string for the same seed", () => {
		const invalid = new Set(["crane", "audio"]);
		expect(pickGibberishForSeed(42, 5, invalid)).toBe(
			pickGibberishForSeed(42, 5, invalid),
		);
	});

	it("can return different strings for different seeds", () => {
		const invalid = new Set<string>();
		const picks = new Set(
			[1, 2, 3, 4, 5].map((seed) => pickGibberishForSeed(seed, 5, invalid)),
		);
		expect(picks.size).toBeGreaterThan(1);
	});

	it("never returns a word from the invalid set", () => {
		const { allowed } = getWordLists();
		for (let seed = 0; seed < 200; seed++) {
			const word = pickGibberishForSeed(seed, 5, allowed);
			expect(word).toHaveLength(5);
			expect(word).toMatch(/^[a-z]+$/);
			expect(allowed.has(word)).toBe(false);
			expect(isLinearAlphabetRun(word)).toBe(false);
		}
	});
});

describe("gibberishForEncodedSeed", () => {
	it("returns null for empty or invalid codes", () => {
		const invalid = new Set(["crane"]);
		expect(gibberishForEncodedSeed("", invalid)).toBeNull();
		expect(gibberishForEncodedSeed("!!!!", invalid)).toBeNull();
	});

	it("matches pickGibberishForSeed for a valid code", () => {
		const invalid = new Set(["crane"]);
		const code = encodeSeed(42);
		expect(gibberishForEncodedSeed(code, invalid)).toBe(
			pickGibberishForSeed(42, 5, invalid),
		);
	});
});
