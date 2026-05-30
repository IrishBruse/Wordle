import { createSeededRng, decodeSeed } from "./seed";
import { WORD_LENGTH } from "./types";

/** Matches on-screen symbol keyboard rows (see Keyboard.tsx). */
export const SYMBOL_KEY_ROWS = [
	["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
	["-", "/", ":", ";", "(", ")", "$", "&", "@", '"'],
	[".", ",", "?", "!", "'"],
] as const;

const KEYBOARD_MODE_KEYS = new Set(["ENTER", "BACK", "ABC", "123"]);

export const SYMBOL_CHARS = new Set(
	SYMBOL_KEY_ROWS.flat().filter((key) => !KEYBOARD_MODE_KEYS.has(key)),
);

export function isSymbolOnlyString(value: string): boolean {
	if (value.length === 0) return false;
	for (const char of value) {
		if (!SYMBOL_CHARS.has(char)) return false;
	}
	return true;
}

export function isAllowedSymbolKey(key: string): boolean {
	return SYMBOL_CHARS.has(key);
}

/** Seeded random symbol string for level 7. */
export function pickSymbolsForSeed(seed: number, length: number): string {
	const pool = [...SYMBOL_CHARS];
	const rng = createSeededRng(seed);
	let out = "";
	for (let i = 0; i < length; i++) {
		const index = Math.floor(rng() * pool.length);
		out += pool[index] ?? "0";
	}
	return out;
}

/** Resolve symbol answer for a four-digit seed code (level 7). */
export function symbolsForEncodedSeed(
	encoded: string,
	length = WORD_LENGTH,
): string | null {
	const trimmed = encoded.trim();
	if (!trimmed) return null;
	const seed = decodeSeed(trimmed);
	if (seed === null) return null;
	return pickSymbolsForSeed(seed, length);
}
