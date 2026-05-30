import { evaluateGuess } from "#/game/evaluate";
import { createPickAnswerForLevel } from "#/game/seed";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";

export const level0: LevelConfig = {
	id: 0,
	name: "Classic",
	description:
		"Standard Wordle scoring: green is exact, yellow is in the word, gray is out.",
	hint: "Skill issue",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: createPickAnswerForLevel(0),
	evaluateGuess,
};
