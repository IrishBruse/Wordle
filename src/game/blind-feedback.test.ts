import { describe, expect, it } from "vitest";
import { applyBlindDisplay } from "./blind-feedback";

describe("applyBlindDisplay", () => {
	it("masks correct and present as absent when not won", () => {
		expect(
			applyBlindDisplay(
				["correct", "present", "absent", "present", "correct"],
				false,
			),
		).toEqual(["absent", "absent", "absent", "absent", "absent"]);
	});

	it("shows all correct on win", () => {
		expect(applyBlindDisplay(["absent", "present", "absent"], true)).toEqual([
			"correct",
			"correct",
			"correct",
		]);
	});
});
