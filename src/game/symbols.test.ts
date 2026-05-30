import { describe, expect, it } from "vitest";
import { encodeSeed } from "./seed";
import {
	decodeWord,
	encodeWord,
	isAllowedLeetKey,
	isCanonicalLeetForm,
	isLeetGuessValid,
	pickLeetAnswerForSeed,
	symbolsForEncodedSeed,
} from "./symbols";
import { getWordLists } from "./words";

describe("encodeWord", () => {
	it("substitutes standard letters and leaves others alone", () => {
		expect(encodeWord("snort")).toBe("$n0rt");
		expect(encodeWord("audio")).toBe("@ud!0");
		expect(encodeWord("crane")).toBe("cr@ne");
	});
});

describe("decodeWord", () => {
	it("reverses symbol substitutions", () => {
		expect(decodeWord("$n0rt")).toBe("snort");
		expect(decodeWord("@ud!0")).toBe("audio");
	});
});

describe("isCanonicalLeetForm", () => {
	it("accepts encoded form and rejects plain letters for mapped chars", () => {
		expect(isCanonicalLeetForm("cr@ne")).toBe(true);
		expect(isCanonicalLeetForm("crane")).toBe(false);
		expect(isCanonicalLeetForm("@$&!?")).toBe(false);
	});
});

describe("isAllowedLeetKey", () => {
	it("allows letters and substitution symbols", () => {
		expect(isAllowedLeetKey("a")).toBe(true);
		expect(isAllowedLeetKey("@")).toBe(true);
		expect(isAllowedLeetKey("-")).toBe(false);
	});
});

describe("pickLeetAnswerForSeed", () => {
	it("returns the same encoding for the same seed", () => {
		const { answers } = getWordLists();
		expect(pickLeetAnswerForSeed(answers, 42)).toBe(
			pickLeetAnswerForSeed(answers, 42),
		);
	});

	it("encodes a dictionary word", () => {
		const { answers, allowed } = getWordLists();
		const encoded = pickLeetAnswerForSeed(answers, 1);
		expect(encoded).toHaveLength(5);
		expect(isCanonicalLeetForm(encoded)).toBe(true);
		expect(allowed.has(decodeWord(encoded))).toBe(true);
	});
});

describe("isLeetGuessValid", () => {
	it("accepts encoded dictionary words", () => {
		const { allowed } = getWordLists();
		expect(isLeetGuessValid("cr@ne", allowed)).toBe(true);
		expect(isLeetGuessValid("crane", allowed)).toBe(false);
	});
});

describe("symbolsForEncodedSeed", () => {
	it("returns null for empty or invalid codes", () => {
		const { answers } = getWordLists();
		expect(symbolsForEncodedSeed("", answers)).toBeNull();
		expect(symbolsForEncodedSeed("!!!!", answers)).toBeNull();
	});

	it("matches pickLeetAnswerForSeed for a valid code", () => {
		const { answers } = getWordLists();
		const code = encodeSeed(42);
		expect(symbolsForEncodedSeed(code, answers)).toBe(
			pickLeetAnswerForSeed(answers, 42),
		);
	});
});
