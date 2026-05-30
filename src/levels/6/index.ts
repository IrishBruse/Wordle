import { evaluateGuess } from "#/game/evaluate";
import { pickAlmostAnswerForSeed } from "#/game/mutated";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";

export const level6: LevelConfig = {
	id: 6,
	name: "Almost",
	description:
		"The answer is one letter off a real word, is not in the dictionary, but can be submitted.",
	hint: "Trust the tiles, not the dictionary",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickAlmostAnswerForSeed,
	evaluateGuess,
};
