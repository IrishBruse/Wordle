import type { LevelId } from "./types";

const STORAGE_PREFIX = "wordle-seed-";

/** Stable initial seed for SSR and the first client render (before localStorage sync). */
export const SSR_FALLBACK_SEED = 1;

const SEED_CODE_LENGTH = 4;
const MAX_SEED = 10 ** SEED_CODE_LENGTH;

/** Base62 alphabet for seeds stored before numeric-only codes. */
const LEGACY_BASE62 =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function normalizeSeed(seed: number): number {
	return (seed >>> 0) % MAX_SEED;
}

/** Four-digit decimal code for display and storage (0000-9999). */
export function encodeSeed(seed: number): string {
	return String(normalizeSeed(seed)).padStart(SEED_CODE_LENGTH, "0");
}

export function decodeSeed(encoded: string): number | null {
	if (!/^\d+$/.test(encoded)) return null;
	const n = Number.parseInt(encoded, 10);
	if (!Number.isFinite(n) || n < 0 || n >= MAX_SEED) return null;
	return n;
}

function decodeLegacyBase62Seed(encoded: string): number | null {
	if (!encoded) return null;
	let n = 0;
	for (const char of encoded) {
		const digit = LEGACY_BASE62.indexOf(char);
		if (digit === -1) return null;
		n = n * 62 + digit;
		if (n > 0xffff_ffff) return null;
	}
	return normalizeSeed(n >>> 0);
}

function readStoredSeed(raw: string): number | null {
	if (/[a-zA-Z]/.test(raw)) return decodeLegacyBase62Seed(raw);
	if (/^\d+$/.test(raw)) {
		const fromCode = decodeSeed(raw);
		if (fromCode !== null) return fromCode;
		const legacy = Number.parseInt(raw, 10);
		if (Number.isFinite(legacy)) return normalizeSeed(legacy);
	}
	return decodeLegacyBase62Seed(raw);
}

function writeStoredSeed(levelId: LevelId, seed: number): void {
	window.localStorage.setItem(storageKey(levelId), encodeSeed(seed));
}

function storageKey(levelId: LevelId): string {
	return `${STORAGE_PREFIX}${levelId}`;
}

function randomSeed(): number {
	return Math.floor(Math.random() * MAX_SEED) >>> 0;
}

/** Mulberry32 PRNG; same seed yields the same sequence. */
export function createSeededRng(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = state;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 0x1_0000_0000;
	};
}

export function pickAnswerForSeed(words: string[], seed: number): string {
	if (words.length === 0) return "crane";
	const rng = createSeededRng(seed);
	const index = Math.floor(rng() * words.length);
	return words[index] ?? "crane";
}

/** Resolve the answer word for a seed code shown in-game (four digits). */
export function answerForEncodedSeed(
	encoded: string,
	words: string[],
): string | null {
	const trimmed = encoded.trim();
	if (!trimmed) return null;
	const seed = decodeSeed(trimmed);
	if (seed === null) return null;
	return pickAnswerForSeed(words, seed);
}

export function getOrCreateLevelSeed(levelId: LevelId): number {
	if (typeof window === "undefined") return SSR_FALLBACK_SEED;
	const raw = window.localStorage.getItem(storageKey(levelId));
	if (!raw) {
		const seed = randomSeed();
		writeStoredSeed(levelId, seed);
		return seed;
	}
	const parsed = readStoredSeed(raw);
	if (parsed === null) {
		const seed = randomSeed();
		writeStoredSeed(levelId, seed);
		return seed;
	}
	const normalized = normalizeSeed(parsed);
	writeStoredSeed(levelId, normalized);
	return normalized;
}

export function rollLevelSeed(levelId: LevelId): number {
	if (typeof window === "undefined") return SSR_FALLBACK_SEED;
	const seed = randomSeed();
	writeStoredSeed(levelId, seed);
	return seed;
}
