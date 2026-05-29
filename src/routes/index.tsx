import { createFileRoute, Link } from "@tanstack/react-router";
import { LEVELS } from "#/game/levels";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="home">
			<h1 className="home-title">Wordle</h1>
			<p className="home-subtitle">
				Level-based word puzzles. More rules and trolls coming soon.
			</p>
			<ul className="level-list">
				{LEVELS.map((level) => (
					<li key={level.id}>
						<Link
							to="/play/$levelId"
							params={{ levelId: String(level.id) }}
							className="level-card"
						>
							<span className="level-number">Level {level.id}</span>
							<span className="level-name">{level.name}</span>
							<span className="level-desc">{level.description}</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
