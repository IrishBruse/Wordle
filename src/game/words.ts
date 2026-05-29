import { WORD_LIST } from "./word-list";

const ANSWER_POOL_SIZE = 2315;

let allowedWords: Set<string> | null = null;
let answerPool: string[] | null = null;

export function getWordLists(): {
	allowed: Set<string>;
	answers: string[];
} {
	if (allowedWords && answerPool) {
		return { allowed: allowedWords, answers: answerPool };
	}

	allowedWords = new Set(WORD_LIST);
	answerPool = WORD_LIST.slice(0, ANSWER_POOL_SIZE);

	return { allowed: allowedWords, answers: answerPool };
}
