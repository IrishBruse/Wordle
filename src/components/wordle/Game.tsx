import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { getNextLevel } from "#/game/levels";
import { encodeSeed } from "#/game/seed";
import { isLevelUnlocked, unlockLevel } from "#/game/progress";
import type { LevelConfig } from "#/game/types";
import { useWordleGame } from "#/game/useWordleGame";
import { Board } from "./Board";
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
		submitGuess,
		restart,
	} = useWordleGame(level);

	const [shakeRow, setShakeRow] = useState<number | null>(null);
	const unlockedNextRef = useRef(false);
	const nextLevel = getNextLevel(level.id);

	useEffect(() => {
		if (status !== "won") {
			unlockedNextRef.current = false;
			return;
		}
		if (unlockedNextRef.current || !nextLevel) return;
		unlockedNextRef.current = true;
		unlockLevel(nextLevel.id);
	}, [status, nextLevel]);

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
			if (/^[a-zA-Z]$/.test(key)) {
				event.preventDefault();
				handleKey(key.toUpperCase());
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [handleKey]);

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
			<p className="game-seed" aria-live="polite">
				Seed: {encodeSeed(seed)}
			</p>

			<Message message={message} />

			<Board
				rows={board}
				revealingRow={revealingRow}
				shakeRow={shakeRow}
			/>
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
						{status === "won" &&
						nextLevel &&
						isLevelUnlocked(nextLevel.id) ? (
							<Link
								to="/play/$levelId"
								params={{ levelId: String(nextLevel.id) }}
								className="btn-primary btn-secondary"
							>
								Continue
							</Link>
						) : null}
					</div>
				</div>
			) : null}
			<Keyboard
				keyStates={keyboardState}
				onKey={handleKey}
				disabled={disabled}
			/>
		</div>
	);
}
