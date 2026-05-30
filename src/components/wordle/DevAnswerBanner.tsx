import { useMemo } from "react";
import { useIsLocalhost } from "#/game/dev";
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
	const isDev = useIsLocalhost();
	const mutationLine = useMemo(() => {
		if (levelId !== 6) return null;
		const { answers, allowed } = getWordLists();
		const details = pickMutatedAnswerDetailsForSeed(answers, seed, allowed);
		if (details.answer !== answer) return null;
		return formatMutationChange(details);
	}, [answer, levelId, seed]);

	if (!isDev || !answer) return null;

	const word = answer.toUpperCase();

	return (
		<div className="dev-answer">
			<p className="dev-answer-line">Answer: {word}</p>
			{mutationLine ? <p className="dev-answer-line">{mutationLine}</p> : null}
		</div>
	);
}
