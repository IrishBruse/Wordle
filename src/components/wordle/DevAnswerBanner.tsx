import { useIsLocalhost } from "#/game/dev";

type DevAnswerBannerProps = {
	answer: string;
};

export function DevAnswerBanner({ answer }: DevAnswerBannerProps) {
	const isDev = useIsLocalhost();
	if (!isDev || !answer) return null;

	const word = answer.toUpperCase();

	return <p className="dev-answer">Answer: {word}</p>;
}
