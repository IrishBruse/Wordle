import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	answerForEncodedSeed,
	answerForLevelEncodedSeed,
	clearActiveLevelSeed,
	consumeLevelSeed,
	createSeededRng,
	decodeSeed,
	encodeSeed,
	FIRST_LEVEL_SEED,
	pickAnswerForLevel,
	pickAnswerForSeed,
} from "./seed";
import { getWordLists } from "./words";

function mockBrowserStorage() {
	const local = new Map<string, string>();
	const session = new Map<string, string>();
	const makeStorage = (data: Map<string, string>) => ({
		getItem: (key: string) => data.get(key) ?? null,
		setItem: (key: string, value: string) => {
			data.set(key, value);
		},
		removeItem: (key: string) => {
			data.delete(key);
		},
		clear: () => data.clear(),
		key: (index: number) => [...data.keys()][index] ?? null,
		get length() {
			return data.size;
		},
	});
	vi.stubGlobal("window", {
		localStorage: makeStorage(local),
		sessionStorage: makeStorage(session),
	});
	return { local, session };
}

describe("encodeSeed", () => {
	it("round-trips a seed", () => {
		expect(decodeSeed(encodeSeed(5678))).toBe(5678);
	});

	it("uses only digits", () => {
		expect(encodeSeed(3_041_456_789)).toMatch(/^\d+$/);
	});

	it("is always four characters", () => {
		expect(encodeSeed(0)).toHaveLength(4);
		expect(encodeSeed(1)).toBe("0001");
		expect(encodeSeed(3_041_456_789)).toBe("6789");
	});
});

describe("pickAnswerForSeed", () => {
	it("picks the same word for the same seed", () => {
		const words = ["alpha", "bravo", "charlie"];
		expect(pickAnswerForSeed(words, 42)).toBe(pickAnswerForSeed(words, 42));
	});

	it("can pick different words for different seeds", () => {
		const words = ["alpha", "bravo", "charlie", "delta", "echo"];
		const picks = new Set(
			[1, 2, 3, 4, 5].map((seed) => pickAnswerForSeed(words, seed)),
		);
		expect(picks.size).toBeGreaterThan(1);
	});
});

describe("pickAnswerForLevel", () => {
	it("picks the same word for the same seed and level", () => {
		const words = ["alpha", "bravo", "charlie"];
		expect(pickAnswerForLevel(words, 42, 0)).toBe(
			pickAnswerForLevel(words, 42, 0),
		);
	});

	it("picks different words for the same seed on different levels", () => {
		const { answers } = getWordLists();
		const seed = 1;
		const byLevel = [0, 1, 2, 3].map((levelId) =>
			pickAnswerForLevel(answers, seed, levelId),
		);
		expect(new Set(byLevel).size).toBeGreaterThan(1);
	});
});

describe("answerForEncodedSeed", () => {
	it("returns null for empty or invalid codes", () => {
		const words = ["alpha", "bravo"];
		expect(answerForEncodedSeed("", words)).toBeNull();
		expect(answerForEncodedSeed("!!!!", words)).toBeNull();
	});

	it("matches pickAnswerForLevel for level 0", () => {
		const words = ["alpha", "bravo", "charlie"];
		const code = encodeSeed(42);
		expect(answerForEncodedSeed(code, words)).toBe(
			pickAnswerForLevel(words, 42, 0),
		);
	});
});

describe("answerForLevelEncodedSeed", () => {
	it("matches pickAnswerForLevel for a valid code", () => {
		const words = ["alpha", "bravo", "charlie"];
		const code = encodeSeed(42);
		expect(answerForLevelEncodedSeed(code, words, 2)).toBe(
			pickAnswerForLevel(words, 42, 2),
		);
	});
});

describe("createSeededRng", () => {
	it("returns the same sequence for the same seed", () => {
		const a = createSeededRng(99);
		const b = createSeededRng(99);
		expect([a(), a(), a()]).toEqual([b(), b(), b()]);
	});
});

describe("consumeLevelSeed", () => {
	beforeEach(() => mockBrowserStorage());
	afterEach(() => vi.unstubAllGlobals());

	it("starts at 0001 and increments on each consume", () => {
		expect(consumeLevelSeed(0)).toBe(FIRST_LEVEL_SEED);
		clearActiveLevelSeed(0);
		expect(consumeLevelSeed(0)).toBe(2);
		clearActiveLevelSeed(0);
		expect(consumeLevelSeed(0)).toBe(3);
	});

	it("keeps a separate counter per level", () => {
		expect(consumeLevelSeed(1)).toBe(FIRST_LEVEL_SEED);
		expect(consumeLevelSeed(2)).toBe(FIRST_LEVEL_SEED);
		clearActiveLevelSeed(1);
		expect(encodeSeed(consumeLevelSeed(1))).toBe("0002");
	});

	it("reuses the active seed until it is cleared", () => {
		expect(consumeLevelSeed(0)).toBe(FIRST_LEVEL_SEED);
		expect(consumeLevelSeed(0)).toBe(FIRST_LEVEL_SEED);
		clearActiveLevelSeed(0);
		expect(consumeLevelSeed(0)).toBe(2);
	});
});
