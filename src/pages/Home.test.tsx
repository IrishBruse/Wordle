// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	clearProgress,
	getLevelCompletion,
	setMaxUnlockedLevel,
} from "#/game/progress";
import { Home } from "./Home";

vi.mock("#/game/dev", () => ({
	useDebugMode: () => true,
}));

describe("Home debug shortcuts", () => {
	beforeEach(() => {
		clearProgress();
		setMaxUnlockedLevel(7);
	});

	afterEach(() => {
		cleanup();
		localStorage.clear();
	});

	it("shift-clicks a level box to mark it complete in debug mode", () => {
		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>,
		);

		const levelLink = screen.getByRole("link", { name: /^puzzle 2$/i });
		fireEvent.click(levelLink, { shiftKey: true });

		expect(getLevelCompletion(2)).toBe("clean");
		expect(levelLink.className).toContain("level-box-complete");
	});

	it("does not mark complete on a normal click", () => {
		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>,
		);

		const levelLink = screen.getByRole("link", { name: /^puzzle 3$/i });
		fireEvent.click(levelLink);

		expect(getLevelCompletion(3)).toBeNull();
	});
});
