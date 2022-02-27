import fs from 'node:fs';
import { jsonl } from 'js-jsonl';
import jsonlines from 'jsonlines';
import type { TypingLogData, TypingLogKeystroke } from '~/types/typing-log.js';
import { getWordFeatures } from '~/utils/features.js';
import {
	getRaceStatsFilePaths,
	getTypingLogsFilePaths,
} from '~/utils/paths.js';
import { getWpmFromKeystrokes } from '~/utils/typing-log.js';
import type { RaceStatsData } from '~/types/stats.js';

export async function parseRaceStatsFromTypingLogs() {
	const typingLogsFilePath = getTypingLogsFilePaths();

	const typingLogsJsonl = typingLogsFilePath
		.map((filePath) => fs.readFileSync(filePath))
		.join('\n');
	const typingLogsData = jsonl.parse<TypingLogData>(typingLogsJsonl);

	const stringifiers = getRaceStatsFilePaths().map((filePath) => {
		const stringifier = jsonlines.stringify();
		stringifier.pipe(fs.createWriteStream(filePath));
		return stringifier;
	});

	for (const { raceId, typingLog } of typingLogsData) {
		type WordKeystrokes = {
			word: string;
			keystrokes: TypingLogKeystroke[];
		};
		const wordKeystrokes: WordKeystrokes[] = [];

		let curWordKeystrokes: WordKeystrokes | undefined;
		for (let i = 0; i < typingLog.keystrokes.length; i += 1) {
			const keystroke = typingLog.keystrokes[i]!;
			const prevKeystroke = typingLog.keystrokes[i - 1];

			// A keyIndex of 0 represents the start of a new word
			if (
				keystroke.keyIndex === 0 &&
				keystroke.type === 'add' &&
				(prevKeystroke === undefined ||
					(prevKeystroke !== undefined &&
						prevKeystroke.key === ' ' &&
						prevKeystroke.type === 'add')) &&
				curWordKeystrokes !== undefined
			) {
				// We count the space after each word a part of the word that comes before it
				// This is because if you make a typo (e.g. `thee` instead of `the`, you should be penalized for
				// the word "the" instead of the next word because you didn't type the word "the" correctly and added
				// an extra `e`.
				curWordKeystrokes.word = curWordKeystrokes.keystrokes
					.map((keystroke) => keystroke.key)
					.join('');
				wordKeystrokes.push(curWordKeystrokes);
				curWordKeystrokes = undefined;
			}

			if (curWordKeystrokes === undefined) {
				curWordKeystrokes = {
					word: '', // Unknown
					keystrokes: [],
				};
			}

			curWordKeystrokes.keystrokes.push(keystroke);
		}

		if (curWordKeystrokes !== undefined) {
			curWordKeystrokes.word = curWordKeystrokes.keystrokes
				.map((keystroke) => keystroke.key)
				.join('');
			wordKeystrokes.push(curWordKeystrokes);
			curWordKeystrokes = undefined;
		}

		const raceData = { raceId, words: [] } as RaceStatsData;
		// We skip the very first word because it incorporates the start time of the race
		for (const wordKeystroke of wordKeystrokes.slice(1)) {
			// Don't include non 100% accurate words in the data
			if (
				wordKeystroke.keystrokes.some(
					(keystroke) => keystroke.type === 'remove'
				)
			)
				continue;

			const wordFeatures = getWordFeatures(wordKeystroke.word);
			const wordWpm = getWpmFromKeystrokes(wordKeystroke.keystrokes);

			raceData.words.push({
				word: wordKeystroke.word,
				actualWpm: wordWpm,
				features: wordFeatures,
				time: wordKeystroke.keystrokes.reduce(
					(acc, keystroke) => acc + keystroke.deltaTime,
					0
				),
			});
		}

		if (raceId <= 3000) {
			stringifiers[0]!.write(raceData);
		} else if (raceId > 3000 && raceId <= 6000) {
			stringifiers[1]!.write(raceData);
		} else if (raceId > 6000) {
			stringifiers[2]!.write(raceData);
		}
	}

	for (const stringifier of stringifiers) {
		stringifier.end();
	}
}