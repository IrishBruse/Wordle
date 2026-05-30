import { evaluateGuess } from "#/game/evaluate";
import { isLeetGuessValid, pickLeetAnswerForSeed } from "#/game/symbols";
import type { LevelConfig } from "#/game/types";
import { WORD_LENGTH } from "#/game/types";

const MAX_GUESSES = 8;

function pickLeetAnswer(words: string[], seed: number): string {
	return pickLeetAnswerForSeed(words, seed);
}

function isLeetLevelGuessValid(guess: string, allowed: Set<string>): boolean {
	return isLeetGuessValid(guess, allowed);
}

export const level7: LevelConfig = {
	id: 7,
	name: "Symbols",
	description:
		"Five letters, eight guesses. Some letters become symbols (@, !, 0, $).",
	hint: "A is @, I is !, O is 0, S is $. Tap 123 for symbols.",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickLeetAnswer,
	evaluateGuess,
	isGuessValid: isLeetLevelGuessValid,
	symbolsKeyboard: true,
};
