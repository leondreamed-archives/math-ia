import { convertCharactersPerMillisecondToWordsPerMinute } from '~/utils/typing-log.js';

test('converting characters per millisecond to words per minute works', () => {
	expect(convertCharactersPerMillisecondToWordsPerMinute(0)).toEqual(0);
	expect(convertCharactersPerMillisecondToWordsPerMinute(0.001)).toEqual(12);
});
