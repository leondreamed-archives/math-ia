import type {
	WordFeatures,
	FingerLettersDistribution,
} from '~/types/features.js';
import { get1000MostCommonWords } from '~/utils/1000-most-common-words.js';
import {
	getKeyboardRow,
	getLeftHandFingerLetters,
	getLeftHandLetters,
	getRightHandFingerLetters,
	getRightHandLetters,
	getShiftedKeyboardString,
} from '~/utils/keyboard.js';
import { countLetters } from '~/utils/string.js';

// The number of double letters in the word
export function getNumDoubleLetters(word: string): number {
	let numDoubleLetters = 0;
	for (let i = 1; i < word.length; i += 1) {
		if (word[i] === word[i - 1]) {
			numDoubleLetters += 1;
		}
	}

	return numDoubleLetters;
}

export function getWordLength(word: string) {
	return word.length;
}

export function getNumCapitalLetters(word: string) {
	return word.length - word.replace(/[A-Z]/g, '').length;
}

export function getNumShiftedLetters(word: string) {
	const shiftedKeyboardString = getShiftedKeyboardString();
	return countLetters(word, [...shiftedKeyboardString]);
}

export function getNumHomeRowLetters(word: string) {
	const homeRowLetters = getKeyboardRow('home');
	return countLetters(word, homeRowLetters);
}

export function getNumLeftHandLetters(word: string) {
	const leftHandLetters = getLeftHandLetters();
	return countLetters(word, leftHandLetters);
}

export function getNumRightHandLetters(word: string) {
	const rightHandLetters = getRightHandLetters();
	return countLetters(word, rightHandLetters);
}

export function getIsWordCommon(word: string) {
	const top1000mostCommonWords = get1000MostCommonWords();
	const wordLetters = /\w+/.exec(word)?.[0];
	// Word doesn't contain any letters
	if (wordLetters === undefined) {
		return 0;
	}

	return top1000mostCommonWords.includes(wordLetters.toLowerCase()) ? 1 : 0;
}

export function getRightHandFingerLettersDistribution(
	word: string
): FingerLettersDistribution {
	const { index, middle, ring, pinky } = getRightHandFingerLetters();
	return {
		index: countLetters(word, index),
		middle: countLetters(word, middle),
		ring: countLetters(word, ring),
		pinky: countLetters(word, pinky),
	};
}

export function getLeftHandFingerLettersDistribution(
	word: string
): FingerLettersDistribution {
	const { index, middle, ring, pinky } = getLeftHandFingerLetters();
	return {
		index: countLetters(word, index),
		middle: countLetters(word, middle),
		ring: countLetters(word, ring),
		pinky: countLetters(word, pinky),
	};
}

export function getNumConsecutiveFingers(word: string) {
	const rightHandFingerLetters = getRightHandFingerLetters();
	const leftHandFingerLetters = getLeftHandFingerLetters();

	const fingerLetters = [
		['left-index', leftHandFingerLetters.index],
		['left-middle', leftHandFingerLetters.middle],
		['left-ring', leftHandFingerLetters.ring],
		['left-pinky', leftHandFingerLetters.pinky],
		['left-thumb', leftHandFingerLetters.thumb],
		['right-index', rightHandFingerLetters.index],
		['right-middle', rightHandFingerLetters.middle],
		['right-ring', rightHandFingerLetters.ring],
		['right-pinky', rightHandFingerLetters.pinky],
	] as const;

	type Finger =
		| `${'left' | 'right'}-${'index' | 'middle' | 'ring' | 'pinky'}`
		| 'left-thumb';
	let lastFinger: Finger | undefined;
	let consecutiveFingers = 0;
	for (const char of word) {
		let curFinger: Finger | undefined;
		for (const [fingerName, letters] of fingerLetters) {
			if (letters.includes(char)) {
				curFinger = fingerName;
				break;
			}
		}

		if (curFinger === undefined) {
			throw new Error(`Finger for key ${char} not found.`);
		}

		if (curFinger === lastFinger) {
			consecutiveFingers += 1;
		}

		lastFinger = curFinger;
	}

	return consecutiveFingers;
}

export function getWordFeatures(word: string): WordFeatures {
	return {
		isWordCommon: getIsWordCommon(word),
		numCapitalLetters: getNumCapitalLetters(word),
		numConsecutiveFingers: getNumConsecutiveFingers(word),
		numDoubleLetters: getNumDoubleLetters(word),
		numHomeRowLetters: getNumHomeRowLetters(word),
		numLeftHandLetters: getNumLeftHandLetters(word),
		numRightHandLetters: getNumRightHandLetters(word),
		numShiftedLetters: getNumShiftedLetters(word),
		wordLength: getWordLength(word),
	};
}
