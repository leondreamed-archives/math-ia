import * as fs from 'node:fs';
import { jsonl } from 'js-jsonl';
import jsonlines from 'jsonlines';
import {
	getRawTypingLogsFilePath,
	getTypingLogsFilePaths,
} from '~/utils/paths.js';
import { parseRawTypingLog } from '~/utils/typing-log.js';
import type { RawTypingLogData } from '~/types/typing-log.js';

const rawTypingLogsFilePath = getRawTypingLogsFilePath();
// Read the typing logs file
const rawTypingLogsJsonl = fs.readFileSync(rawTypingLogsFilePath, 'utf-8');
const rawTypingLogsData = jsonl.parse<RawTypingLogData>(rawTypingLogsJsonl);

const stringifiers = getTypingLogsFilePaths().map((filePath) => {
	const stringifier = jsonlines.stringify();
	stringifier.pipe(fs.createWriteStream(filePath));
	return stringifier;
});

for (const rawTypingLogData of rawTypingLogsData) {
	const typingLog = parseRawTypingLog(rawTypingLogData);

	if (rawTypingLogData.raceId <= 3000) {
		stringifiers[0]!.write(typingLog);
	} else if (
		rawTypingLogData.raceId > 3000 &&
		rawTypingLogData.raceId <= 6000
	) {
		stringifiers[1]!.write(typingLog);
	} else if (rawTypingLogData.raceId > 6000 && rawTypingLogData.raceId < 9000) {
		stringifiers[2]!.write(typingLog);
	}
}

for (const stringifier of stringifiers) {
	stringifier.end();
}
