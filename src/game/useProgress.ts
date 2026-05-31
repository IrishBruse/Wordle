import { useSyncExternalStore } from "react";
import {
	getLevelCompletion,
	getMaxUnlockedLevel,
	hasFinishedFirstPuzzle,
	isLevelUnlocked,
	type LevelCompletionStatus,
	subscribeProgress,
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

export function useMaxUnlockedLevel(): number {
	return useSyncExternalStore(subscribeProgress, getMaxUnlockedLevel, () => 0);
}

export function useIsLevelUnlocked(levelId: number): boolean {
	return useSyncExternalStore(
		subscribeProgress,
		() => isLevelUnlocked(levelId),
		() => levelId >= 0,
	);
}
