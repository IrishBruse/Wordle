import { pickAnswerForSeed } from "#/game/seed";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { evaluateGuessInvertedColors } from "./evaluate";

export const level1: LevelConfig = {
	id: 1,
	name: "Double Agent",
	description: "Five letters, six guesses.",
	hint: "Yellow and green are swapped: yellow is correct position, green is in the word but wrong position.",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickAnswerForSeed,
	evaluateGuess: evaluateGuessInvertedColors,
};
