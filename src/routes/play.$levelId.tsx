import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { Game } from "#/components/wordle/Game";
import { useIsLevelUnlocked } from "#/game/useProgress";
import { getLevel } from "#/levels";

export const Route = createFileRoute("/play/$levelId")({
	component: PlayLevel,
});

function PlayLevel() {
	const { levelId } = Route.useParams();
	const id = Number.parseInt(levelId, 10);
	const level = getLevel(id);
	const unlocked = useIsLevelUnlocked(id);

	if (!level) {
		return (
			<div className="home">
				<p>That puzzle does not exist.</p>
				<Link to="/">Home</Link>
			</div>
		);
	}

	if (!unlocked) {
		return <Navigate to="/play" />;
	}

	return <Game level={level} />;
}
