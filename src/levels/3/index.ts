import { evaluateGuess } from "#/game/evaluate";
import { pickAnswerForSeed } from "#/game/seed";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";

export const level3: LevelConfig = {
	id: 3,
	name: "Conveyor Belt",
	description:
		"Each guess with a green letter shifts the hidden word one position to the left.",
	hint: "The goalposts keep moving",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickAnswerForSeed,
	evaluateGuess,
	conveyorBelt: true,
};
