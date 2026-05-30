import { createSeededRng, decodeSeed } from "./seed";
import { WORD_LENGTH } from "./types";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const MAX_ATTEMPTS = 100;

/** True when every letter steps by +1 or -1 in the alphabet (e.g. abcde, edcba). */
export function isLinearAlphabetRun(word: string): boolean {
	if (word.length < 2) return false;
	const step = word.charCodeAt(1) - word.charCodeAt(0);
	if (step !== 1 && step !== -1) return false;
	for (let i = 2; i < word.length; i++) {
		if (word.charCodeAt(i) - word.charCodeAt(i - 1) !== step) return false;
	}
	return true;
}

function isRejectedGibberish(
	candidate: string,
	invalidWords: Set<string>,
): boolean {
	return invalidWords.has(candidate) || isLinearAlphabetRun(candidate);
}

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
		if (!isRejectedGibberish(candidate, invalidWords)) return candidate;
	}
	const fallbackRng = createSeededRng(seed + MAX_ATTEMPTS);
	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const candidate = randomLetters(fallbackRng, length);
		if (!isRejectedGibberish(candidate, invalidWords)) return candidate;
	}
	return randomLetters(fallbackRng, length);
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
