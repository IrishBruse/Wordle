import { Link, Navigate, useParams } from "react-router-dom";
import { Game } from "#/components/wordle/Game";
import { useIsLevelUnlocked } from "#/game/useProgress";
import { getLevel } from "#/levels";

export function PlayLevel() {
	const { levelId } = useParams();
	const id = Number.parseInt(levelId ?? "", 10);
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
		return <Navigate to="/play" replace />;
	}

	return <Game level={level} />;
}
