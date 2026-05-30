import { evaluateGuess } from "#/game/evaluate";
import { pickMutatedAnswerForSeed } from "#/game/mutated";
import type { LevelConfig } from "#/game/types";
import { MAX_GUESSES, WORD_LENGTH } from "#/game/types";
import { getWordLists } from "#/game/words";

function pickAlmostAnswer(words: string[], seed: number): string {
	const { allowed } = getWordLists();
	return pickMutatedAnswerForSeed(words, seed, allowed);
}

export const level6: LevelConfig = {
	id: 6,
	name: "Almost",
	description:
		"Five letters, six guesses. The answer is one letter off a real word.",
	hint: "Trust the tiles, not the dictionary",
	wordLength: WORD_LENGTH,
	maxGuesses: MAX_GUESSES,
	pickAnswer: pickAlmostAnswer,
	evaluateGuess,
};
