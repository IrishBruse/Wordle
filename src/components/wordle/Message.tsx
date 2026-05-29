import type { GameMessage } from "#/game/types";

type MessageProps = {
	message: GameMessage;
};

function messageText(message: GameMessage): string | null {
	switch (message.type) {
		case "none":
			return null;
		case "not-enough-letters":
			return "Not enough letters";
		case "not-in-list":
			return "Not in word list";
		case "won":
			return "Nice!";
		case "lost":
			return message.answer.toUpperCase();
		default:
			return null;
	}
}

export function Message({ message }: MessageProps) {
	const text = messageText(message);
	return (
		<div className="message-slot" aria-live="polite" aria-atomic="true">
			{text ? <p className="message">{text}</p> : null}
		</div>
	);
}
