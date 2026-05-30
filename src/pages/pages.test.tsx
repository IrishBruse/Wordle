// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { clearProgress, setMaxUnlockedLevel } from "#/game/progress";

describe("page module exports", () => {
	it("exports HomeDebugPanel as a named export", async () => {
		const mod = await import("#/components/wordle/HomeDebugPanel");
		expect(mod.HomeDebugPanel).toBeTypeOf("function");
	});

	it("exports page components used by the router", async () => {
		const home = await import("#/pages/Home");
		const playLevel = await import("#/pages/PlayLevel");
		const playTutorial = await import("#/pages/PlayTutorial");
		const app = await import("#/App");

		expect(home.Home).toBeTypeOf("function");
		expect(playLevel.PlayLevel).toBeTypeOf("function");
		expect(playTutorial.PlayTutorial).toBeTypeOf("function");
		expect(app.App).toBeTypeOf("function");
	});

	it("exports Game for play routes", async () => {
		const mod = await import("#/components/wordle/Game");
		expect(mod.Game).toBeTypeOf("function");
	});
});

describe("page smoke", () => {
	beforeEach(() => {
		clearProgress();
		setMaxUnlockedLevel(7);
	});

	afterEach(() => {
		cleanup();
		localStorage.clear();
	});

	it("renders Home without crashing", async () => {
		const { Home } = await import("#/pages/Home");
		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>,
		);
		expect(document.querySelector(".home-title")).not.toBeNull();
	});

	it("renders PlayTutorial without crashing", async () => {
		const { PlayTutorial } = await import("#/pages/PlayTutorial");
		render(
			<MemoryRouter>
				<PlayTutorial />
			</MemoryRouter>,
		);
		expect(screen.getByRole("button", { name: /show hint/i })).toBeDefined();
	});

	it("renders PlayLevel for an unlocked level", async () => {
		const { PlayLevel } = await import("#/pages/PlayLevel");
		render(
			<MemoryRouter initialEntries={["/play/1"]}>
				<Routes>
					<Route path="/play/:levelId" element={<PlayLevel />} />
				</Routes>
			</MemoryRouter>,
		);
		expect(screen.getByRole("button", { name: /show hint/i })).toBeDefined();
	});

	it("renders PlayLevel for a missing level", async () => {
		const { PlayLevel } = await import("#/pages/PlayLevel");
		render(
			<MemoryRouter initialEntries={["/play/999"]}>
				<Routes>
					<Route path="/play/:levelId" element={<PlayLevel />} />
				</Routes>
			</MemoryRouter>,
		);
		expect(screen.getByText(/does not exist/i)).toBeDefined();
	});

	it("renders App routes without crashing", async () => {
		const { App } = await import("#/App");
		render(<App />);
		expect(document.querySelector(".home-title")).not.toBeNull();
	});
});
