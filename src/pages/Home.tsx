import { Link } from "react-router-dom";
import { HomeDebugPanel } from "#/components/wordle/HomeDebugPanel";
import type { LevelCompletionStatus } from "#/game/progress";
import type { LevelConfig } from "#/game/types";
import {
	useHasFinishedFirstPuzzle,
	useLevelCompletion,
	useMaxUnlockedLevel,
} from "#/game/useProgress";
import { getNumberedLevels } from "#/levels";

function levelBoxClass(completion: LevelCompletionStatus | null): string {
	const classes = ["level-box"];
	if (completion === "clean") classes.push("level-box-complete");
	return classes.join(" ");
}

function unlockedLevels(
	levels: LevelConfig[],
	maxUnlocked: number,
): LevelConfig[] {
	return levels.filter((level) => level.id === 0 || level.id <= maxUnlocked);
}

function levelAriaLabel(
	levelId: number,
	completion: LevelCompletionStatus | null,
): string {
	if (completion === "clean") return `Puzzle ${levelId}, completed`;
	return `Puzzle ${levelId}`;
}

function LevelBox({ level }: { level: LevelConfig }) {
	const completion = useLevelCompletion(level.id);
	const className = levelBoxClass(completion);

	return (
		<li>
			<Link
				to={`/play/${level.id}`}
				className={className}
				aria-label={levelAriaLabel(level.id, completion)}
			>
				{level.id}
			</Link>
		</li>
	);
}

function LevelBoxRow({
	levels,
	center = false,
}: {
	levels: LevelConfig[];
	center?: boolean;
}) {
	if (levels.length === 0) return null;

	const rowClass = center
		? "level-box-row level-box-row-center"
		: "level-box-row";

	return (
		<ul className={rowClass}>
			{levels.map((level) => (
				<LevelBox key={level.id} level={level} />
			))}
		</ul>
	);
}

export function Home() {
	const hasFinishedFirst = useHasFinishedFirstPuzzle();
	const maxUnlocked = useMaxUnlockedLevel();
	const levels = getNumberedLevels();
	const levelZero = unlockedLevels(
		levels.filter((level) => level.id === 0),
		maxUnlocked,
	);
	const levelsOneToFive = unlockedLevels(
		levels.filter((level) => level.id >= 1 && level.id <= 5),
		maxUnlocked,
	);
	const levelsSixPlus = unlockedLevels(
		levels.filter((level) => level.id >= 6),
		maxUnlocked,
	);

	return (
		<div className="home">
			<h1 className="home-title">Wordle</h1>
			<p className="home-subtitle">Guess the hidden word in six tries.</p>
			{hasFinishedFirst ? (
				<div className="level-box-grid">
					<LevelBoxRow levels={levelZero} center />
					<LevelBoxRow levels={levelsOneToFive} />
					<LevelBoxRow levels={levelsSixPlus} />
				</div>
			) : (
				<Link to="/play" className="btn-primary">
					Play
				</Link>
			)}
			<HomeDebugPanel />
		</div>
	);
}
