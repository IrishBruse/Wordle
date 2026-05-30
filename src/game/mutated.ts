import { createSeededRng, decodeSeed, pickAnswerForSeed } from "./seed";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const MAX_ATTEMPTS = 100;
const MUTATION_SALT = 0x9e3779b9;

export type MutatedAnswerDetails = {
	answer: string;
	base: string;
	position: number;
	from: string;
	to: string;
};

function mutateLetterAt(
	base: string,
	position: number,
	letter: string,
): string {
	return base.slice(0, position) + letter + base.slice(position + 1);
}

function mutationDetails(
	base: string,
	position: number,
	to: string,
): MutatedAnswerDetails {
	const from = base[position] ?? "a";
	return {
		answer: mutateLetterAt(base, position, to),
		base,
		position,
		from,
		to,
	};
}

/** Seeded answer: a dictionary word with one letter replaced; result is not in `allowed`. */
export function pickMutatedAnswerDetailsForSeed(
	words: string[],
	seed: number,
	allowed: Set<string>,
): MutatedAnswerDetails {
	const base = pickAnswerForSeed(words, seed);
	const rng = createSeededRng((seed + MUTATION_SALT) >>> 0);

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const position = Math.floor(rng() * base.length);
		const original = base[position] ?? "a";
		const others = ALPHABET.replace(original, "");
		const letterIndex = Math.floor(rng() * others.length);
		const letter = others[letterIndex] ?? "a";
		const candidate = mutateLetterAt(base, position, letter);
		if (!allowed.has(candidate)) {
			return mutationDetails(base, position, letter);
		}
	}

	for (let position = 0; position < base.length; position++) {
		for (const letter of ALPHABET) {
			if (letter === base[position]) continue;
			const candidate = mutateLetterAt(base, position, letter);
			if (!allowed.has(candidate)) {
				return mutationDetails(base, position, letter);
			}
		}
	}

	const fallbackTo = base[0] === "a" ? "b" : "a";
	return mutationDetails(base, 0, fallbackTo);
}

export function pickMutatedAnswerForSeed(
	words: string[],
	seed: number,
	allowed: Set<string>,
): string {
	return pickMutatedAnswerDetailsForSeed(words, seed, allowed).answer;
}

export function formatMutationChange(details: MutatedAnswerDetails): string {
	const position = details.position + 1;
	return `Pos ${position}: ${details.from.toUpperCase()} -> ${details.to.toUpperCase()} (from ${details.base.toUpperCase()})`;
}

/** Resolve mutated answer for a four-digit seed code (level 6). */
export function mutatedAnswerForEncodedSeed(
	encoded: string,
	words: string[],
	allowed: Set<string>,
): string | null {
	const details = mutatedAnswerDetailsForEncodedSeed(encoded, words, allowed);
	return details?.answer ?? null;
}

export function mutatedAnswerDetailsForEncodedSeed(
	encoded: string,
	words: string[],
	allowed: Set<string>,
): MutatedAnswerDetails | null {
	const trimmed = encoded.trim();
	if (!trimmed) return null;
	const seed = decodeSeed(trimmed);
	if (seed === null) return null;
	return pickMutatedAnswerDetailsForSeed(words, seed, allowed);
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
