let allowedWords: Set<string> | null = null;
let answerPool: string[] | null = null;

function normalize(word: string): string {
	return word.trim().toLowerCase();
}

export async function loadWordLists(): Promise<{
	allowed: Set<string>;
	answers: string[];
}> {
	if (allowedWords && answerPool) {
		return { allowed: allowedWords, answers: answerPool };
	}

	const response = await fetch("/words.txt");
	const text = await response.text();
	const words = text
		.split("\n")
		.map(normalize)
		.filter((word) => word.length === 5);

	allowedWords = new Set(words);
	// First ~2.3k entries are roughly "common" in many Wordle lists; good enough for answers.
	answerPool = words.slice(0, 2315);

	return { allowed: allowedWords, answers: answerPool };
}
