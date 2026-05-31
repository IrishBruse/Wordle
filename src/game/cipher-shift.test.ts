import { describe, expect, it } from "vitest";
import {
	cipherWinWordForScoringAnswer,
	formatCipherAnswers,
	pickCipherScoringAnswer,
	shiftWordBackward,
	shiftWordForward,
} from "./cipher-shift";
import { pickAnswerForLevel } from "./seed";
import { getWordLists } from "./words";

describe("shiftWordForward", () => {
	it("shifts each letter by one with wrap", () => {
		expect(shiftWordForward("waver")).toBe("xbwfs");
		expect(shiftWordForward("xyz")).toBe("yza");
	});
});

describe("shiftWordBackward", () => {
	it("undoes a forward shift", () => {
		expect(shiftWordBackward("xbwfs")).toBe("waver");
		expect(shiftWordBackward(shiftWordForward("crane"))).toBe("crane");
	});
});

describe("pickCipherScoringAnswer", () => {
	const { answers } = getWordLists();

	it("returns the seeded answer shifted forward by one", () => {
		const win = pickAnswerForLevel(answers, 42, 8);
		expect(pickCipherScoringAnswer(answers, 42)).toBe(shiftWordForward(win));
	});

	it("is stable for the same seed", () => {
		expect(pickCipherScoringAnswer(answers, 7)).toBe(
			pickCipherScoringAnswer(answers, 7),
		);
	});
});

describe("cipherWinWordForScoringAnswer", () => {
	it("recovers the dictionary word", () => {
		expect(cipherWinWordForScoringAnswer("xbwfs")).toBe("waver");
	});
});

describe("formatCipherAnswers", () => {
	it("shows win word then scoring word", () => {
		expect(formatCipherAnswers("waver", "xbwfs")).toBe("WAVER | XBWFS");
	});
});
