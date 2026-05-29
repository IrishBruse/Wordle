import { createFileRoute, Link } from "@tanstack/react-router";
import { getNumberedLevels } from "#/game/levels";
import { isLevelUnlocked } from "#/game/progress";
import { useHasFinishedFirstPuzzle } from "#/game/useProgress";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const hasFinishedFirst = useHasFinishedFirstPuzzle();

	return (
		<div className="home">
			<h1 className="home-title">Wordle</h1>
			<p className="home-subtitle">Guess the hidden word in six tries.</p>
			{hasFinishedFirst ? (
				<ul className="level-box-list">
					{getNumberedLevels().map((level) => {
						const unlocked = isLevelUnlocked(level.id);
						if (unlocked) {
							return (
								<li key={level.id}>
									<Link
										to="/play/$levelId"
										params={{ levelId: String(level.id) }}
										className="level-box"
										aria-label={`Puzzle ${level.id}`}
									>
										{level.id}
									</Link>
								</li>
							);
						}
						return (
							<li key={level.id}>
								<span
									className="level-box level-box-locked"
									aria-hidden="true"
								>
									{level.id}
								</span>
							</li>
						);
					})}
				</ul>
			) : (
				<Link to="/play" className="btn-primary">
					Play
				</Link>
			)}
		</div>
	);
}
