import { evaluateGuess } from "#/game/evaluate";
import { pickAnswerForSeed } from "#/game/seed";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";

export const level2: LevelConfig = {
	id: 2,
	name: "The Blue Herring",
	description:
		"After your first guess, one random letter stays blue on every tile and key.",
	hint: "I'm blue, da-ba-dee, da-ba-di",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickAnswerForSeed,
	evaluateGuess,
	blueHerring: true,
};
