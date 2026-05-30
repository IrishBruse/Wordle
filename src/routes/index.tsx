import { createFileRoute, Link } from "@tanstack/react-router";
import {
	isLevelUnlocked,
	type LevelCompletionStatus,
} from "#/game/progress";
import {
	useHasFinishedFirstPuzzle,
	useLevelCompletion,
} from "#/game/useProgress";
import type { LevelConfig } from "#/game/types";
import { getNumberedLevels } from "#/levels";

export const Route = createFileRoute("/")({ component: Home });

function levelBoxClass(
	unlocked: boolean,
	completion: LevelCompletionStatus | null,
): string {
	const classes = ["level-box"];
	if (!unlocked) classes.push("level-box-locked");
	if (completion === "clean") classes.push("level-box-complete");
	if (completion === "hint") classes.push("level-box-hint");
	return classes.join(" ");
}

function levelAriaLabel(
	levelId: number,
	completion: LevelCompletionStatus | null,
): string {
	if (completion === "clean") return `Puzzle ${levelId}, completed`;
	if (completion === "hint") return `Puzzle ${levelId}, completed with hint`;
	return `Puzzle ${levelId}`;
}

function LevelBox({ level }: { level: LevelConfig }) {
	const unlocked = isLevelUnlocked(level.id);
	const completion = useLevelCompletion(level.id);
	const className = levelBoxClass(unlocked, completion);

	if (unlocked) {
		return (
			<li>
				<Link
					to="/play/$levelId"
					params={{ levelId: String(level.id) }}
					className={className}
					aria-label={levelAriaLabel(level.id, completion)}
				>
					{level.id}
				</Link>
			</li>
		);
	}

	return (
		<li>
			<span className={className} aria-hidden="true">
				{level.id}
			</span>
		</li>
	);
}

function Home() {
	const hasFinishedFirst = useHasFinishedFirstPuzzle();

	return (
		<div className="home">
			<h1 className="home-title">Wordle</h1>
			<p className="home-subtitle">Guess the hidden word in six tries.</p>
			{hasFinishedFirst ? (
				<ul className="level-box-list">
					{getNumberedLevels().map((level) => (
						<LevelBox key={level.id} level={level} />
					))}
				</ul>
			) : (
				<Link to="/play" className="btn-primary">
					Play
				</Link>
			)}
		</div>
	);
}
