// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	installDebugConsoleToggle,
	isDebugModeEnabled,
	setDebugModeEnabled,
	toggleDebugMode,
} from "./dev";

describe("debug mode", () => {
	beforeEach(() => {
		sessionStorage.clear();
		Reflect.deleteProperty(window, "D");
	});

	afterEach(() => {
		sessionStorage.clear();
		Reflect.deleteProperty(window, "D");
	});

	it("starts disabled", () => {
		expect(isDebugModeEnabled()).toBe(false);
	});

	it("persists in session storage", () => {
		setDebugModeEnabled(true);
		expect(isDebugModeEnabled()).toBe(true);
		setDebugModeEnabled(false);
		expect(isDebugModeEnabled()).toBe(false);
	});

	it("toggleDebugMode flips the flag", () => {
		expect(toggleDebugMode()).toBe(true);
		expect(isDebugModeEnabled()).toBe(true);
		expect(toggleDebugMode()).toBe(false);
		expect(isDebugModeEnabled()).toBe(false);
	});

	it("console D getter toggles debug mode", () => {
		installDebugConsoleToggle();
		const log = vi.spyOn(console, "info").mockImplementation(() => {});

		expect(window.D).toBe(true);
		expect(isDebugModeEnabled()).toBe(true);
		expect(window.D).toBe(false);
		expect(isDebugModeEnabled()).toBe(false);

		log.mockRestore();
	});
});
