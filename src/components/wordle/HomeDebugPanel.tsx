import { useMemo, useState, useSyncExternalStore } from "react";
import { useIsLocalhost } from "#/game/dev";
import {
	formatMutationChange,
	mutatedAnswerDetailsForEncodedSeed,
} from "#/game/mutated";
import {
	clearAllGameStorage,
	clearCompletions,
	clearProgress,
	clearStoredSeeds,
	debugFinishLevelZero,
	getGameLocalStorageSnapshot,
	getLevelCompletion,
	setLevelCompletion,
	setMaxUnlockedLevel,
	subscribeProgress,
} from "#/game/progress";
import { answerForEncodedSeed } from "#/game/seed";
import { symbolsForEncodedSeed } from "#/game/symbols";
import { useMaxUnlockedLevel } from "#/game/useProgress";
import { getWordLists } from "#/game/words";
import { getNumberedLevels } from "#/levels";

function DebugButton({
	children,
	onClick,
}: {
	children: string;
	onClick: () => void;
}) {
	return (
		<button type="button" className="home-debug-btn" onClick={onClick}>
			{children}
		</button>
	);
}

function SeedLookup() {
	const [seedCode, setSeedCode] = useState("");
	const [levelId, setLevelId] = useState("0");
	const { answers, allowed } = useMemo(() => getWordLists(), []);
	const lookup = useMemo(() => {
		if (levelId === "6") {
			return mutatedAnswerDetailsForEncodedSeed(seedCode, answers, allowed);
		}
		if (levelId === "7") {
			return symbolsForEncodedSeed(seedCode, answers);
		}
		return answerForEncodedSeed(seedCode, answers);
	}, [allowed, answers, levelId, seedCode]);

	let result: string;
	if (!seedCode.trim()) {
		result = "Enter a seed code";
	} else if (lookup === null) {
		result = "Invalid seed";
	} else if (levelId === "6" && typeof lookup === "object") {
		result = `${lookup.answer.toUpperCase()} | ${formatMutationChange(lookup)}`;
	} else {
		result = levelId === "7" ? lookup : lookup.toUpperCase();
	}

	return (
		<div className="home-debug-group">
			<label className="home-debug-label" htmlFor="home-debug-seed-level">
				Level for seed lookup
			</label>
			<select
				id="home-debug-seed-level"
				className="home-debug-input home-debug-select"
				value={levelId}
				onChange={(event) => setLevelId(event.target.value)}
			>
				<option value="0">0-3 (word pool)</option>
				<option value="6">6 (almost)</option>
				<option value="7">7 (symbols)</option>
			</select>
			<label className="home-debug-label" htmlFor="home-debug-seed">
				Seed to answer
			</label>
			<input
				id="home-debug-seed"
				className="home-debug-input"
				type="text"
				value={seedCode}
				onChange={(event) => setSeedCode(event.target.value)}
				placeholder="0001"
				spellCheck={false}
				autoCapitalize="off"
				autoComplete="off"
				maxLength={4}
			/>
			<p className="home-debug-seed-result" aria-live="polite">
				{result}
			</p>
		</div>
	);
}

export function HomeDebugPanel() {
	const maxUnlocked = useMaxUnlockedLevel();
	const storageEntries = useSyncExternalStore(
		subscribeProgress,
		getGameLocalStorageSnapshot,
		() => [],
	);
	const isDev = useIsLocalhost();

	if (!isDev) return null;

	const levels = getNumberedLevels();
	const maxLevelId = levels.at(-1)?.id ?? 0;
	const completionSummary = levels
		.map((level) => {
			const status = getLevelCompletion(level.id);
			if (!status) return `${level.id}: -`;
			return `${level.id}: ${status}`;
		})
		.join(", ");

	return (
		<aside className="home-debug" aria-label="Development progress controls">
			<p className="home-debug-title">Debug</p>
			<p className="home-debug-state">
				Max unlocked: {maxUnlocked} | Completions: {completionSummary || "none"}
			</p>

			<SeedLookup />

			<div className="home-debug-group">
				<p className="home-debug-label">Local storage</p>
				<dl className="home-debug-storage">
					{storageEntries.map(({ key, value }) => (
						<div key={key} className="home-debug-storage-row">
							<dt className="home-debug-storage-key">{key}</dt>
							<dd className="home-debug-storage-value">
								{value ?? "(not set)"}
							</dd>
						</div>
					))}
				</dl>
			</div>

			<div className="home-debug-group">
				<p className="home-debug-label">Clear</p>
				<div className="home-debug-actions">
					<DebugButton onClick={() => clearProgress()}>
						Clear progress
					</DebugButton>
					<DebugButton onClick={() => clearCompletions()}>
						Clear completions
					</DebugButton>
					<DebugButton onClick={() => clearStoredSeeds()}>
						Clear seeds
					</DebugButton>
					<DebugButton onClick={() => clearAllGameStorage()}>
						Clear all
					</DebugButton>
				</div>
			</div>

			<div className="home-debug-group">
				<p className="home-debug-label">Unlock</p>
				<div className="home-debug-actions">
					<DebugButton onClick={() => setMaxUnlockedLevel(0)}>
						Fresh (Play only)
					</DebugButton>
					<DebugButton onClick={() => setMaxUnlockedLevel(1)}>
						Post-tutorial
					</DebugButton>
					{maxLevelId >= 2 ? (
						<DebugButton onClick={() => setMaxUnlockedLevel(2)}>
							Post level 1
						</DebugButton>
					) : null}
					<DebugButton onClick={() => debugFinishLevelZero()}>
						Finish level 0
					</DebugButton>
					{maxLevelId > 1 ? (
						<DebugButton onClick={() => setMaxUnlockedLevel(maxLevelId)}>
							Unlock all
						</DebugButton>
					) : null}
				</div>
			</div>

			<div className="home-debug-group">
				<p className="home-debug-label">Set completion</p>
				<div className="home-debug-actions">
					{levels.map((level) => (
						<span key={level.id} className="home-debug-level-set">
							<span className="home-debug-level-id">L{level.id}</span>
							<DebugButton
								onClick={() => setLevelCompletion(level.id, "clean")}
							>
								Done
							</DebugButton>
							<DebugButton onClick={() => setLevelCompletion(level.id, null)}>
								Clear
							</DebugButton>
						</span>
					))}
				</div>
			</div>
		</aside>
	);
}
