import type { LevelConfig } from "#/game/types";
import { level0 } from "./0";
import { level1 } from "./1";
import { level2 } from "./2";
import { level3 } from "./3";
import { level4 } from "./4";
import { level5 } from "./5";
import { level6 } from "./6";
import { level7 } from "./7";

export const LEVELS: LevelConfig[] = [
	level0,
	level1,
	level2,
	level3,
	level4,
	level5,
	level6,
	level7,
];

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
