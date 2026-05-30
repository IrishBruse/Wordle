const STORAGE_KEY = "wordle-max-unlocked-level";
const COMPLETIONS_KEY = "wordle-level-completions";

export type LevelCompletionStatus = "clean";

function readMaxUnlocked(): number {
	if (typeof window === "undefined") return 0;
	const raw = window.localStorage.getItem(STORAGE_KEY);
	const parsed = raw ? Number.parseInt(raw, 10) : 0;
	if (!Number.isFinite(parsed) || parsed < 0) return 0;
	return parsed;
}

export function getMaxUnlockedLevel(): number {
	return readMaxUnlocked();
}

export function isLevelUnlocked(levelId: number): boolean {
	if (levelId === 0) return true;
	return levelId <= readMaxUnlocked();
}

export function hasFinishedFirstPuzzle(): boolean {
	return readMaxUnlocked() > 0;
}

function readCompletions(): Record<number, LevelCompletionStatus> {
	if (typeof window === "undefined") return {};
	const raw = window.localStorage.getItem(COMPLETIONS_KEY);
	if (!raw) return {};
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return {};
		const out: Record<number, LevelCompletionStatus> = {};
		for (const [key, value] of Object.entries(parsed)) {
			const id = Number.parseInt(key, 10);
			if (!Number.isFinite(id)) continue;
			if (value === "clean") out[id] = value;
		}
		return out;
	} catch {
		return {};
	}
}

function writeCompletions(
	completions: Record<number, LevelCompletionStatus>,
): void {
	window.localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
}

export function getLevelCompletion(
	levelId: number,
): LevelCompletionStatus | null {
	return readCompletions()[levelId] ?? null;
}

export function markLevelWon(levelId: number): void {
	if (typeof window === "undefined") return;
	const completions = readCompletions();
	completions[levelId] = "clean";
	writeCompletions(completions);
	notifyProgress();
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

/** Mark level 0 won (green) and unlock level 1, as if the tutorial was completed. */
export function debugFinishLevelZero(): void {
	markLevelWon(0);
	unlockLevel(1);
}

export function setMaxUnlockedLevel(levelId: number): void {
	if (typeof window === "undefined") return;
	if (!Number.isFinite(levelId) || levelId < 0) return;
	if (levelId === 0) {
		window.localStorage.removeItem(STORAGE_KEY);
	} else {
		window.localStorage.setItem(STORAGE_KEY, String(levelId));
	}
	notifyProgress();
}

export function setLevelCompletion(
	levelId: number,
	status: LevelCompletionStatus | null,
): void {
	if (typeof window === "undefined") return;
	const completions = readCompletions();
	if (status === null) {
		delete completions[levelId];
	} else {
		completions[levelId] = status;
	}
	writeCompletions(completions);
	notifyProgress();
}

export function clearCompletions(): void {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(COMPLETIONS_KEY);
	notifyProgress();
}

export function clearProgress(): void {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(STORAGE_KEY);
	window.localStorage.removeItem(COMPLETIONS_KEY);
	notifyProgress();
}

export function clearStoredSeeds(): void {
	if (typeof window === "undefined") return;
	const keys: string[] = [];
	for (let i = 0; i < window.localStorage.length; i++) {
		const key = window.localStorage.key(i);
		if (key?.startsWith("wordle-seed-")) keys.push(key);
	}
	for (const key of keys) window.localStorage.removeItem(key);
	notifyProgress();
}

export function clearAllGameStorage(): void {
	clearProgress();
	clearStoredSeeds();
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
