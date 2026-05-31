import type { LevelId } from "./types";

const STORAGE_PREFIX = "wordle-seed-";
const ACTIVE_SEED_PREFIX = "wordle-active-seed-";

/** First seed shown for a level (0001). */
export const FIRST_LEVEL_SEED = 1;

/** Stable initial seed for SSR and the first client render (before localStorage sync). */
export const SSR_FALLBACK_SEED = FIRST_LEVEL_SEED;

const SEED_CODE_LENGTH = 4;
const MAX_SEED = 10 ** SEED_CODE_LENGTH;

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

function writeStoredSeed(levelId: LevelId, seed: number): void {
	window.localStorage.setItem(storageKey(levelId), encodeSeed(seed));
}

function storageKey(levelId: LevelId): string {
	return `${STORAGE_PREFIX}${levelId}`;
}

function activeSeedKey(levelId: LevelId): string {
	return `${ACTIVE_SEED_PREFIX}${levelId}`;
}

/** Drop the in-flight seed for a level (e.g. after leaving play or before New). */
export function clearActiveLevelSeed(levelId: LevelId): void {
	if (typeof window === "undefined") return;
	window.sessionStorage.removeItem(activeSeedKey(levelId));
}

/** Clear active seeds for every level after navigating away from play routes. */
export function clearAllActiveLevelSeeds(): void {
	if (typeof window === "undefined") return;
	const { sessionStorage } = window;
	for (let i = sessionStorage.length - 1; i >= 0; i--) {
		const key = sessionStorage.key(i);
		if (key?.startsWith(ACTIVE_SEED_PREFIX)) {
			sessionStorage.removeItem(key);
		}
	}
}

function readStoredNextSeed(levelId: LevelId): number {
	const raw = window.localStorage.getItem(storageKey(levelId));
	if (raw === null) return FIRST_LEVEL_SEED;
	const parsed = decodeSeed(raw);
	return parsed ?? FIRST_LEVEL_SEED;
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

const LEVEL_SEED_SALT = 0x9e3779b9;

/** Mix display seed with level so the same code yields different words per level. */
export function seedForLevel(seed: number, levelId: LevelId): number {
	return ((seed >>> 0) ^ Math.imul((levelId + 1) >>> 0, LEVEL_SEED_SALT)) >>> 0;
}

export function pickAnswerForLevel(
	words: string[],
	seed: number,
	levelId: LevelId,
): string {
	return pickAnswerForSeed(words, seedForLevel(seed, levelId));
}

export function createPickAnswerForLevel(levelId: LevelId) {
	return (words: string[], seed: number) =>
		pickAnswerForLevel(words, seed, levelId);
}

/** Resolve the answer word for a seed code shown in-game (four digits). */
export function answerForLevelEncodedSeed(
	encoded: string,
	words: string[],
	levelId: LevelId,
): string | null {
	const trimmed = encoded.trim();
	if (!trimmed) return null;
	const seed = decodeSeed(trimmed);
	if (seed === null) return null;
	return pickAnswerForLevel(words, seed, levelId);
}

/** Level 0 lookup helper; prefer {@link answerForLevelEncodedSeed} for other levels. */
export function answerForEncodedSeed(
	encoded: string,
	words: string[],
): string | null {
	return answerForLevelEncodedSeed(encoded, words, 0);
}

/**
 * Use the level's next seed and advance storage (0001, 0002, ...).
 * Call when entering a level, on loss, or when starting a new run after a win.
 */
export function consumeLevelSeed(levelId: LevelId): number {
	if (typeof window === "undefined") return SSR_FALLBACK_SEED;

	const activeRaw = window.sessionStorage.getItem(activeSeedKey(levelId));
	if (activeRaw !== null) {
		const active = decodeSeed(activeRaw);
		if (active !== null) return active;
	}

	const seed = readStoredNextSeed(levelId);
	writeStoredSeed(levelId, normalizeSeed(seed + 1));
	window.sessionStorage.setItem(activeSeedKey(levelId), encodeSeed(seed));
	return seed;
}
