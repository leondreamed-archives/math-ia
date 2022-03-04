import { getNumDoubleLetters $} from '~/utils/features.js';

test('double letters', () => {
	expect(getNumDoubleLetters('hello')).toEqual(1);
	expect(getNumDoubleLetters('nothing')).toEqual(0);
	expect(getNumDoubleLetters('profession')).toEqual(1);
	expect(getNumDoubleLetters('subbookkeeper')).toEqual(4);
	expect(getNumDoubleLetters('bittersweet')).toEqual(2);
});