import { createSeededRng, decodeSeed } from "./seed";
import { WORD_LENGTH } from "./types";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const MAX_ATTEMPTS = 100;

function randomLetters(rng: () => number, length: number): string {
	let out = "";
	for (let i = 0; i < length; i++) {
		const index = Math.floor(rng() * ALPHABET.length);
		out += ALPHABET[index] ?? "a";
	}
	return out;
}

/** Seeded random letter string that is not in `invalidWords`. */
export function pickGibberishForSeed(
	seed: number,
	length: number,
	invalidWords: Set<string>,
): string {
	const rng = createSeededRng(seed);
	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const candidate = randomLetters(rng, length);
		if (!invalidWords.has(candidate)) return candidate;
	}
	return randomLetters(createSeededRng(seed + MAX_ATTEMPTS), length);
}

/** Resolve gibberish answer for a four-digit seed code (level 6). */
export function gibberishForEncodedSeed(
	encoded: string,
	invalidWords: Set<string>,
	length = WORD_LENGTH,
): string | null {
	const trimmed = encoded.trim();
	if (!trimmed) return null;
	const seed = decodeSeed(trimmed);
	if (seed === null) return null;
	return pickGibberishForSeed(seed, length, invalidWords);
}
