import type { LevelId } from "./types";

const STORAGE_PREFIX = "wordle-seed-";
const BASE62 =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Compact alphanumeric code for display and storage (0-9, a-z, A-Z). */
export function encodeSeed(seed: number): string {
	let n = seed >>> 0;
	if (n === 0) return "0";
	let out = "";
	while (n > 0) {
		out = BASE62[n % 62] + out;
		n = Math.floor(n / 62);
	}
	return out;
}

export function decodeSeed(encoded: string): number | null {
	if (!encoded) return null;
	let n = 0;
	for (const char of encoded) {
		const digit = BASE62.indexOf(char);
		if (digit === -1) return null;
		n = n * 62 + digit;
		if (n > 0xffff_ffff) return null;
	}
	return n >>> 0;
}

function readStoredSeed(raw: string): number | null {
	if (/[a-zA-Z]/.test(raw)) return decodeSeed(raw);
	if (/^\d+$/.test(raw)) {
		const legacy = Number.parseInt(raw, 10);
		if (Number.isFinite(legacy)) return legacy >>> 0;
	}
	return decodeSeed(raw);
}

function writeStoredSeed(levelId: LevelId, seed: number): void {
	window.localStorage.setItem(storageKey(levelId), encodeSeed(seed));
}

function storageKey(levelId: LevelId): string {
	return `${STORAGE_PREFIX}${levelId}`;
}

function randomSeed(): number {
	return Math.floor(Math.random() * 0x1_0000_0000) >>> 0;
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

export function getOrCreateLevelSeed(levelId: LevelId): number {
	if (typeof window === "undefined") return 1;
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
	writeStoredSeed(levelId, parsed);
	return parsed;
}

export function rollLevelSeed(levelId: LevelId): number {
	if (typeof window === "undefined") return 1;
	const seed = randomSeed();
	writeStoredSeed(levelId, seed);
	return seed;
}
