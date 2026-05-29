/** Letter appears in an empty cell while typing. */
export const TILE_POP_IN_MS = 150;

/** One tile flip on submit. */
export const TILE_FLIP_MS = 650;

/** Delay before each tile in a row starts flipping. */
export const TILE_FLIP_STAGGER_MS = 320;

/** How long input stays locked after a valid guess. */
export function rowRevealDurationMs(wordLength: number): number {
	return (wordLength - 1) * TILE_FLIP_STAGGER_MS + TILE_FLIP_MS;
}
