// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	clearProgress,
	getLevelCompletion,
	getMaxUnlockedLevel,
	setMaxUnlockedLevel,
} from "#/game/progress";
import { HomeDebugPanel } from "./HomeDebugPanel";

vi.mock("#/game/dev", () => ({
	useDebugMode: () => true,
}));

describe("HomeDebugPanel", () => {
	beforeEach(() => {
		clearProgress();
		setMaxUnlockedLevel(3);
	});

	afterEach(() => {
		cleanup();
		localStorage.clear();
		vi.clearAllMocks();
	});

	it("renders trimmed debug sections when debug mode is on", () => {
		render(<HomeDebugPanel />);

		expect(
			screen.getByRole("complementary", {
				name: /development progress controls/i,
			}),
		).toBeDefined();
		expect(screen.getByText(/seed lookup/i)).toBeDefined();
		expect(screen.getByLabelText(/^seed$/i)).toBeDefined();
		expect(document.getElementById("home-debug-seed-level")).toBeNull();
		const labels = document.querySelectorAll(
			".home-debug-seed-results .home-debug-seed-variant-label",
		);
		expect([...labels].map((el) => el.textContent)).toEqual([
			"0",
			"1",
			"2",
			"3",
			"6",
			"7",
			"8",
		]);
		expect(screen.getByRole("button", { name: /fresh start/i })).toBeDefined();
		expect(
			screen.getByRole("button", { name: /after tutorial/i }),
		).toBeDefined();
		expect(screen.getByRole("button", { name: /unlock all/i })).toBeDefined();
		expect(
			screen.getByRole("group", { name: /unlock through level/i }),
		).toBeDefined();
		expect(
			screen.getByRole("group", { name: /level completion/i }),
		).toBeDefined();
		expect(
			screen.getByRole("button", { name: /reset all debug data/i }),
		).toBeDefined();
		expect(screen.queryByText(/local storage/i)).toBeNull();
		expect(screen.queryByText(/clear progress/i)).toBeNull();
	});

	it("unlocks all levels when Unlock all is clicked", () => {
		render(<HomeDebugPanel />);

		fireEvent.click(screen.getByRole("button", { name: /unlock all/i }));

		expect(getMaxUnlockedLevel()).toBeGreaterThanOrEqual(7);
	});

	it("toggles level completion when a level button is clicked", () => {
		render(<HomeDebugPanel />);

		fireEvent.click(screen.getByRole("button", { name: /level 2 open/i }));

		expect(getLevelCompletion(2)).toBe("clean");
	});

	it("resets all debug data", () => {
		localStorage.setItem("wordle-seed-1", "abcd");
		setMaxUnlockedLevel(5);
		render(<HomeDebugPanel />);

		fireEvent.click(
			screen.getByRole("button", { name: /reset all debug data/i }),
		);

		expect(getMaxUnlockedLevel()).toBe(0);
		expect(localStorage.getItem("wordle-seed-1")).toBeNull();
	});
});
