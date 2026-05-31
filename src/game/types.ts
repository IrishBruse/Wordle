export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

export type LetterState =
	| "empty"
	| "tbd"
	| "correct"
	| "present"
	| "absent"
	| "decoy";

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
	/** Letters required to submit; defaults to wordLength. May exceed wordLength when extra input is hidden. */
	guessLength?: number;
	/** Internal letters removed per backspace; defaults to 1. */
	backspaceStep?: number;
	maxGuesses: number;
	/** Pick the secret word for this run. Override per level. */
	pickAnswer: (words: string[], seed: number) => string;
	/** Score a guess against the answer. Override for variant rules later. */
	evaluateGuess: (guess: string, answer: string) => LetterState[];
	/** Optional filter on whether a guess is allowed. */
	isGuessValid?: (guess: string, allowedWords: Set<string>) => boolean;
	/** First guess picks a herring letter (from one column) that stays blue every row. */
	blueHerring?: boolean;
	/** Scoring target rotates left after greens; win when the original word is guessed. */
	conveyorBelt?: boolean;
	/** Tiles and keyboard stay gray until the winning guess (all green). */
	blindFeedback?: boolean;
	/** Show 123 / ABC toggle with numbers and punctuation keys. */
	symbolsKeyboard?: boolean;
	/** Scoring uses a +1 shifted answer; a green hint row shows the real word; win on the unshifted word. */
	cipherShift?: boolean;
};

export type GameMessage =
	| { type: "none" }
	| { type: "not-enough-letters" }
	| { type: "not-in-list" }
	| { type: "won"; guesses: number }
	| { type: "lost"; answer: string };
