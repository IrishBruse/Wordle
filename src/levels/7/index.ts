import { evaluateGuess } from "#/game/evaluate";
import { isSymbolOnlyString, pickSymbolsForSeed } from "#/game/symbols";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";

function pickSymbolAnswer(_words: string[], seed: number): string {
	return pickSymbolsForSeed(seed, WORD_LENGTH);
}

function isSymbolGuessValid(guess: string, _allowed: Set<string>): boolean {
	return guess.length === WORD_LENGTH && isSymbolOnlyString(guess);
}

export const level7: LevelConfig = {
	id: 7,
	name: "Symbols",
	description: "Five symbols, six guesses. Use the 123 keyboard.",
	hint: "Tap 123 for numbers and punctuation",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickSymbolAnswer,
	evaluateGuess,
	isGuessValid: isSymbolGuessValid,
	symbolsKeyboard: true,
};
