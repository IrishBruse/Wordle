import { decodeSeed, pickAnswerForSeed } from "./seed";
import { WORD_LENGTH } from "./types";

/** Matches on-screen symbol keyboard rows (see Keyboard.tsx). */
export const SYMBOL_KEY_ROWS = [
	["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
	["-", "/", ":", ";", "(", ")", "$", "&", "@", '"'],
	[".", ",", "?", "!", "'"],
] as const;

const KEYBOARD_MODE_KEYS = new Set(["ENTER", "BACK", "ABC", "123"]);

export const SYMBOL_CHARS: Set<string> = new Set(
	SYMBOL_KEY_ROWS.flat().filter((key) => !KEYBOARD_MODE_KEYS.has(key)),
);

/** Standard letter -> symbol substitutions for level 7. */
export const LETTER_TO_SYMBOL: Record<string, string> = {
	a: "@",
	i: "!",
	o: "0",
	s: "$",
};

export const SYMBOL_TO_LETTER: Record<string, string> = {
	"@": "a",
	"!": "i",
	"0": "o",
	$: "s",
};

const SUBSTITUTION_SYMBOLS = new Set(Object.values(LETTER_TO_SYMBOL));

export function encodeWord(word: string): string {
	return word
		.toLowerCase()
		.split("")
		.map((char) => LETTER_TO_SYMBOL[char] ?? char)
		.join("");
}

export function decodeWord(encoded: string): string {
	return encoded
		.toLowerCase()
		.split("")
		.map((char) => SYMBOL_TO_LETTER[char] ?? char)
		.join("");
}

/** Guess uses symbols for mapped letters and plain letters elsewhere. */
export function isCanonicalLeetForm(encoded: string): boolean {
	const lower = encoded.toLowerCase();
	if (lower.length === 0) return false;
	for (const char of lower) {
		if (LETTER_TO_SYMBOL[char]) return false;
		if (SUBSTITUTION_SYMBOLS.has(char)) continue;
		if (char >= "a" && char <= "z") continue;
		return false;
	}
	return encodeWord(decodeWord(lower)) === lower;
}

export function isAllowedSymbolKey(key: string): boolean {
	return SYMBOL_CHARS.has(key);
}

export function isAllowedLeetKey(key: string): boolean {
	if (/^[a-zA-Z]$/.test(key)) return true;
	return SUBSTITUTION_SYMBOLS.has(key);
}

export function pickLeetAnswerForSeed(words: string[], seed: number): string {
	return encodeWord(pickAnswerForSeed(words, seed));
}

/** Resolve leet-encoded answer for a four-digit seed code (level 7). */
export function symbolsForEncodedSeed(
	encoded: string,
	words: string[],
	length = WORD_LENGTH,
): string | null {
	const trimmed = encoded.trim();
	if (!trimmed) return null;
	const seed = decodeSeed(trimmed);
	if (seed === null) return null;
	const word = pickAnswerForSeed(words, seed);
	if (word.length !== length) return null;
	return encodeWord(word);
}

export function isLeetGuessValid(guess: string, allowed: Set<string>): boolean {
	if (guess.length !== WORD_LENGTH) return false;
	if (!isCanonicalLeetForm(guess)) return false;
	return allowed.has(decodeWord(guess));
}
