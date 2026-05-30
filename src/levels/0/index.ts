import { evaluateGuess } from "#/game/evaluate";
import { pickAnswerForSeed } from "#/game/seed";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";

export const level0: LevelConfig = {
	id: 0,
	name: "Classic",
	description: "Standard Wordle. Five letters, six guesses.",
	hint: "Green means correct position, yellow means elsewhere in the word, gray means not in the word.",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickAnswerForSeed,
	evaluateGuess,
};
