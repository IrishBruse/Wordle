const SEED_KEY_PREFIX = "wordle-seed-";

const STORAGE_KEY = "wordle-max-unlocked-level";
const COMPLETIONS_KEY = "wordle-level-completions";

export type GameStorageEntry = {
	key: string;
	value: string | null;
};

const EMPTY_STORAGE_SNAPSHOT: GameStorageEntry[] = [];

let storageSnapshotCache: GameStorageEntry[] = EMPTY_STORAGE_SNAPSHOT;
let storageSnapshotDigest = "";

function readGameLocalStorageEntries(): GameStorageEntry[] {
	const entries = new Map<string, string | null>([
		[STORAGE_KEY, window.localStorage.getItem(STORAGE_KEY)],
		[COMPLETIONS_KEY, window.localStorage.getItem(COMPLETIONS_KEY)],
	]);
	for (let i = 0; i < window.localStorage.length; i++) {
		const key = window.localStorage.key(i);
		if (!key?.startsWith(SEED_KEY_PREFIX)) continue;
		entries.set(key, window.localStorage.getItem(key));
	}
	return [...entries.entries()]
		.map(([key, value]) => ({ key, value }))
		.sort((a, b) => a.key.localeCompare(b.key));
}

function digestGameStorageEntries(entries: GameStorageEntry[]): string {
	return entries.map(({ key, value }) => `${key}\0${value ?? ""}`).join("\n");
}

/** Stable snapshot for useSyncExternalStore; same reference while storage is unchanged. */
export function getGameLocalStorageSnapshot(): GameStorageEntry[] {
	if (typeof window === "undefined") return EMPTY_STORAGE_SNAPSHOT;
	const next = readGameLocalStorageEntries();
	const digest = digestGameStorageEntries(next);
	if (digest === storageSnapshotDigest) return storageSnapshotCache;
	storageSnapshotDigest = digest;
	storageSnapshotCache = next.length === 0 ? EMPTY_STORAGE_SNAPSHOT : next;
	return storageSnapshotCache;
}
