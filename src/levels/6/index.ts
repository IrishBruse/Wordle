import { evaluateGuess } from "#/game/evaluate";
import { isLinearAlphabetRun, pickGibberishForSeed } from "#/game/gibberish";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { getWordLists } from "#/game/words";

function pickInvertedAnswer(_words: string[], seed: number): string {
	const { allowed } = getWordLists();
	return pickGibberishForSeed(seed, WORD_LENGTH, allowed);
}

function isInvertedGuessValid(guess: string, allowed: Set<string>): boolean {
	if (guess.length !== WORD_LENGTH) return false;
	if (allowed.has(guess)) return false;
	if (isLinearAlphabetRun(guess)) return false;
	return true;
}

export const level6: LevelConfig = {
	id: 6,
	name: "Inverted",
	description: "Five letters, six guesses. Real words are not allowed.",
	hint: "If it is in the dictionary, it is wrong",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickInvertedAnswer,
	evaluateGuess,
	isGuessValid: isInvertedGuessValid,
};
