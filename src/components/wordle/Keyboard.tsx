import { Delete } from "lucide-react";
import { useEffect, useState } from "react";
import { SYMBOL_KEY_ROWS } from "#/game/symbols";
import type { LetterState } from "#/game/types";

const LETTER_ROWS = [
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L"],
	["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
] as const;

const LETTER_ROWS_WITH_SYMBOLS_TOGGLE = [
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L"],
	["ENTER", "123", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
] as const;

const SYMBOL_ROWS = [
	SYMBOL_KEY_ROWS[0],
	SYMBOL_KEY_ROWS[1],
	["ABC", ...SYMBOL_KEY_ROWS[2], "ENTER", "BACK"],
] as const;

const MODE_KEYS = new Set(["123", "ABC"]);

type KeyDef = string;

type KeyboardProps = {
	keyStates: Map<string, LetterState>;
	onKey: (key: string) => void;
	disabled?: boolean;
	/** When true, show a 123 / ABC toggle for a phone-style symbols layout. */
	symbolsView?: boolean;
};

function keyClass(state: LetterState | undefined): string {
	if (!state || state === "empty" || state === "tbd") return "key-default";
	return `key-${state}`;
}

function isWideKey(key: KeyDef): boolean {
	return key === "ENTER" || key === "BACK" || key === "123" || key === "ABC";
}

function ariaLabel(key: KeyDef): string {
	if (key === "BACK") return "Backspace";
	if (key === "123") return "Numbers and symbols";
	if (key === "ABC") return "Letters";
	return key;
}

export function Keyboard({
	keyStates,
	onKey,
	disabled,
	symbolsView = false,
}: KeyboardProps) {
	const [showSymbols, setShowSymbols] = useState(false);

	useEffect(() => {
		if (!symbolsView) setShowSymbols(false);
	}, [symbolsView]);

	const rows =
		symbolsView && showSymbols
			? SYMBOL_ROWS
			: symbolsView
				? LETTER_ROWS_WITH_SYMBOLS_TOGGLE
				: LETTER_ROWS;

	const handleKey = (key: KeyDef) => {
		if (key === "123") {
			setShowSymbols(true);
			return;
		}
		if (key === "ABC") {
			setShowSymbols(false);
			return;
		}
		onKey(key);
	};

	return (
		<div
			className={`keyboard${disabled ? " keyboard-inactive" : ""}`}
			role="group"
			aria-label={
				showSymbols ? "On-screen symbols keyboard" : "On-screen keyboard"
			}
		>
			{rows.map((row, rowIndex) => (
				<div key={rowIndex} className="keyboard-row">
					{row.map((key) => {
						const label =
							key === "BACK" ? (
								<Delete className="key-icon" aria-hidden />
							) : (
								key
							);
						const wide = isWideKey(key);
						const isModeKey = MODE_KEYS.has(key);
						const state =
							key === "ENTER" || key === "BACK" || isModeKey || showSymbols
								? undefined
								: keyStates.get(key);

						return (
							<button
								key={key}
								type="button"
								className={`key ${keyClass(state)}${wide ? " key-wide" : ""}${isModeKey ? " key-mode" : ""}`}
								onClick={() => handleKey(key)}
								disabled={disabled}
								aria-label={ariaLabel(key)}
							>
								{label}
							</button>
						);
					})}
				</div>
			))}
		</div>
	);
}
