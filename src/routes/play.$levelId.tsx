import { createFileRoute, Link } from "@tanstack/react-router";
import { Game } from "#/components/wordle/Game";
import { getLevel } from "#/game/levels";

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
				<p>Unknown level.</p>
				<Link to="/">Back to levels</Link>
			</div>
		);
	}

	return <Game level={level} />;
}
