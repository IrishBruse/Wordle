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
		expect(LEVELS.map((l) => l.id)).toEqual([0, 1, 2]);
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
		expect(getNextLevel(2)).toBeUndefined();
	});
});
