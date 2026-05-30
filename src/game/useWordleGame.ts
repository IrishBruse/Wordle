import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { applyBlueHerring, pickDecoyColumn } from "./blue-herring";
import {
	rotateWordLeft,
	shouldAdvanceConveyor,
} from "./conveyor-belt";
import { mergeLetterStates } from "./evaluate";
import { getOrCreateLevelSeed, rollLevelSeed, SSR_FALLBACK_SEED } from "./seed";
import { rowRevealDurationMs } from "./timing";
import type {
	GameMessage,
	GameStatus,
	LetterState,
	LevelConfig,
	TileData,
} from "./types";
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
	const [baseAnswer, setBaseAnswer] = useState("");
	const answerRef = useRef(answer);
	const baseAnswerRef = useRef(baseAnswer);
	answerRef.current = answer;
	baseAnswerRef.current = baseAnswer;
	const [seed, setSeed] = useState(SSR_FALLBACK_SEED);
	const [board, setBoard] = useState<TileData[][]>(() =>
		createBoard(level.maxGuesses, level.wordLength),
	);
	const [currentRow, setCurrentRow] = useState(0);
	const [status, setStatus] = useState<GameStatus>("playing");
	const [message, setMessage] = useState<GameMessage>({ type: "none" });
	const [revealingRow, setRevealingRow] = useState<number | null>(null);
	const [decoyColumn, setDecoyColumn] = useState<number | null>(null);

	const initGame = useCallback(
		(pool: string[], gameSeed: number) => {
			const secret = level.pickAnswer(pool, gameSeed);
			setAnswer(secret);
			setBaseAnswer(secret);
			setBoard(createBoard(level.maxGuesses, level.wordLength));
			setCurrentRow(0);
			setStatus("playing");
			setMessage({ type: "none" });
			setRevealingRow(null);
			setDecoyColumn(null);
		},
		[level],
	);

	useEffect(() => {
		const gameSeed = getOrCreateLevelSeed(level.id);
		setSeed(gameSeed);
		initGame(answers, gameSeed);
	}, [initGame, answers, level.id]);

	const currentGuess = useMemo(() => {
		if (currentRow >= board.length) return "";
		return board[currentRow]
			.map((tile) => tile.letter)
			.join("")
			.toLowerCase();
	}, [board, currentRow]);

	const decoyLetter = useMemo(() => {
		if (decoyColumn === null) return null;
		return board[0][decoyColumn]?.letter ?? null;
	}, [board, decoyColumn]);

	const keyboardState = useMemo(() => {
		const map = new Map<string, LetterState>();
		const includeDecoyOnKeyboard =
			decoyLetter !== null &&
			revealingRow !== 0 &&
			board[0].every(
				(tile) =>
					tile.letter !== "" && tile.state !== "empty" && tile.state !== "tbd",
			);

		for (let row = 0; row < currentRow; row++) {
			const guess = board[row]
				.map((tile) => tile.letter)
				.join("")
				.toLowerCase();
			if (guess.length !== level.wordLength) continue;
			const trueScores = level.evaluateGuess(guess, answer);
			for (let i = 0; i < level.wordLength; i++) {
				const letter = board[row][i].letter;
				if (!letter) continue;
				const key = letter.toUpperCase();
				let state = board[row][i].state;
				if (
					level.blueHerring &&
					decoyColumn !== null &&
					decoyLetter &&
					i === decoyColumn &&
					key !== decoyLetter
				) {
					state = trueScores[i];
				}
				map.set(key, mergeLetterStates(map.get(key), state));
			}
		}
		if (includeDecoyOnKeyboard) {
			map.set(decoyLetter, mergeLetterStates(map.get(decoyLetter), "decoy"));
		}
		return map;
	}, [
		answer,
		board,
		currentRow,
		decoyColumn,
		decoyLetter,
		level,
		revealingRow,
	]);

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

	const clearGuess = useCallback(() => {
		if (status !== "playing" || revealingRow !== null) return;
		setBoard((prev) => {
			const row = prev[currentRow];
			if (!row.some((tile) => tile.letter !== "")) return prev;
			const next = prev.map((r) => r.map((tile) => ({ ...tile })));
			for (const tile of next[currentRow]) {
				tile.letter = "";
				tile.state = "empty";
			}
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

		const trueScores = level.evaluateGuess(guess, answer);
		const rowIndex = currentRow;

		let column = decoyColumn;
		if (level.blueHerring && column === null && rowIndex === 0) {
			column = pickDecoyColumn(level.wordLength);
			setDecoyColumn(column);
		}

		const herringLetter =
			column !== null
				? rowIndex === 0
					? guess[column].toUpperCase()
					: (board[0][column]?.letter ?? null)
				: null;

		const displayScores =
			level.blueHerring && column !== null
				? applyBlueHerring(
						trueScores,
						guess,
						column,
						herringLetter,
						rowIndex,
					)
				: trueScores;

		setRevealingRow(rowIndex);
		setBoard((prev) => {
			const next = prev.map((row) => row.map((tile) => ({ ...tile })));
			for (let i = 0; i < level.wordLength; i++) {
				next[rowIndex][i] = {
					letter: guess[i].toUpperCase(),
					state: displayScores[i],
				};
			}
			return next;
		});

		const revealMs = rowRevealDurationMs(level.wordLength);
		window.setTimeout(() => {
			setRevealingRow(null);
			const won = level.conveyorBelt
				? guess === baseAnswerRef.current
				: guess === answerRef.current;
			if (won) {
				setStatus("won");
				showMessage({ type: "won", guesses: rowIndex + 1 });
				return;
			}
			if (rowIndex + 1 >= level.maxGuesses) {
				setStatus("lost");
				setSeed(rollLevelSeed(level.id));
				showMessage({
					type: "lost",
					answer: level.conveyorBelt
						? baseAnswerRef.current
						: answerRef.current,
				});
				return;
			}
			if (level.conveyorBelt && shouldAdvanceConveyor(trueScores)) {
				setAnswer((current) => rotateWordLeft(current));
			}
			setCurrentRow(rowIndex + 1);
		}, revealMs);
	}, [
		answer,
		allowed,
		board,
		currentGuess,
		currentRow,
		decoyColumn,
		level,
		revealingRow,
		showMessage,
		status,
	]);

	const restart = useCallback(() => {
		if (answers.length === 0) return;
		const gameSeed = status === "lost" ? seed : rollLevelSeed(level.id);
		if (status !== "lost") setSeed(gameSeed);
		initGame(answers, gameSeed);
	}, [answers, initGame, level.id, seed, status]);

	return {
		board,
		currentRow,
		status,
		message,
		revealingRow,
		keyboardState,
		seed,
		addLetter,
		removeLetter,
		clearGuess,
		submitGuess,
		restart,
		answer: level.conveyorBelt ? baseAnswer : answer,
	};
}
