import { describe, expect, it } from "vitest";
import { evaluateGuess } from "#/game/evaluate";
import { simulatePlaythrough } from "#/game/simulate-level";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { level2 } from "./index";

describe("level 2: The Blue Herring", () => {
	it("uses standard colors with blue herring enabled", () => {
		expect(level2.id).toBe(2);
		expect(level2.wordLength).toBe(WORD_LENGTH);
		expect(level2.maxGuesses).toBe(MAX_GUESSES);
		expect(level2.blueHerring).toBe(true);
	});

	it("matches standard scoring when decoy is not applied", () => {
		expect(level2.evaluateGuess("crane", "crane")).toEqual(
			evaluateGuess("crane", "crane"),
		);
	});

	it("locks the herring letter from the first guess onward", () => {
		const answer = "crane";
		const decoyColumn = 2;
		const rows = simulatePlaythrough(level2, answer, ["stone", "crane"], {
			fixedDecoyColumn: decoyColumn,
		});
		expect(rows[0][decoyColumn]).toBe("decoy");
		expect(rows[1][decoyColumn]).toBe("correct");
	});

	it("does not decoy a different letter in the herring column", () => {
		const answer = "waver";
		const decoyColumn = 3;
		const rows = simulatePlaythrough(level2, answer, ["waver", "audio"], {
			fixedDecoyColumn: decoyColumn,
		});
		expect(rows[0][decoyColumn]).toBe("decoy");
		expect(rows[1][decoyColumn]).toBe("absent");
	});

	it("always shows the herring letter as decoy on every row", () => {
		const answer = "waver";
		const decoyColumn = 0;
		const rows = simulatePlaythrough(
			level2,
			answer,
			["waver", "audio", "lower"],
			{ fixedDecoyColumn: decoyColumn },
		);
		expect(rows[0][0]).toBe("decoy");
		expect(rows[2][2]).toBe("decoy");
	});

	it("overrides a would-be correct letter in the decoy column", () => {
		const answer = "crane";
		const decoyColumn = 0;
		const rows = simulatePlaythrough(level2, answer, [answer], {
			fixedDecoyColumn: decoyColumn,
		});
		expect(evaluateGuess(answer, answer)[decoyColumn]).toBe("correct");
		expect(rows[0][decoyColumn]).toBe("decoy");
	});

	it("leaves non-decoy columns on standard scoring", () => {
		const answer = "crane";
		const decoyColumn = 2;
		const rows = simulatePlaythrough(level2, answer, ["crane"], {
			fixedDecoyColumn: decoyColumn,
		});
		expect(rows[0][0]).toBe("correct");
		expect(rows[0][1]).toBe("correct");
		expect(rows[0][3]).toBe("correct");
		expect(rows[0][4]).toBe("correct");
	});
});
