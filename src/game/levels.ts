import {
	evaluateGuess as classicEvaluate,
	evaluateGuessInvertedColors,
} from "./evaluate";
import type { LevelConfig } from "./types";
import { MAX_GUESSES, WORD_LENGTH } from "./types";

function pickRandom(words: string[]): string {
	const index = Math.floor(Math.random() * words.length);
	return words[index] ?? "crane";
}

export const LEVELS: LevelConfig[] = [
	{
		id: 1,
		name: "Classic",
		description: "Standard Wordle. Five letters, six guesses.",
		wordLength: WORD_LENGTH,
		maxGuesses: MAX_GUESSES,
		pickAnswer: pickRandom,
		evaluateGuess: classicEvaluate,
	},
	{
		id: 2,
		name: "Double Agent",
		description: "Five letters, six guesses.",
		wordLength: WORD_LENGTH,
		maxGuesses: MAX_GUESSES,
		pickAnswer: pickRandom,
		evaluateGuess: evaluateGuessInvertedColors,
	},
];

export function getLevel(id: number): LevelConfig | undefined {
	return LEVELS.find((level) => level.id === id);
}

export function getNextLevel(id: number): LevelConfig | undefined {
	return getLevel(id + 1);
}
