/** Letter appears in an empty cell while typing. */
export const TILE_POP_IN_MS = 150;

/** One tile flip on submit (NYT Wordle is ~500ms; slightly slower reads nicer). */
export const TILE_FLIP_MS = 600;

/** Delay before each tile in a row starts flipping. */
export const TILE_FLIP_STAGGER_MS = 300;

/** Brief pause after the last tile shows its color before accepting input. */
export const ROW_REVEAL_BUFFER_MS = 80;

/** How long input stays locked after a valid guess. */
export const rowRevealDurationMs = (wordLength: number): number => {
	const lastTileColorShownMs =
		(wordLength - 1) * TILE_FLIP_STAGGER_MS + TILE_FLIP_MS / 2;
	return lastTileColorShownMs + ROW_REVEAL_BUFFER_MS;
};
