import { getNumDoubleLetters, getNumNumbers } from '~/utils/features.js';

test('double letters', () => {
	expect(getNumDoubleLetters('hello')).toEqual(1);
	expect(getNumDoubleLetters('nothing')).toEqual(0);
	expect(getNumDoubleLetters('subbookkeeper')).toEqual(4);
	expect(getNumDoubleLetters('bittersweet')).toEqual(2);
});

test('double letters', () => {
	expect(getNumNumbers('245')).toEqual(3);
	expect(getNumNumbers('nothing')).toEqual(0);
	expect(getNumNumbers('a2+3[4')).toEqual(3);
});
