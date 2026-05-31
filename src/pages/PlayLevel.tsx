import { Link, useParams } from "react-router-dom";
import { Game } from "#/components/wordle/Game";
import { getLevel } from "#/levels";

export function PlayLevel() {
	const { levelId } = useParams();
	const id = Number.parseInt(levelId ?? "", 10);
	const level = getLevel(id);

	if (!level) {
		return (
			<div className="home">
				<p>That puzzle does not exist.</p>
				<Link to="/">Home</Link>
			</div>
		);
	}

	return <Game level={level} />;
}
