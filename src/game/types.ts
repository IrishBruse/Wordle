export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export type LetterState = "empty" | "tbd" | "correct" | "present" | "absent";

export type GameStatus = "playing" | "won" | "lost";

export type TileData = {
	letter: string;
	state: LetterState;
};

export type LevelId = number;

/** Base config every level shares; extend per-mode later. */
export type LevelConfig = {
	id: LevelId;
	name: string;
	description: string;
	/** Shown when the player reveals the hint for this level. */
	hint: string;
	wordLength: number;
	maxGuesses: number;
	/** Pick the secret word for this run. Override per level. */
	pickAnswer: (words: string[], seed: number) => string;
	/** Score a guess against the answer. Override for variant rules later. */
	evaluateGuess: (guess: string, answer: string) => LetterState[];
	/** Optional filter on whether a guess is allowed. */
	isGuessValid?: (guess: string, allowedWords: Set<string>) => boolean;
};

export type GameMessage =
	| { type: "none" }
	| { type: "not-enough-letters" }
	| { type: "not-in-list" }
	| { type: "won"; guesses: number }
	| { type: "lost"; answer: string };
