import { useMemo } from "react";
import { useDebugMode } from "#/game/dev";
import {
	formatMutationChange,
	pickMutatedAnswerDetailsForSeed,
} from "#/game/mutated";
import { getWordLists } from "#/game/words";

type DevAnswerBannerProps = {
	answer: string;
	levelId: number;
	seed: number;
};

export function DevAnswerBanner({
	answer,
	levelId,
	seed,
}: DevAnswerBannerProps) {
	const isDev = useDebugMode();
	const line = useMemo(() => {
		if (!answer) return null;
		if (levelId === 6) {
			const { answers, allowed } = getWordLists();
			const details = pickMutatedAnswerDetailsForSeed(answers, seed, allowed);
			if (details.answer !== answer) return null;
			return formatMutationChange(details);
		}
		return `Answer: ${answer.toUpperCase()}`;
	}, [answer, levelId, seed]);

	if (!isDev || !line) return null;

	return (
		<div className="dev-answer">
			<p className="dev-answer-line">{line}</p>
		</div>
	);
}
