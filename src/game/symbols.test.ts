import { describe, expect, it } from "vitest";
import { encodeSeed } from "./seed";
import {
	isAllowedSymbolKey,
	isSymbolOnlyString,
	pickSymbolsForSeed,
	symbolsForEncodedSeed,
} from "./symbols";

describe("pickSymbolsForSeed", () => {
	it("returns the same string for the same seed", () => {
		expect(pickSymbolsForSeed(42, 5)).toBe(pickSymbolsForSeed(42, 5));
	});

	it("returns symbol-only strings", () => {
		for (let seed = 0; seed < 100; seed++) {
			const word = pickSymbolsForSeed(seed, 5);
			expect(word).toHaveLength(5);
			expect(isSymbolOnlyString(word)).toBe(true);
		}
	});
});

describe("isSymbolOnlyString", () => {
	it("accepts keyboard symbols and rejects letters", () => {
		expect(isSymbolOnlyString("@$&!?")).toBe(true);
		expect(isSymbolOnlyString("hello")).toBe(false);
	});
});

describe("isAllowedSymbolKey", () => {
	it("matches tile symbols but not mode keys", () => {
		expect(isAllowedSymbolKey("@")).toBe(true);
		expect(isAllowedSymbolKey("ENTER")).toBe(false);
	});
});

describe("symbolsForEncodedSeed", () => {
	it("returns null for empty or invalid codes", () => {
		expect(symbolsForEncodedSeed("")).toBeNull();
		expect(symbolsForEncodedSeed("!!!!")).toBeNull();
	});

	it("matches pickSymbolsForSeed for a valid code", () => {
		const code = encodeSeed(42);
		expect(symbolsForEncodedSeed(code)).toBe(pickSymbolsForSeed(42, 5));
	});
});
