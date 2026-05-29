import { useSyncExternalStore } from "react";
import { hasFinishedFirstPuzzle, subscribeProgress } from "./progress";

export function useHasFinishedFirstPuzzle(): boolean {
	return useSyncExternalStore(
		subscribeProgress,
		hasFinishedFirstPuzzle,
		() => false,
	);
}
