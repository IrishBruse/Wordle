import { pickAnswerForSeed } from "#/game/seed";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { evaluateGuessInvertedColors } from "./evaluate";

export const level1: LevelConfig = {
	id: 1,
	name: "Double Agent",
	description:
		"Green and yellow are swapped: yellow is exact and green is in the word elsewhere.",
	hint: "Sdrawkcab",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickAnswerForSeed,
	evaluateGuess: evaluateGuessInvertedColors,
};
