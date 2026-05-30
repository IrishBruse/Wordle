import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { markLevelWon, unlockLevel } from "#/game/progress";
import { encodeSeed } from "#/game/seed";
import { isAllowedLeetKey } from "#/game/symbols";
import type { LevelConfig } from "#/game/types";
import { useIsLevelUnlocked } from "#/game/useProgress";
import { useWordleGame } from "#/game/useWordleGame";
import { getNextLevel } from "#/levels";
import { Board } from "./Board";
import { DevAnswerBanner } from "./DevAnswerBanner";
import { Keyboard } from "./Keyboard";
import { Message } from "./Message";

type GameProps = {
	level: LevelConfig;
};

export function Game({ level }: GameProps) {
	const {
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
		answer,
	} = useWordleGame(level);

	const [shakeRow, setShakeRow] = useState<number | null>(null);
	const [hintRevealed, setHintRevealed] = useState(false);
	const unlockedNextRef = useRef(false);
	const recordedWinRef = useRef(false);
	const nextLevel = getNextLevel(level.id);
	const nextLevelUnlocked = useIsLevelUnlocked(nextLevel?.id ?? -1);

	// biome-ignore lint/correctness/useExhaustiveDependencies: reset hint when switching levels
	useEffect(() => {
		setHintRevealed(false);
	}, [level.id]);

	useEffect(() => {
		if (status !== "won") {
			unlockedNextRef.current = false;
			recordedWinRef.current = false;
			return;
		}
		if (!recordedWinRef.current) {
			recordedWinRef.current = true;
			markLevelWon(level.id);
		}
		if (unlockedNextRef.current || !nextLevel) return;
		unlockedNextRef.current = true;
		unlockLevel(nextLevel.id);
	}, [status, nextLevel, level.id]);

	useEffect(() => {
		if (
			message.type !== "not-enough-letters" &&
			message.type !== "not-in-list"
		) {
			return;
		}
		setShakeRow(currentRow);
		const id = window.setTimeout(() => setShakeRow(null), 600);
		return () => window.clearTimeout(id);
	}, [message, currentRow]);

	const handleKey = useCallback(
		(key: string) => {
			if (key === "ENTER") {
				submitGuess();
				return;
			}
			if (key === "BACK") {
				removeLetter();
				return;
			}
			addLetter(key);
		},
		[addLetter, removeLetter, submitGuess],
	);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (
				event.key === "Backspace" &&
				(event.ctrlKey || event.metaKey) &&
				!event.altKey
			) {
				event.preventDefault();
				clearGuess();
				return;
			}
			if (event.ctrlKey || event.metaKey || event.altKey) return;
			const key = event.key;
			if (key === "Enter") {
				event.preventDefault();
				handleKey("ENTER");
				return;
			}
			if (key === "Backspace") {
				event.preventDefault();
				handleKey("BACK");
				return;
			}
			if (level.symbolsKeyboard && isAllowedLeetKey(key)) {
				event.preventDefault();
				handleKey(/^[a-zA-Z]$/.test(key) ? key.toUpperCase() : key);
				return;
			}
			if (/^[a-zA-Z]$/.test(key)) {
				event.preventDefault();
				handleKey(key.toUpperCase());
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [clearGuess, handleKey, level.symbolsKeyboard]);

	const disabled = status !== "playing" || revealingRow !== null;

	return (
		<div className="game">
			<header className="game-header">
				<Link to="/" className="game-back">
					Home
				</Link>
				<h1 className="game-title">Wordle</h1>
				<button type="button" className="game-restart" onClick={restart}>
					New
				</button>
			</header>
			<div className="game-hint">
				{hintRevealed ? (
					<p className="game-hint-text">{level.hint}</p>
				) : (
					<button
						type="button"
						className="game-hint-btn"
						onClick={() => setHintRevealed(true)}
					>
						Show hint
					</button>
				)}
			</div>

			<Message message={message} />

			<Board rows={board} revealingRow={revealingRow} shakeRow={shakeRow} />
			{status !== "playing" ? (
				<div className="game-end">
					<p>
						{status === "won"
							? `You got it in ${currentRow + 1}!`
							: "Better luck next time."}
					</p>
					<div className="game-end-actions">
						<button type="button" className="btn-primary" onClick={restart}>
							Play again
						</button>
						{status === "won" && level.id === 0 ? (
							<Link to="/" className="btn-primary btn-secondary">
								Continue
							</Link>
						) : null}
						{status === "won" &&
						level.id !== 0 &&
						nextLevel &&
						nextLevelUnlocked ? (
							<Link
								to={`/play/${nextLevel.id}`}
								className="btn-primary btn-secondary"
							>
								Continue
							</Link>
						) : null}
					</div>
				</div>
			) : null}
			<p className="game-seed" aria-live="polite">
				Seed: {encodeSeed(seed)}
			</p>
			<Keyboard
				keyStates={keyboardState}
				onKey={handleKey}
				disabled={disabled}
				symbolsView={level.symbolsKeyboard}
			/>
			<DevAnswerBanner answer={answer} />
		</div>
	);
}
