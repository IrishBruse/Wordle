function isLocalhost() {
	if (typeof window === "undefined") return false;
	const { hostname } = window.location;
	return (
		hostname === "localhost" ||
		hostname === "127.0.0.1" ||
		hostname === "[::1]"
	);
}

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
