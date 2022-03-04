export type FingerLettersDistribution = {
	index: number;
	middle: number;
	ring: number;
	pinky: number;
};

export type WordFeatures = {
	isWordCommon: number;
	numCapitalLetters: number;
	numDoubleLetters: number;
	numHomeRowLetters: number;
	numLeftHandLetters: number;
	numRightHandLetters: number;
	numShiftedLetters: number;
	wordLength: number;
	numConsecutiveFingers: number;
};

