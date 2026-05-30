import type { LevelConfig } from "#/game/types";
import { level0 } from "./0";
import { level1 } from "./1";
import { level2 } from "./2";
import { level3 } from "./3";
import { level4 } from "./4";

export const LEVELS: LevelConfig[] = [level0, level1, level2, level3, level4];

export function getTutorialLevel(): LevelConfig {
	return LEVELS[0];
}

export function getNumberedLevels(): LevelConfig[] {
	return LEVELS;
}

export function getLevel(id: number): LevelConfig | undefined {
	return LEVELS.find((level) => level.id === id);
}

export function getNextLevel(id: number): LevelConfig | undefined {
	return getLevel(id + 1);
}
