import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeDebugPanel } from "#/components/wordle/HomeDebugPanel";
import type { LevelCompletionStatus } from "#/game/progress";
import type { LevelConfig } from "#/game/types";
import {
	useHasFinishedFirstPuzzle,
	useIsLevelUnlocked,
	useLevelCompletion,
} from "#/game/useProgress";
import { getNumberedLevels } from "#/levels";

export const Route = createFileRoute("/")({ component: Home });

function levelBoxClass(
	unlocked: boolean,
	completion: LevelCompletionStatus | null,
): string {
	const classes = ["level-box"];
	if (!unlocked) classes.push("level-box-locked");
	if (completion === "clean") classes.push("level-box-complete");
	return classes.join(" ");
}

function levelAriaLabel(
	levelId: number,
	completion: LevelCompletionStatus | null,
): string {
	if (completion === "clean") return `Puzzle ${levelId}, completed`;
	return `Puzzle ${levelId}`;
}

function LevelBox({ level }: { level: LevelConfig }) {
	const unlocked = useIsLevelUnlocked(level.id);
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
			<HomeDebugPanel />
		</div>
	);
}
