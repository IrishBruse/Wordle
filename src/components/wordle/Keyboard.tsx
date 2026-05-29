import { Delete } from "lucide-react";
import type { LetterState } from "#/game/types";

const ROWS = [
	["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
	["A", "S", "D", "F", "G", "H", "J", "K", "L"],
	["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
] as const;

type KeyboardProps = {
	keyStates: Map<string, LetterState>;
	onKey: (key: string) => void;
	disabled?: boolean;
};

function keyClass(state: LetterState | undefined): string {
	if (!state || state === "empty" || state === "tbd") return "key-default";
	return `key-${state}`;
}

export function Keyboard({ keyStates, onKey, disabled }: KeyboardProps) {
	return (
		<div className="keyboard" role="group" aria-label="On-screen keyboard">
			{ROWS.map((row, rowIndex) => (
				<div key={rowIndex} className="keyboard-row">
					{row.map((key) => {
						const label =
							key === "BACK" ? (
								<Delete className="key-icon" aria-hidden />
							) : (
								key
							);
						const wide = key === "ENTER" || key === "BACK";
						const state =
							key === "ENTER" || key === "BACK"
								? undefined
								: keyStates.get(key);

						return (
							<button
								key={key}
								type="button"
								className={`key ${keyClass(state)}${wide ? " key-wide" : ""}`}
								onClick={() => onKey(key)}
								disabled={disabled}
								aria-label={key === "BACK" ? "Backspace" : key}
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
