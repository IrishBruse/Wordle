import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	clearProgress,
	getLevelCompletion,
	getMaxUnlockedLevel,
	hasFinishedFirstPuzzle,
	isLevelUnlocked,
	markLevelWon,
	unlockLevel,
} from "./progress";

function mockBrowserStorage() {
	const data = new Map<string, string>();
	const storage = {
		getItem: (key: string) => data.get(key) ?? null,
		setItem: (key: string, value: string) => {
			data.set(key, value);
		},
		removeItem: (key: string) => {
			data.delete(key);
		},
		clear: () => data.clear(),
		key: () => null,
		length: 0,
	};
	vi.stubGlobal("window", {
		localStorage: storage,
		dispatchEvent: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	});
	return data;
}

describe("progress (browser)", () => {
	beforeEach(() => {
		mockBrowserStorage();
		clearProgress();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("unlocks only level 0 by default", () => {
		expect(getMaxUnlockedLevel()).toBe(0);
		expect(isLevelUnlocked(0)).toBe(true);
		expect(isLevelUnlocked(1)).toBe(false);
	});

	it("unlockLevel raises the max unlocked id", () => {
		unlockLevel(2);
		expect(getMaxUnlockedLevel()).toBe(2);
		expect(isLevelUnlocked(2)).toBe(true);
		expect(isLevelUnlocked(3)).toBe(false);
	});

	it("hasFinishedFirstPuzzle after tutorial unlock", () => {
		expect(hasFinishedFirstPuzzle()).toBe(false);
		unlockLevel(1);
		expect(hasFinishedFirstPuzzle()).toBe(true);
	});

	it("markLevelWon records completion", () => {
		markLevelWon(0);
		expect(getLevelCompletion(0)).toBe("clean");
	});
});

describe("progress (SSR)", () => {
	it("returns safe defaults without window", () => {
		expect(getMaxUnlockedLevel()).toBe(0);
		expect(isLevelUnlocked(0)).toBe(true);
		expect(getLevelCompletion(0)).toBeNull();
	});
});
