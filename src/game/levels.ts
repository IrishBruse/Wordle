import {
	evaluateGuess as classicEvaluate,
	evaluateGuessInvertedColors,
} from "./evaluate";
import { pickAnswerForSeed } from "./seed";
import type { LevelConfig } from "./types";
import { MAX_GUESSES, WORD_LENGTH } from "./types";

export const LEVELS: LevelConfig[] = [
	{
		id: 0,
		name: "Classic",
		description: "Standard Wordle. Five letters, six guesses.",
		hint: "Green means correct position, yellow means elsewhere in the word, gray means not in the word.",
		wordLength: WORD_LENGTH,
		maxGuesses: MAX_GUESSES,
		pickAnswer: pickAnswerForSeed,
		evaluateGuess: classicEvaluate,
	},
	{
		id: 1,
		name: "Double Agent",
		description: "Five letters, six guesses.",
		hint: "Yellow and green are swapped: yellow is correct position, green is in the word but wrong position.",
		wordLength: WORD_LENGTH,
		maxGuesses: MAX_GUESSES,
		pickAnswer: pickAnswerForSeed,
		evaluateGuess: evaluateGuessInvertedColors,
	},
];

export function getTutorialLevel(): LevelConfig {
	return LEVELS[0];
}

export function getNumberedLevels(): LevelConfig[] {
	return LEVELS.filter((level) => level.id > 0);
}

export function getLevel(id: number): LevelConfig | undefined {
	return LEVELS.find((level) => level.id === id);
}

export function getNextLevel(id: number): LevelConfig | undefined {
	return getLevel(id + 1);
}
