import { describe, expect, it } from "vitest";
import {
	getLevel,
	getNextLevel,
	getNumberedLevels,
	getTutorialLevel,
	LEVELS,
} from "./index";

describe("levels registry", () => {
	it("lists tutorial then numbered levels in order", () => {
		expect(LEVELS.map((l) => l.id)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
	});

	it("returns the tutorial as level 0", () => {
		expect(getTutorialLevel().id).toBe(0);
		expect(getTutorialLevel().name).toBe("Classic");
	});

	it("getNumberedLevels matches LEVELS", () => {
		expect(getNumberedLevels()).toBe(LEVELS);
	});

	it("getLevel finds by id", () => {
		expect(getLevel(1)?.name).toBe("Double Agent");
		expect(getLevel(99)).toBeUndefined();
	});

	it("getNextLevel returns the following puzzle", () => {
		expect(getNextLevel(0)?.id).toBe(1);
		expect(getNextLevel(1)?.id).toBe(2);
		expect(getNextLevel(2)?.id).toBe(3);
		expect(getNextLevel(3)?.id).toBe(4);
		expect(getNextLevel(4)?.id).toBe(5);
		expect(getNextLevel(5)?.id).toBe(6);
		expect(getNextLevel(6)?.id).toBe(7);
		expect(getNextLevel(7)?.id).toBe(8);
		expect(getNextLevel(8)).toBeUndefined();
	});
});
