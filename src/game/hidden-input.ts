/** Merge visible board letters with overflow typed past the last tile. */
export function buildFullGuess(visible: string, overflow: string): string {
	return visible.toLowerCase() + overflow.toLowerCase();
}

export function addLetterToGuess(
	full: string,
	letter: string,
	guessLength: number,
): string | null {
	if (full.length >= guessLength) return null;
	return full + letter.toLowerCase();
}

export function removeLettersFromGuess(
	full: string,
	backspaceStep: number,
): string {
	if (full.length === 0) return "";
	const remove = Math.min(backspaceStep, full.length);
	return full.slice(0, full.length - remove);
}

export function splitGuessForDisplay(
	full: string,
	displayLength: number,
): { visible: string; overflow: string } {
	return {
		visible: full.slice(0, displayLength),
		overflow: full.slice(displayLength),
	};
}
