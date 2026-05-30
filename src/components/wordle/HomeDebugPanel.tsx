import { type ReactNode, useMemo, useState, useSyncExternalStore } from "react";
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

function DebugSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="home-debug-section">
			<h3 className="home-debug-section-title">{title}</h3>
			{children}
		</section>
	);
}

function DebugMetric({ label, value }: { label: string; value: ReactNode }) {
	return (
		<div className="home-debug-metric">
			<span className="home-debug-metric-label">{label}</span>
			<span className="home-debug-metric-value">{value}</span>
		</div>
	);
}

function SeedLookup() {
	const [seedCode, setSeedCode] = useState("0001");
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
	} else if (typeof lookup === "string") {
		result = levelId === "7" ? lookup : lookup.toUpperCase();
	} else {
		result = "Invalid seed";
	}

	return (
		<div className="home-debug-lookup">
			<div className="home-debug-field">
				<label className="home-debug-label" htmlFor="home-debug-seed-level">
					Level
				</label>
				<select
					id="home-debug-seed-level"
					className="home-debug-input home-debug-select"
					value={levelId}
					onChange={(event) => setLevelId(event.target.value)}
				>
					<option value="0">0-3 word pool</option>
					<option value="6">6 almost</option>
					<option value="7">7 symbols</option>
				</select>
			</div>
			<div className="home-debug-field home-debug-seed-field">
				<label className="home-debug-label" htmlFor="home-debug-seed">
					Seed
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
			</div>
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
	const completedCount = levels.filter((level) =>
		getLevelCompletion(level.id),
	).length;
	const completionSummary = levels
		.map((level) => {
			const status = getLevelCompletion(level.id);
			if (!status) return `${level.id}: -`;
			return `${level.id}: ${status}`;
		})
		.join(", ");

	return (
		<aside className="home-debug" aria-label="Development progress controls">
			<div className="home-debug-header">
				<p className="home-debug-title">Debug</p>
				<p className="home-debug-subtitle">Local development controls</p>
			</div>
			<div className="home-debug-state">
				<DebugMetric label="Max unlocked" value={maxUnlocked} />
				<DebugMetric
					label="Completed"
					value={`${completedCount}/${levels.length}`}
				/>
				<DebugMetric
					label="Completion map"
					value={completionSummary || "none"}
				/>
			</div>

			<DebugSection title="Seed lookup">
				<SeedLookup />
			</DebugSection>

			<DebugSection title="Local storage">
				<dl className="home-debug-storage">
					{storageEntries.length === 0 ? (
						<div className="home-debug-storage-row">
							<dt className="home-debug-storage-key">No Wordle data</dt>
							<dd className="home-debug-storage-value">(not set)</dd>
						</div>
					) : (
						storageEntries.map(({ key, value }) => (
							<div key={key} className="home-debug-storage-row">
								<dt className="home-debug-storage-key">{key}</dt>
								<dd className="home-debug-storage-value">
									{value ?? "(not set)"}
								</dd>
							</div>
						))
					)}
				</dl>
			</DebugSection>

			<DebugSection title="Clear data">
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
			</DebugSection>

			<DebugSection title="Unlock presets">
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
			</DebugSection>

			<DebugSection title="Set completion">
				<div className="home-debug-completion-grid">
					{levels.map((level) => (
						<div key={level.id} className="home-debug-level-set">
							<div className="home-debug-level-row">
								<span className="home-debug-level-id">L{level.id}</span>
								<span className="home-debug-level-status">
									{getLevelCompletion(level.id) ?? "open"}
								</span>
							</div>
							<div className="home-debug-level-actions">
								<DebugButton
									onClick={() => setLevelCompletion(level.id, "clean")}
								>
									Done
								</DebugButton>
								<DebugButton onClick={() => setLevelCompletion(level.id, null)}>
									Clear
								</DebugButton>
							</div>
						</div>
					))}
				</div>
			</DebugSection>
		</aside>
	);
}
