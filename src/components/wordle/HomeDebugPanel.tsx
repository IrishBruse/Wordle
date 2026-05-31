import { type ReactNode, useMemo, useState } from "react";
import { formatCipherAnswers, shiftWordForward } from "#/game/cipher-shift";
import { useDebugMode } from "#/game/dev";
import {
	formatMutationChange,
	mutatedAnswerDetailsForEncodedSeed,
} from "#/game/mutated";
import {
	clearAllGameStorage,
	debugFinishLevelZero,
	getLevelCompletion,
	setLevelCompletion,
	setMaxUnlockedLevel,
} from "#/game/progress";
import { answerForLevelEncodedSeed } from "#/game/seed";
import { symbolsForEncodedSeed } from "#/game/symbols";
import type { LevelId } from "#/game/types";
import { useMaxUnlockedLevel } from "#/game/useProgress";
import { getWordLists } from "#/game/words";
import { getNumberedLevels } from "#/levels";

type UnlockPreset = "fresh" | "after-tutorial" | "unlock-all";
type CompletionChoice = "open" | "complete";

function DebugButton({
	children,
	onClick,
	variant,
}: {
	children: string;
	onClick: () => void;
	variant?: "danger";
}) {
	const className =
		variant === "danger"
			? "home-debug-btn home-debug-btn-danger"
			: "home-debug-btn";
	return (
		<button type="button" className={className} onClick={onClick}>
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

function DebugFormRow({ children }: { children: ReactNode }) {
	return <div className="home-debug-form-row">{children}</div>;
}

type SeedLookupVariant = {
	label: string;
	value: string;
};

const SEED_LOOKUP_LEVELS: LevelId[] = [0, 1, 2, 3, 6, 7, 8];

function seedLookupVariantForLevel(
	levelId: LevelId,
	seedCode: string,
	answers: string[],
	allowed: Set<string>,
): SeedLookupVariant {
	const trimmed = seedCode.trim();
	if (!trimmed) {
		return { label: String(levelId), value: "" };
	}

	if (levelId === 6) {
		const mutated = mutatedAnswerDetailsForEncodedSeed(
			trimmed,
			answers,
			allowed,
		);
		return {
			label: "6",
			value: mutated === null ? "Invalid seed" : formatMutationChange(mutated),
		};
	}

	if (levelId === 7) {
		const symbols = symbolsForEncodedSeed(trimmed, answers);
		return {
			label: "7",
			value: symbols === null ? "Invalid seed" : symbols,
		};
	}

	if (levelId === 8) {
		const word = answerForLevelEncodedSeed(trimmed, answers, 8);
		if (word === null) {
			return { label: "8", value: "Invalid seed" };
		}
		return {
			label: "8",
			value: formatCipherAnswers(word, shiftWordForward(word)),
		};
	}

	const word = answerForLevelEncodedSeed(trimmed, answers, levelId);
	return {
		label: String(levelId),
		value: word === null ? "Invalid seed" : word.toUpperCase(),
	};
}

function seedLookupVariants(
	seedCode: string,
	answers: string[],
	allowed: Set<string>,
): SeedLookupVariant[] {
	return SEED_LOOKUP_LEVELS.map((levelId) =>
		seedLookupVariantForLevel(levelId, seedCode, answers, allowed),
	);
}

function SeedLookup() {
	const [seedCode, setSeedCode] = useState("0001");
	const { answers, allowed } = useMemo(() => getWordLists(), []);
	const variants = useMemo(
		() => seedLookupVariants(seedCode, answers, allowed),
		[allowed, answers, seedCode],
	);
	return (
		<div className="home-debug-lookup">
			<div className="home-debug-field">
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
			<div className="home-debug-seed-results" aria-live="polite">
				{variants.map((variant) => (
					<div key={variant.label} className="home-debug-seed-variant">
						<p className="home-debug-seed-variant-label">{variant.label}</p>
						<p className="home-debug-seed-variant-value">{variant.value}</p>
					</div>
				))}
			</div>
		</div>
	);
}

function UnlockPresetEditor({ maxLevelId }: { maxLevelId: number }) {
	const [preset, setPreset] = useState<UnlockPreset>("fresh");

	function applyPreset() {
		if (preset === "fresh") {
			setMaxUnlockedLevel(0);
			return;
		}
		if (preset === "after-tutorial") {
			debugFinishLevelZero();
			return;
		}
		setMaxUnlockedLevel(maxLevelId);
	}

	return (
		<div className="home-debug-editor">
			<DebugFormRow>
				<div className="home-debug-field home-debug-field-grow">
					<label
						className="home-debug-label"
						htmlFor="home-debug-unlock-preset"
					>
						Unlock preset
					</label>
					<select
						id="home-debug-unlock-preset"
						className="home-debug-input home-debug-select"
						value={preset}
						onChange={(event) => setPreset(event.target.value as UnlockPreset)}
					>
						<option value="fresh">Fresh start</option>
						<option value="after-tutorial">After tutorial</option>
						<option value="unlock-all">Unlock all</option>
					</select>
				</div>
				<div className="home-debug-field home-debug-field-action">
					<span
						className="home-debug-label home-debug-label-spacer"
						aria-hidden
					>
						Apply
					</span>
					<DebugButton onClick={applyPreset}>Apply preset</DebugButton>
				</div>
			</DebugFormRow>
		</div>
	);
}

function CompletionEditor({ levelIds }: { levelIds: number[] }) {
	const [levelId, setLevelId] = useState(String(levelIds[0] ?? 0));
	const [status, setStatus] = useState<CompletionChoice>("complete");

	function applyCompletion() {
		const id = Number.parseInt(levelId, 10);
		if (!Number.isFinite(id)) return;
		setLevelCompletion(id, status === "complete" ? "clean" : null);
	}

	return (
		<div className="home-debug-editor">
			<DebugFormRow>
				<div className="home-debug-field">
					<label
						className="home-debug-label"
						htmlFor="home-debug-completion-level"
					>
						Level
					</label>
					<select
						id="home-debug-completion-level"
						className="home-debug-input home-debug-select"
						value={levelId}
						onChange={(event) => setLevelId(event.target.value)}
					>
						{levelIds.map((id) => (
							<option key={id} value={String(id)}>
								Level {id}
							</option>
						))}
					</select>
				</div>
				<div className="home-debug-field">
					<label
						className="home-debug-label"
						htmlFor="home-debug-completion-status"
					>
						Status
					</label>
					<select
						id="home-debug-completion-status"
						className="home-debug-input home-debug-select"
						value={status}
						onChange={(event) =>
							setStatus(event.target.value as CompletionChoice)
						}
					>
						<option value="open">Open</option>
						<option value="complete">Complete</option>
					</select>
				</div>
				<div className="home-debug-field home-debug-field-action">
					<span
						className="home-debug-label home-debug-label-spacer"
						aria-hidden
					>
						Apply
					</span>
					<DebugButton onClick={applyCompletion}>Apply completion</DebugButton>
				</div>
			</DebugFormRow>
		</div>
	);
}

export function HomeDebugPanel() {
	const maxUnlocked = useMaxUnlockedLevel();
	const isDev = useDebugMode();

	if (!isDev) return null;

	const levels = getNumberedLevels();
	const maxLevelId = levels.at(-1)?.id ?? 0;
	const levelIds = levels.map((level) => level.id);
	const completedCount = levels.filter((level) =>
		getLevelCompletion(level.id),
	).length;
	const completionSummary = levels
		.map((level) => {
			const completion = getLevelCompletion(level.id);
			if (!completion) return `${level.id}: -`;
			return `${level.id}: ${completion}`;
		})
		.join(", ");

	return (
		<aside className="home-debug" aria-label="Development progress controls">
			<div className="home-debug-header">
				<p className="home-debug-title">Debug</p>
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

			<DebugSection title="Unlock preset">
				<UnlockPresetEditor maxLevelId={maxLevelId} />
			</DebugSection>

			<DebugSection title="Level completion">
				<CompletionEditor levelIds={levelIds} />
			</DebugSection>

			<DebugSection title="Reset">
				<div className="home-debug-actions">
					<DebugButton variant="danger" onClick={() => clearAllGameStorage()}>
						Reset all debug data
					</DebugButton>
				</div>
			</DebugSection>
		</aside>
	);
}
