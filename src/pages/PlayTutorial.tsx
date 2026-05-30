import { Game } from "#/components/wordle/Game";
import { getTutorialLevel } from "#/levels";

export function PlayTutorial() {
	return <Game level={getTutorialLevel()} />;
}
