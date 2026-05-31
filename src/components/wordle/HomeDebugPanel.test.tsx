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
		expect(screen.getByLabelText(/unlock preset/i)).toBeDefined();
		expect(screen.getByRole("button", { name: /apply preset/i })).toBeDefined();
		expect(
			document.getElementById("home-debug-completion-level"),
		).not.toBeNull();
		expect(screen.getByLabelText(/^status$/i)).toBeDefined();
		expect(
			screen.getByRole("button", { name: /apply completion/i }),
		).toBeDefined();
		expect(
			screen.getByRole("button", { name: /reset all debug data/i }),
		).toBeDefined();
		expect(screen.queryByText(/local storage/i)).toBeNull();
		expect(screen.queryByText(/clear progress/i)).toBeNull();
	});

	it("applies unlock preset when Apply preset is clicked", () => {
		render(<HomeDebugPanel />);

		fireEvent.change(screen.getByLabelText(/unlock preset/i), {
			target: { value: "unlock-all" },
		});
		fireEvent.click(screen.getByRole("button", { name: /apply preset/i }));

		expect(getMaxUnlockedLevel()).toBeGreaterThanOrEqual(7);
	});

	it("applies level completion when Apply completion is clicked", () => {
		render(<HomeDebugPanel />);

		const levelSelects = screen.getAllByLabelText(/^level$/i);
		const completionLevel = levelSelects.find(
			(select) => select.id === "home-debug-completion-level",
		);
		expect(completionLevel).toBeDefined();
		fireEvent.change(completionLevel as HTMLSelectElement, {
			target: { value: "2" },
		});
		fireEvent.change(screen.getByLabelText(/^status$/i), {
			target: { value: "complete" },
		});
		fireEvent.click(screen.getByRole("button", { name: /apply completion/i }));

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
