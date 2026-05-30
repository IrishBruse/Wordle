import { createSeededRng, decodeSeed, pickAnswerForSeed } from "./seed";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const MAX_ATTEMPTS = 100;
const MUTATION_SALT = 0x9e3779b9;

function mutateLetterAt(
	base: string,
	position: number,
	letter: string,
): string {
	return base.slice(0, position) + letter + base.slice(position + 1);
}

/** Seeded answer: a dictionary word with one letter replaced; result is not in `allowed`. */
export function pickMutatedAnswerForSeed(
	words: string[],
	seed: number,
	allowed: Set<string>,
): string {
	const base = pickAnswerForSeed(words, seed);
	const rng = createSeededRng((seed + MUTATION_SALT) >>> 0);

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const position = Math.floor(rng() * base.length);
		const original = base[position] ?? "a";
		const others = ALPHABET.replace(original, "");
		const letterIndex = Math.floor(rng() * others.length);
		const letter = others[letterIndex] ?? "a";
		const candidate = mutateLetterAt(base, position, letter);
		if (!allowed.has(candidate)) return candidate;
	}

	for (let position = 0; position < base.length; position++) {
		for (const letter of ALPHABET) {
			if (letter === base[position]) continue;
			const candidate = mutateLetterAt(base, position, letter);
			if (!allowed.has(candidate)) return candidate;
		}
	}

	return mutateLetterAt(base, 0, base[0] === "a" ? "b" : "a");
}

/** Resolve mutated answer for a four-digit seed code (level 6). */
export function mutatedAnswerForEncodedSeed(
	encoded: string,
	words: string[],
	allowed: Set<string>,
): string | null {
	const trimmed = encoded.trim();
	if (!trimmed) return null;
	const seed = decodeSeed(trimmed);
	if (seed === null) return null;
	return pickMutatedAnswerForSeed(words, seed, allowed);
}

/** Hamming distance; used in tests to assert a single-letter mutation. */
export function letterDifferenceCount(a: string, b: string): number {
	const len = Math.min(a.length, b.length);
	let count = 0;
	for (let i = 0; i < len; i++) {
		if (a[i] !== b[i]) count++;
	}
	count += Math.abs(a.length - b.length);
	return count;
}
