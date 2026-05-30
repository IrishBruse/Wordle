import { useSyncExternalStore } from "react";
import {
	getLevelCompletion,
	hasFinishedFirstPuzzle,
	subscribeProgress,
	type LevelCompletionStatus,
} from "./progress";

export function useHasFinishedFirstPuzzle(): boolean {
	return useSyncExternalStore(
		subscribeProgress,
		hasFinishedFirstPuzzle,
		() => false,
	);
}

export function useLevelCompletion(
	levelId: number,
): LevelCompletionStatus | null {
	return useSyncExternalStore(
		subscribeProgress,
		() => getLevelCompletion(levelId),
		() => null,
	);
}
