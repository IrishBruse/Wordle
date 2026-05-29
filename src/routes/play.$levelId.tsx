import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Game } from "#/components/wordle/Game";
import { getLevel } from "#/game/levels";
import { isLevelUnlocked } from "#/game/progress";

export const Route = createFileRoute("/play/$levelId")({
	component: PlayLevel,
});

function PlayLevel() {
	const { levelId } = Route.useParams();
	const id = Number.parseInt(levelId, 10);
	const level = getLevel(id);

	if (!level) {
		return (
			<div className="home">
				<p>That puzzle does not exist.</p>
				<Link to="/">Home</Link>
			</div>
		);
	}

	if (!isLevelUnlocked(id)) {
		return <Navigate to="/play/$levelId" params={{ levelId: "1" }} />;
	}

	return <Game level={level} />;
}
