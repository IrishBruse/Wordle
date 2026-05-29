import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
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
		addLetter,
		removeLetter,
		submitGuess,
		restart,
	} = useWordleGame(level);

	const [shakeRow, setShakeRow] = useState<number | null>(null);

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
					Levels
				</Link>
				<h1 className="game-title">
					Level {level.id}: {level.name}
				</h1>
				<button type="button" className="game-restart" onClick={restart}>
					New
				</button>
			</header>

			<Message message={message} />

			<Board
				rows={board}
				revealingRow={revealingRow}
				shakeRow={shakeRow}
			/>
			<Keyboard
				keyStates={keyboardState}
				onKey={handleKey}
				disabled={disabled}
			/>
			{status !== "playing" ? (
				<div className="game-end">
					<p>
						{status === "won"
							? `You got it in ${currentRow + 1}!`
							: "Better luck next time."}
					</p>
					<button type="button" className="btn-primary" onClick={restart}>
						Play again
					</button>
				</div>
			) : null}
		</div>
	);
}
