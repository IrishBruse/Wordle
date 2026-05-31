import { createPickAnswerForLevel } from "./seed";

const A_CODE = "a".charCodeAt(0);

/** Shift each letter forward by `amount` (A -> B, Z -> A). */
export function shiftWordForward(word: string, amount = 1): string {
	return shiftWord(word, amount);
}

/** Shift each letter backward by `amount` (B -> A, A -> Z). */
export function shiftWordBackward(word: string, amount = 1): string {
	return shiftWord(word, -amount);
}

function shiftWord(word: string, amount: number): string {
	const normalized = ((amount % 26) + 26) % 26;
	if (normalized === 0) return word;
	let out = "";
	for (const char of word.toLowerCase()) {
		if (char < "a" || char > "z") {
			out += char;
			continue;
		}
		const index = char.charCodeAt(0) - A_CODE;
		const shifted = (index + normalized + 26) % 26;
		out += String.fromCharCode(A_CODE + shifted);
	}
	return out;
}

/** Level 8: seeded dictionary word shifted +1 for scoring; win word is the unshifted form. */
export function pickCipherScoringAnswer(words: string[], seed: number): string {
	const win = createPickAnswerForLevel(8)(words, seed);
	return shiftWordForward(win);
}

export function cipherWinWordForScoringAnswer(scoringAnswer: string): string {
	return shiftWordBackward(scoringAnswer);
}

export function formatCipherAnswers(win: string, scoring: string): string {
	return `${win.toUpperCase()} | ${scoring.toUpperCase()}`;
}
