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
	return (
		<div
			className={`tile ${stateClass[state]}${animate ? " tile-flip" : ""}`}
			style={animate ? { animationDelay: `${delayMs}ms` } : undefined}
			data-state={state}
		>
			<div className="tile-inner">
				<div className="tile-front">{letter}</div>
				<div className="tile-back">{letter}</div>
			</div>
		</div>
	);
}
