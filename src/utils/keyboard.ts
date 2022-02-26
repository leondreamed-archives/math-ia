import onetime from 'onetime';
import { outdent } from 'outdent';

export const getKeyboardString = onetime(
	() => outdent`
		$&[{}(=*)+]!#
		;,.pyfgcrl/@\\
		aoeuidhtns-
		'qjkxbmwvz
	`
);

export const getShiftedKeyboardString = onetime(
	() => outdent`
		~%7531902468\`
		:<>PYFGCRL?^|
		AOEUIDHTNS_
		"QJKXBMWVZ
	`
);

export function getKeyboardArray(props?: { shift: boolean }) {
	let keyboardString;
	if (props?.shift) {
		keyboardString = getShiftedKeyboardString();
	} else {
		keyboardString = getKeyboardString();
	}

	return keyboardString.split('\n').map((row) => [...row]);
}

const getShiftedLetterMap = onetime(() => {
	const shiftedLetterMap: Record<string, string> = {};

	const keyboardArray = getKeyboardArray();
	const shiftedKeyboardArray = getKeyboardArray({ shift: true });

	for (const [i, keyboardRow] of keyboardArray.entries()) {
		for (const [j, key] of keyboardRow.entries()) {
			const shiftedKey = shiftedKeyboardArray[i]![j]!;
			shiftedLetterMap[key] = shiftedKey;
		}
	}

	return shiftedLetterMap;
});

export function getShiftedLetter(letter: string) {
	const shiftedLetterMap = getShiftedLetterMap();
	return shiftedLetterMap[letter]!;
}

export function getKeyboardRow(row: 'home' | 'top' | 'bottom' | 'number') {
	const keyboardArray = getKeyboardArray();
	switch (row) {
		case 'number':
			return keyboardArray[0]!;
		case 'top':
			return keyboardArray[1]!;
		case 'home':
			return keyboardArray[2]!;
		case 'bottom':
			return keyboardArray[3]!;
		default:
			throw new Error(`Row ${row as string} not recognized.`);
	}
}

export function includeShiftedLetters(letters: string[]) {
	return [...letters, ...letters.map((letter) => getShiftedLetter(letter))];
}

export const getLeftHandFingerLetters = onetime(() => {
	const index = [...`(yixkup}`];
	const middle = [...`{.ej`];
	const ring = [...`[,oq`];
	const pinky = [...`&;a'$`];
	const thumb = [...' '];

	return {
		index: includeShiftedLetters(index),
		middle: includeShiftedLetters(middle),
		ring: includeShiftedLetters(ring),
		pinky: includeShiftedLetters(pinky),
		thumb,
	};
});

export const getRightHandFingerLetters = onetime(() => {
	const index = [...`=*fghdbm`];
	const middle = [...`)ctw`];
	const ring = [...`+rnv`];
	const pinky = [...`]lsz!#/@\\s-z`];

	return {
		index: includeShiftedLetters(index),
		middle: includeShiftedLetters(middle),
		ring: includeShiftedLetters(ring),
		pinky: includeShiftedLetters(pinky),
	};
});

export const getLeftHandLetters = onetime(() => {
	const unshiftedLeftHandLetters = [...`$&[{}(=;,.pyaoeui'qjkx`];
	return includeShiftedLetters(unshiftedLeftHandLetters);
});

export const getRightHandLetters = onetime(() => {
	const unshiftedRightHandLetters = [...`*)+]!#fgcrl/@\\dhtns-bmwvz`];
	return includeShiftedLetters(unshiftedRightHandLetters);
});
