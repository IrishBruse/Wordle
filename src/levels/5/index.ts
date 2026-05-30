import { evaluateGuess } from "#/game/evaluate";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";

export const HARDCODED_ANSWER = "wordle";

const GUESS_LENGTH = 6;

function pickHardcodedAnswer(_words: string[], _seed: number): string {
	return HARDCODED_ANSWER;
}

function evaluatePhantomGuess(guess: string, answer: string): LetterState[] {
	const scores = evaluateGuess(guess, answer);
	return scores.slice(0, guess.length);
}

function isPhantomGuessValid(guess: string, allowed: Set<string>): boolean {
	if (guess.length === WORD_LENGTH) return allowed.has(guess);
	if (guess.length === GUESS_LENGTH) return guess === HARDCODED_ANSWER;
	return false;
}

export const level5: LevelConfig = {
	id: 5,
	name: "Phantom",
	description: "Five letters, six guesses.",
	hint: "The name of the game",
	wordLength: WORD_LENGTH,
	guessLength: GUESS_LENGTH,
	backspaceStep: 2,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickHardcodedAnswer,
	evaluateGuess: evaluatePhantomGuess,
	isGuessValid: isPhantomGuessValid,
};
