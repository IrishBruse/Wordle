import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { applyBlindDisplay } from "./blind-feedback";
import { applyBlueHerring, pickDecoyColumn } from "./blue-herring";
import { cipherWinWordForScoringAnswer } from "./cipher-shift";
import {
	isRotatedFormOf,
	rotateWordLeft,
	shouldAdvanceConveyor,
} from "./conveyor-belt";
import { mergeLetterStates } from "./evaluate";
import {
	addLetterToGuess,
	buildFullGuess,
	removeLettersFromGuess,
	splitGuessForDisplay,
} from "./hidden-input";
import {
	clearActiveLevelSeed,
	consumeLevelSeed,
	SSR_FALLBACK_SEED,
} from "./seed";
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

function applyVisibleLetters(row: TileData[], visible: string): void {
	for (let i = 0; i < row.length; i++) {
		const char = visible[i];
		if (char) {
			row[i] = { letter: char.toUpperCase(), state: "tbd" };
		} else {
			row[i] = { letter: "", state: "empty" };
		}
	}
}

function guessForRow(row: TileData[], submitted: string | undefined): string {
	if (submitted !== undefined) return submitted;
	return row
		.map((tile) => tile.letter)
		.join("")
		.toLowerCase();
}

function isCompleteGuess(
	length: number,
	displayLength: number,
	maxGuessLength: number,
	hasHiddenInput: boolean,
): boolean {
	if (!hasHiddenInput) return length === maxGuessLength;
	return length === displayLength || length === maxGuessLength;
}

export function useWordleGame(level: LevelConfig) {
	const displayLength = level.wordLength;
	const guessLength = level.guessLength ?? level.wordLength;
	const backspaceStep = level.backspaceStep ?? 1;
	const hasHiddenInput = guessLength > displayLength;
	const hintRowCount = level.cipherShift ? 1 : 0;

	const [allowed] = useState(() => getWordLists().allowed);
	const [answers] = useState(() => getWordLists().answers);
	const [answer, setAnswer] = useState("");
	const [baseAnswer, setBaseAnswer] = useState("");
	const answerRef = useRef(answer);
	const baseAnswerRef = useRef(baseAnswer);
	answerRef.current = answer;
	baseAnswerRef.current = baseAnswer;
	const [seed, setSeed] = useState(SSR_FALLBACK_SEED);
	const [board, setBoard] = useState<TileData[][]>(() =>
		createBoard(level.maxGuesses + hintRowCount, displayLength),
	);
	const [currentRow, setCurrentRow] = useState(0);
	const [status, setStatus] = useState<GameStatus>("playing");
	const [message, setMessage] = useState<GameMessage>({ type: "none" });
	const [revealingRow, setRevealingRow] = useState<number | null>(null);
	const [decoyColumn, setDecoyColumn] = useState<number | null>(null);
	const [overflow, setOverflow] = useState("");
	const overflowRef = useRef(overflow);
	overflowRef.current = overflow;
	const [submittedGuesses, setSubmittedGuesses] = useState<string[]>([]);

	const initGame = useCallback(
		(pool: string[], gameSeed: number) => {
			const secret = level.pickAnswer(pool, gameSeed);
			const winWord = level.cipherShift
				? cipherWinWordForScoringAnswer(secret)
				: secret;
			setAnswer(secret);
			setBaseAnswer(winWord);
			const nextBoard = createBoard(
				level.maxGuesses + hintRowCount,
				displayLength,
			);
			if (level.cipherShift) {
				for (let i = 0; i < displayLength; i++) {
					nextBoard[0][i] = {
						letter: winWord[i]?.toUpperCase() ?? "",
						state: "correct",
					};
				}
			}
			setBoard(nextBoard);
			setCurrentRow(hintRowCount);
			setStatus("playing");
			setMessage({ type: "none" });
			setRevealingRow(null);
			setDecoyColumn(null);
			setOverflow("");
			setSubmittedGuesses([]);
		},
		[displayLength, hintRowCount, level],
	);

	useEffect(() => {
		const gameSeed = consumeLevelSeed(level.id);
		setSeed(gameSeed);
		initGame(answers, gameSeed);
	}, [initGame, answers, level.id]);

	const currentGuess = useMemo(() => {
		if (currentRow >= board.length) return "";
		const visible = board[currentRow]
			.map((tile) => tile.letter)
			.join("")
			.toLowerCase();
		if (!hasHiddenInput) return visible;
		return buildFullGuess(visible, overflow);
	}, [board, currentRow, hasHiddenInput, overflow]);

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

		for (let row = hintRowCount; row < currentRow; row++) {
			const guess = guessForRow(board[row], submittedGuesses[row]);
			if (
				!isCompleteGuess(
					guess.length,
					displayLength,
					guessLength,
					hasHiddenInput,
				)
			) {
				continue;
			}
			const trueScores = level.evaluateGuess(guess, answer);
			for (let i = 0; i < displayLength; i++) {
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
		displayLength,
		guessLength,
		level,
		revealingRow,
		submittedGuesses,
		hasHiddenInput,
		hintRowCount,
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
			if (!hasHiddenInput) {
				setBoard((prev) => {
					const next = prev.map((row) => row.map((tile) => ({ ...tile })));
					const row = next[currentRow];
					const slot = row.findIndex((tile) => tile.letter === "");
					if (slot === -1) return prev;
					row[slot] = { letter: letter.toUpperCase(), state: "tbd" };
					return next;
				});
				return;
			}
			setBoard((prev) => {
				const visible = prev[currentRow]
					.map((tile) => tile.letter)
					.join("")
					.toLowerCase();
				const full = buildFullGuess(visible, overflowRef.current);
				const nextFull = addLetterToGuess(full, letter, guessLength);
				if (!nextFull) return prev;
				const { visible: nextVisible, overflow: nextOverflow } =
					splitGuessForDisplay(nextFull, displayLength);
				overflowRef.current = nextOverflow;
				setOverflow(nextOverflow);
				const next = prev.map((row) => row.map((tile) => ({ ...tile })));
				applyVisibleLetters(next[currentRow], nextVisible);
				return next;
			});
		},
		[
			currentRow,
			displayLength,
			guessLength,
			hasHiddenInput,
			revealingRow,
			status,
		],
	);

	const removeLetter = useCallback(() => {
		if (status !== "playing" || revealingRow !== null) return;
		if (!hasHiddenInput) {
			setBoard((prev) => {
				const next = prev.map((row) => row.map((tile) => ({ ...tile })));
				const row = next[currentRow];
				const slot = [...row].reverse().findIndex((tile) => tile.letter !== "");
				if (slot === -1) return prev;
				const index = row.length - 1 - slot;
				row[index] = { letter: "", state: "empty" };
				return next;
			});
			return;
		}
		setBoard((prev) => {
			const visible = prev[currentRow]
				.map((tile) => tile.letter)
				.join("")
				.toLowerCase();
			const full = buildFullGuess(visible, overflowRef.current);
			if (full.length === 0) return prev;
			const nextFull = removeLettersFromGuess(full, backspaceStep);
			const { visible: nextVisible, overflow: nextOverflow } =
				splitGuessForDisplay(nextFull, displayLength);
			overflowRef.current = nextOverflow;
			setOverflow(nextOverflow);
			const next = prev.map((row) => row.map((tile) => ({ ...tile })));
			applyVisibleLetters(next[currentRow], nextVisible);
			return next;
		});
	}, [
		backspaceStep,
		currentRow,
		displayLength,
		hasHiddenInput,
		revealingRow,
		status,
	]);

	const clearGuess = useCallback(() => {
		if (status !== "playing" || revealingRow !== null) return;
		setBoard((prev) => {
			const row = prev[currentRow];
			const hasVisible = row.some((tile) => tile.letter !== "");
			if (!hasVisible && !overflowRef.current) return prev;
			const next = prev.map((r) => r.map((tile) => ({ ...tile })));
			for (const tile of next[currentRow]) {
				tile.letter = "";
				tile.state = "empty";
			}
			return next;
		});
		if (hasHiddenInput) {
			overflowRef.current = "";
			setOverflow("");
		}
	}, [currentRow, hasHiddenInput, revealingRow, status]);

	const submitGuess = useCallback(() => {
		if (status !== "playing" || revealingRow !== null) return;

		const guess = currentGuess;
		if (guess.length < displayLength) {
			showMessage({ type: "not-enough-letters" });
			return;
		}

		const isValid =
			level.isGuessValid?.(guess, allowed) ??
			(allowed.has(guess) ||
				guess === answer ||
				(level.cipherShift && guess === baseAnswerRef.current) ||
				(level.conveyorBelt &&
					baseAnswerRef.current !== "" &&
					isRotatedFormOf(baseAnswerRef.current, guess)));
		if (!isValid) {
			showMessage({ type: "not-in-list" });
			return;
		}

		const trueScores = level.evaluateGuess(guess, answer);
		const rowIndex = currentRow;

		let column = decoyColumn;
		if (level.blueHerring && column === null && rowIndex === 0) {
			column = pickDecoyColumn(displayLength);
			setDecoyColumn(column);
		}

		const herringLetter =
			column !== null
				? rowIndex === 0
					? guess[column].toUpperCase()
					: (board[0][column]?.letter ?? null)
				: null;

		let displayScores =
			level.blueHerring && column !== null
				? applyBlueHerring(trueScores, guess, column, herringLetter, rowIndex)
				: trueScores;

		const wonOnSubmit =
			level.conveyorBelt || level.cipherShift
				? guess === baseAnswerRef.current
				: guess === answerRef.current;
		const allGreenOnSubmit =
			wonOnSubmit || (level.cipherShift && guess === answerRef.current);
		if (allGreenOnSubmit) {
			displayScores = Array.from(
				{ length: displayLength },
				(): LetterState => "correct",
			);
		} else if (level.blindFeedback) {
			displayScores = applyBlindDisplay(
				displayScores.slice(0, displayLength),
				false,
			);
		} else if (hasHiddenInput) {
			displayScores = displayScores.slice(0, displayLength);
		}

		setRevealingRow(rowIndex);
		setSubmittedGuesses((prev) => {
			const next = [...prev];
			next[rowIndex] = guess;
			return next;
		});
		setOverflow("");
		overflowRef.current = "";
		setBoard((prev) => {
			const next = prev.map((row) => row.map((tile) => ({ ...tile })));
			for (let i = 0; i < displayLength; i++) {
				next[rowIndex][i] = {
					letter: guess[i].toUpperCase(),
					state: displayScores[i],
				};
			}
			return next;
		});

		const revealMs = rowRevealDurationMs(displayLength);
		window.setTimeout(() => {
			setRevealingRow(null);
			const won = wonOnSubmit;
			if (won) {
				setStatus("won");
				showMessage({ type: "won", guesses: rowIndex + 1 });
				return;
			}
			if (rowIndex + 1 >= level.maxGuesses) {
				setStatus("lost");
				showMessage({
					type: "lost",
					answer: hasHiddenInput
						? answerRef.current.slice(0, displayLength)
						: level.conveyorBelt || level.cipherShift
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
		allowed,
		answer,
		board,
		currentGuess,
		currentRow,
		decoyColumn,
		displayLength,
		hasHiddenInput,
		level,
		revealingRow,
		showMessage,
		status,
	]);

	const restart = useCallback(() => {
		if (answers.length === 0) return;
		clearActiveLevelSeed(level.id);
		const gameSeed = consumeLevelSeed(level.id);
		setSeed(gameSeed);
		initGame(answers, gameSeed);
	}, [answers, initGame, level.id]);

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
		answer: level.conveyorBelt || level.cipherShift ? baseAnswer : answer,
	};
}
