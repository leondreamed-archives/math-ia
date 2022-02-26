export type FingerLettersDistribution = {
	index: number;
	middle: number;
	ring: number;
	pinky: number;
};

export type WordFeatures = {
	isWordCommon: number;
	leftHandFingerLettersDistribution: FingerLettersDistribution;
	numCapitalLetters: number;
	numDoubleLetters: number;
	numHomeRowLetters: number;
	numLeftHandLetters: number;
	numNumbers: number;
	numRightHandLetters: number;
	numShiftedLetters: number;
	numRightHandFingerLettersDistribution: number;
	wordLength: number;
	numConsecutiveFingers: number;
};
