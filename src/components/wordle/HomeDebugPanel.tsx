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
import {
	useIsLevelUnlocked,
	useLevelCompletion,
	useMaxUnlockedLevel,
} from "#/game/useProgress";
import { getWordLists } from "#/game/words";
import { getNumberedLevels } from "#/levels";

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

function LevelUnlockButton({ levelId }: { levelId: number }) {
	const maxUnlocked = useMaxUnlockedLevel();
	const isUnlocked = levelId === 0 || levelId <= maxUnlocked;

	return (
		<button
			type="button"
			className={
				isUnlocked
					? "home-debug-level-btn home-debug-level-btn-unlocked"
					: "home-debug-level-btn"
			}
			aria-pressed={isUnlocked}
			aria-label={`Unlock through level ${levelId}`}
			onClick={() => setMaxUnlockedLevel(levelId)}
		>
			{levelId}
		</button>
	);
}

function UnlockControls({
	maxLevelId,
	levelIds,
}: {
	maxLevelId: number;
	levelIds: number[];
}) {
	return (
		<div className="home-debug-unlock">
			<p className="home-debug-hint">Presets</p>
			<div className="home-debug-actions">
				<DebugButton onClick={() => setMaxUnlockedLevel(0)}>
					Fresh start
				</DebugButton>
				<DebugButton onClick={() => debugFinishLevelZero()}>
					After tutorial
				</DebugButton>
				<DebugButton onClick={() => setMaxUnlockedLevel(maxLevelId)}>
					Unlock all
				</DebugButton>
			</div>
			<p className="home-debug-hint">Unlock through level (tap to set)</p>
			<div
				className="home-debug-level-grid"
				role="group"
				aria-label="Unlock through level"
			>
				{levelIds.map((id) => (
					<LevelUnlockButton key={id} levelId={id} />
				))}
			</div>
		</div>
	);
}

function LevelCompletionToggle({ levelId }: { levelId: number }) {
	const unlocked = useIsLevelUnlocked(levelId);
	const completion = useLevelCompletion(levelId);
	const isComplete = completion !== null;

	if (!unlocked) {
		return (
			<button
				type="button"
				className="home-debug-level-btn home-debug-level-btn-disabled"
				disabled
				aria-label={`Level ${levelId} locked`}
			>
				{levelId}
			</button>
		);
	}

	return (
		<button
			type="button"
			className={
				isComplete
					? "home-debug-level-btn home-debug-level-btn-done"
					: "home-debug-level-btn"
			}
			aria-pressed={isComplete}
			aria-label={`Level ${levelId} ${isComplete ? "complete" : "open"}`}
			onClick={() => setLevelCompletion(levelId, isComplete ? null : "clean")}
		>
			{levelId}
		</button>
	);
}

function LevelCompletionGrid({ levelIds }: { levelIds: number[] }) {
	return (
		<div>
			<p className="home-debug-hint">Tap a level to toggle complete / open</p>
			<div
				className="home-debug-level-grid"
				role="group"
				aria-label="Level completion"
			>
				{levelIds.map((id) => (
					<LevelCompletionToggle key={id} levelId={id} />
				))}
			</div>
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

			<DebugSection title="Unlock">
				<UnlockControls maxLevelId={maxLevelId} levelIds={levelIds} />
			</DebugSection>

			<DebugSection title="Level completion">
				<LevelCompletionGrid levelIds={levelIds} />
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
