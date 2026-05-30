import { describe, expect, it } from "vitest";
import {
	ROW_REVEAL_BUFFER_MS,
	rowRevealDurationMs,
	TILE_FLIP_MS,
	TILE_FLIP_STAGGER_MS,
} from "./timing";

describe("rowRevealDurationMs", () => {
	it("unlocks after the last tile finishes its flip", () => {
		const wordLength = 5;
		const expected =
			(wordLength - 1) * TILE_FLIP_STAGGER_MS +
			TILE_FLIP_MS +
			ROW_REVEAL_BUFFER_MS;
		expect(rowRevealDurationMs(wordLength)).toBe(expected);
	});
});
