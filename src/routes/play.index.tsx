import { createFileRoute } from "@tanstack/react-router";
import { Game } from "#/components/wordle/Game";
import { getTutorialLevel } from "#/game/levels";

export const Route = createFileRoute("/play/")({
	component: PlayTutorial,
});

function PlayTutorial() {
	return <Game level={getTutorialLevel()} />;
}
