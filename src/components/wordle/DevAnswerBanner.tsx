import { isLocalhost } from "#/game/dev";

type DevAnswerBannerProps = {
	answer: string;
};

export function DevAnswerBanner({ answer }: DevAnswerBannerProps) {
	if (!isLocalhost() || !answer) return null;

	const word = answer.toUpperCase();

	return (
		<p className="dev-answer" aria-label="Development answer">
			Answer: {word}
		</p>
	);
}
