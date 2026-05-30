import { describe, expect, it } from "vitest";
import { isRotatedFormOf, rotateWordLeft } from "./conveyor-belt";

describe("conveyor-belt", () => {
	it("rotates a word one position left", () => {
		expect(rotateWordLeft("waver")).toBe("averw");
	});

	it("detects left-rotations of the base word", () => {
		expect(isRotatedFormOf("waver", "waver")).toBe(true);
		expect(isRotatedFormOf("waver", "averw")).toBe(true);
		expect(isRotatedFormOf("waver", "verwa")).toBe(true);
		expect(isRotatedFormOf("waver", "erwav")).toBe(true);
		expect(isRotatedFormOf("waver", "rwave")).toBe(true);
	});

	it("rejects unrelated words", () => {
		expect(isRotatedFormOf("waver", "crane")).toBe(false);
		expect(isRotatedFormOf("aeons", "neons")).toBe(false);
	});
});
