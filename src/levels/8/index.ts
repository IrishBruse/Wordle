import { pickCipherScoringAnswer } from "#/game/cipher-shift";
import { evaluateGuess } from "#/game/evaluate";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";

export const level8: LevelConfig = {
	id: 8,
	name: "Off by One",
	description:
		"A green word on the board lies: yellow and green hints follow its letters shifted by one. Win with the real word.",
	hint: "The tiles tell the truth about the wrong word",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickCipherScoringAnswer,
	evaluateGuess,
	cipherShift: true,
};
