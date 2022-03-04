/* eslint-disable unicorn/numeric-separators-style */

import inquirer from 'inquirer';
import { getWordFeatures } from '~/utils/features.js';

const finalWeights = [
	-0.07200872660362857, // word_length
	-0.0028186947204240816, // num_capital_letters
	-0.0887768900289833, // num_consecutive_fingers
	0.028094111732003876, // num_double_letters
	0.0012641055456548735, // num_home_row_letters
	0.05252760479202044, // num_left_hand_letters
	0.07245468464334391, // num_right_hand_letters
	-0.18397703898381226, // num_shifted_letters
	0.07311495969371014, // is_word_common
	1.252027666643374, // bias
];

const { word } = await inquirer.prompt<{ word: string }>({
	name: 'word',
	message: 'Please enter a word:',
	type: 'input',
});

function calculateWPMRatio(word: string) {
	const features = getWordFeatures(word);

	const {
		isWordCommon,
		numCapitalLetters,
		numConsecutiveFingers,
		numDoubleLetters,
		numHomeRowLetters,
		numLeftHandLetters,
		numRightHandLetters,
		numShiftedLetters,
		wordLength,
	} = features;

	return (
		wordLength * finalWeights[0]! +
		numCapitalLetters * finalWeights[1]! +
		numConsecutiveFingers * finalWeights[2]! +
		numDoubleLetters * finalWeights[3]! +
		numHomeRowLetters * finalWeights[4]! +
		numLeftHandLetters * finalWeights[5]! +
		numRightHandLetters * finalWeights[6]! +
		numShiftedLetters * finalWeights[7]! +
		isWordCommon * finalWeights[8]! +
		finalWeights[9]!
	);
}

console.log(calculateWPMRatio(word));
