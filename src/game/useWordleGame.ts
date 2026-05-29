import { useCallback, useEffect, useMemo, useState } from "react";
import { mergeLetterStates } from "./evaluate";
import type {
	GameMessage,
	GameStatus,
	LetterState,
	LevelConfig,
	TileData,
} from "./types";
import { rowRevealDurationMs } from "./timing";
import { getWordLists } from "./words";

function emptyRow(length: number): TileData[] {
	return Array.from({ length }, () => ({ letter: "", state: "empty" }));
}

function createBoard(rows: number, cols: number): TileData[][] {
	return Array.from({ length: rows }, () => emptyRow(cols));
}

const { allowed: ALLOWED_WORDS, answers: ANSWER_POOL } = getWordLists();

export function useWordleGame(level: LevelConfig) {
	const [allowed] = useState(() => ALLOWED_WORDS);
	const [answers] = useState(() => ANSWER_POOL);
	const [answer, setAnswer] = useState("");
	const [board, setBoard] = useState<TileData[][]>(() =>
		createBoard(level.maxGuesses, level.wordLength),
	);
	const [currentRow, setCurrentRow] = useState(0);
	const [status, setStatus] = useState<GameStatus>("playing");
	const [message, setMessage] = useState<GameMessage>({ type: "none" });
	const [revealingRow, setRevealingRow] = useState<number | null>(null);

	const initGame = useCallback(
		(pool: string[]) => {
			const secret = level.pickAnswer(pool);
			setAnswer(secret);
			setBoard(createBoard(level.maxGuesses, level.wordLength));
			setCurrentRow(0);
			setStatus("playing");
			setMessage({ type: "none" });
			setRevealingRow(null);
		},
		[level],
	);

	useEffect(() => {
		initGame(answers);
	}, [initGame, answers]);

	const currentGuess = useMemo(() => {
		if (currentRow >= board.length) return "";
		return board[currentRow]
			.map((tile) => tile.letter)
			.join("")
			.toLowerCase();
	}, [board, currentRow]);

	const keyboardState = useMemo(() => {
		const map = new Map<string, LetterState>();
		for (let row = 0; row < currentRow; row++) {
			const tiles = board[row];
			for (const tile of tiles) {
				if (!tile.letter) continue;
				const key = tile.letter.toUpperCase();
				map.set(key, mergeLetterStates(map.get(key), tile.state));
			}
		}
		return map;
	}, [board, currentRow]);

	const showMessage = useCallback((next: GameMessage) => {
		setMessage(next);
		if (next.type === "none") return;
		const id = window.setTimeout(() => setMessage({ type: "none" }), 1600);
		return () => window.clearTimeout(id);
	}, []);

	const addLetter = useCallback(
		(letter: string) => {
			if (status !== "playing" || revealingRow !== null) return;
			setBoard((prev) => {
				const next = prev.map((row) => row.map((tile) => ({ ...tile })));
				const row = next[currentRow];
				const slot = row.findIndex((tile) => tile.letter === "");
				if (slot === -1) return prev;
				row[slot] = { letter: letter.toUpperCase(), state: "tbd" };
				return next;
			});
		},
		[currentRow, revealingRow, status],
	);

	const removeLetter = useCallback(() => {
		if (status !== "playing" || revealingRow !== null) return;
		setBoard((prev) => {
			const next = prev.map((row) => row.map((tile) => ({ ...tile })));
			const row = next[currentRow];
			const slot = [...row].reverse().findIndex((tile) => tile.letter !== "");
			if (slot === -1) return prev;
			const index = row.length - 1 - slot;
			row[index] = { letter: "", state: "empty" };
			return next;
		});
	}, [currentRow, revealingRow, status]);

	const submitGuess = useCallback(() => {
		if (status !== "playing" || revealingRow !== null) return;

		const guess = currentGuess;
		if (guess.length < level.wordLength) {
			showMessage({ type: "not-enough-letters" });
			return;
		}

		const isValid = level.isGuessValid?.(guess, allowed) ?? allowed.has(guess);
		if (!isValid) {
			showMessage({ type: "not-in-list" });
			return;
		}

		const scores = level.evaluateGuess(guess, answer);
		const rowIndex = currentRow;

		setRevealingRow(rowIndex);
		setBoard((prev) => {
			const next = prev.map((row) => row.map((tile) => ({ ...tile })));
			for (let i = 0; i < level.wordLength; i++) {
				next[rowIndex][i] = {
					letter: guess[i].toUpperCase(),
					state: scores[i],
				};
			}
			return next;
		});

		const revealMs = rowRevealDurationMs(level.wordLength);
		window.setTimeout(() => {
			setRevealingRow(null);
			const won = guess === answer;
			if (won) {
				setStatus("won");
				showMessage({ type: "won", guesses: rowIndex + 1 });
				return;
			}
			if (rowIndex + 1 >= level.maxGuesses) {
				setStatus("lost");
				showMessage({ type: "lost", answer });
				return;
			}
			setCurrentRow(rowIndex + 1);
		}, revealMs);
	}, [
		answer,
		allowed,
		currentGuess,
		currentRow,
		level,
		revealingRow,
		showMessage,
		status,
	]);

	const restart = useCallback(() => {
		if (answers.length === 0) return;
		initGame(answers);
	}, [answers, initGame]);

	return {
		board,
		currentRow,
		status,
		message,
		revealingRow,
		keyboardState,
		addLetter,
		removeLetter,
		submitGuess,
		restart,
		answer,
	};
}
