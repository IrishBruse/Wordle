import type { CSSProperties } from "react";
import { TILE_FLIP_MS } from "#/game/timing";
import type { LetterState } from "#/game/types";

type TileProps = {
	letter: string;
	state: LetterState;
	animate?: boolean;
	delayMs?: number;
};

const stateClass: Record<LetterState, string> = {
	empty: "tile-empty",
	tbd: "tile-tbd",
	correct: "tile-correct",
	present: "tile-present",
	absent: "tile-absent",
	decoy: "tile-decoy",
};

export function Tile({ letter, state, animate, delayMs = 0 }: TileProps) {
	const isFlipping = Boolean(animate && state !== "empty" && state !== "tbd");
	const frontState: LetterState = isFlipping ? "tbd" : state;

	const flipStyle = isFlipping
		? ({
				"--tile-flip-ms": `${TILE_FLIP_MS}ms`,
				"--tile-flip-delay": `${delayMs}ms`,
			} as CSSProperties)
		: undefined;

	return (
		<div
			className={`tile${isFlipping ? " tile-flip" : ""}`}
			style={flipStyle}
			data-state={state}
		>
			<div className="tile-inner">
				<div className={`tile-face tile-front ${stateClass[frontState]}`}>
					{letter}
				</div>
				<div className={`tile-face tile-back ${stateClass[state]}`}>
					{letter}
				</div>
			</div>
		</div>
	);
}
