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
};

export function Tile({ letter, state, animate, delayMs = 0 }: TileProps) {
	const flipStyle = animate
		? ({
				animationDelay: `${delayMs}ms`,
				"--tile-flip-ms": `${TILE_FLIP_MS}ms`,
			} as CSSProperties)
		: undefined;

	return (
		<div
			className={`tile ${stateClass[state]}${animate ? " tile-flip" : ""}`}
			style={flipStyle}
			data-state={state}
		>
			<div className="tile-inner">
				<div className="tile-front">{letter}</div>
				<div className="tile-back">{letter}</div>
			</div>
		</div>
	);
}
