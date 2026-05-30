import { evaluateGuess } from "#/game/evaluate";
import { pickAnswerForSeed } from "#/game/seed";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";

export const level2: LevelConfig = {
	id: 2,
	name: "The Blue Herring",
	description: "Five letters, six guesses.",
	hint: "I'm blue, da-ba-dee, da-ba-di",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickAnswerForSeed,
	evaluateGuess,
	blueHerring: true,
};
