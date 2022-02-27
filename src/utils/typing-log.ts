import * as fs from 'node:fs';
import jsonlines from 'jsonlines';
import { getRawTypingLogsFilePath } from '~/utils/paths.js';
import type {
	TypingLog,
	RawTypingLogData,
	TypingLogData,
	TypingLogKeystroke,
} from '~/types/typing-log.js';
import { getRaceReplayWebpagesData } from '~/utils/race-replay-webpage.js';

export async function extractRawTypingLogsFromWebpageData() {
	const raceReplayWebpagesData = await getRaceReplayWebpagesData();

	const rawTypingLogsFilePath = getRawTypingLogsFilePath();
	if (!fs.existsSync(rawTypingLogsFilePath)) {
		await fs.promises.writeFile(rawTypingLogsFilePath, '');
	}

	const stringifier = jsonlines.stringify();
	stringifier.pipe(fs.createWriteStream(rawTypingLogsFilePath));

	for (const { raceId, webpageContent } of raceReplayWebpagesData) {
		const typingLogRaw = /typingLog = (.*);.*$/m.exec(webpageContent)?.[1];

		if (typingLogRaw === undefined) {
			console.warn(`Could not find typingLog for race with ID ${raceId}`);
			return { raceId, rawTypingLog: '' };
		}

		const rawTypingLog = JSON.parse(typingLogRaw) as string;

		stringifier.write({
			raceId,
			rawTypingLog,
		});
	}

	stringifier.end();
}

export function parseRawTypingLog({
	raceId,
	rawTypingLog,
}: RawTypingLogData): TypingLogData {
	const typingLog: TypingLog = {
		keystrokes: [],
		keyTimes: [],
	};
	let [keyTimesString, keystrokesString] = rawTypingLog.split('|');
	keyTimesString = keyTimesString?.replace(/^TLv1,.*?,\d+,/, '');

	const keyTimeRegex = /(.)(\d+)/g;

	const keyTimeMatches = keyTimesString?.matchAll(keyTimeRegex);

	if (keyTimeMatches === undefined) {
		console.warn(`Invalid times string: ${keyTimesString ?? 'undefined'}`);
		return {
			raceId,
			typingLog,
		};
	}

	for (const keyTimeMatch of keyTimeMatches) {
		typingLog.keyTimes.push({
			deltaTime: Number(keyTimeMatch[2]),
			key: keyTimeMatch[1]!,
		});
	}

	const keystrokePatternRegex = /(\d+),(\d+)([+\-$])(.)/g;

	const keystrokeMatches = keystrokesString?.matchAll(keystrokePatternRegex);

	if (keystrokeMatches === undefined) {
		console.warn(
			`Invalid keystroke string: ${keystrokesString ?? 'undefined'}`
		);
		return {
			raceId,
			typingLog,
		};
	}

	for (const keystrokeMatch of keystrokeMatches) {
		typingLog.keystrokes.push({
			deltaTime: Number(keystrokeMatch[1]!),
			keyIndex: Number(keystrokeMatch[2]),
			type: keystrokeMatch[3] === '+' ? 'add' : 'remove',
			key: keystrokeMatch[4]!,
		});
	}

	return {
		raceId,
		typingLog,
	};
}

export function convertCharactersPerMillisecondToWordsPerMinute(
	charactersPerMillisecond: number
) {
	const charactersPerSecond = charactersPerMillisecond * 1000;
	const charactersPerMinute = charactersPerSecond * 60;
	// 1 cpm = 0.2 wpm
	const wordsPerMinute = charactersPerMinute / 5;
	return wordsPerMinute;
}

export function getWpmFromKeystrokes(keystrokes: TypingLogKeystroke[]) {
	let totalTimeMilliseconds = 0;
	for (const keystroke of keystrokes) {
		totalTimeMilliseconds += keystroke.deltaTime;
	}

	const numChars = keystrokes.length;

	const charactersPerMillisecond = numChars / totalTimeMilliseconds;
	return convertCharactersPerMillisecondToWordsPerMinute(
		charactersPerMillisecond
	);
}
