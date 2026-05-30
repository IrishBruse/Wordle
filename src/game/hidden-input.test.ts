import { describe, expect, it } from "vitest";
import {
	addLetterToGuess,
	buildFullGuess,
	removeLettersFromGuess,
	splitGuessForDisplay,
} from "./hidden-input";

describe("hidden-input", () => {
	it("builds a full guess from visible tiles and overflow", () => {
		expect(buildFullGuess("wordl", "e")).toBe("wordle");
	});

	it("stores the sixth letter in overflow while visible stays at five", () => {
		let full = "wordl";
		full = addLetterToGuess(full, "e", 6) ?? "";
		const split = splitGuessForDisplay(full, 5);
		expect(split.visible).toBe("wordl");
		expect(split.overflow).toBe("e");
	});

	it("removes two letters per backspace so the hidden slot stays secret", () => {
		const full = buildFullGuess("wordl", "e");
		expect(removeLettersFromGuess(full, 2)).toBe("word");
		expect(removeLettersFromGuess("wo", 2)).toBe("");
		expect(removeLettersFromGuess("w", 2)).toBe("");
	});
});
