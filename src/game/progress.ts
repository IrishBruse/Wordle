const STORAGE_KEY = "wordle-max-unlocked-level";

function readMaxUnlocked(): number {
	if (typeof window === "undefined") return 1;
	const raw = window.localStorage.getItem(STORAGE_KEY);
	const parsed = raw ? Number.parseInt(raw, 10) : 1;
	if (!Number.isFinite(parsed) || parsed < 1) return 1;
	return parsed;
}

export function getMaxUnlockedLevel(): number {
	return readMaxUnlocked();
}

export function isLevelUnlocked(levelId: number): boolean {
	return levelId <= readMaxUnlocked();
}

export function hasFinishedFirstPuzzle(): boolean {
	return readMaxUnlocked() > 1;
}

const PROGRESS_EVENT = "wordle-progress";

function notifyProgress(): void {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function unlockLevel(levelId: number): void {
	if (typeof window === "undefined") return;
	const next = Math.max(readMaxUnlocked(), levelId);
	window.localStorage.setItem(STORAGE_KEY, String(next));
	notifyProgress();
}

export function subscribeProgress(onChange: () => void): () => void {
	if (typeof window === "undefined") return () => {};
	const handler = () => onChange();
	window.addEventListener(PROGRESS_EVENT, handler);
	window.addEventListener("storage", handler);
	return () => {
		window.removeEventListener(PROGRESS_EVENT, handler);
		window.removeEventListener("storage", handler);
	};
}
