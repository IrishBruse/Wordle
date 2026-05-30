import { evaluateGuess } from "#/game/evaluate";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";

/** Same secret for every player and seed. */
export const HARDCODED_ANSWER = "shart";

function pickHardcodedAnswer(_words: string[], _seed: number): string {
	return HARDCODED_ANSWER;
}

export const level4: LevelConfig = {
	id: 4,
	name: "Hardcoded",
	description: "Five letters, six guesses. No color hints until you win.",
	hint: "Robot Game",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickHardcodedAnswer,
	evaluateGuess,
	blindFeedback: true,
};
