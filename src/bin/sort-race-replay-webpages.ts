import * as fs from 'node:fs';
import { jsonl } from 'js-jsonl';
import {
	getRaceReplayWebpagesFilePath,
	getRaceReplayWebpagesFilePaths,
} from '~/utils/paths.js';
import type { RaceReplayWebpageData } from '~/types/race-replay-webpage.js';

const raceReplayWebpagesFilePaths = getRaceReplayWebpagesFilePaths();

const webpages1To3000: RaceReplayWebpageData[] = [];
const webpages3001To6000: RaceReplayWebpageData[] = [];
const webpages6001To9000: RaceReplayWebpageData[] = [];

for (const raceReplayWebpagesFilePath of raceReplayWebpagesFilePaths) {
	const raceReplayWebpagesData = jsonl.parse<RaceReplayWebpageData>(
		fs.readFileSync(raceReplayWebpagesFilePath, 'utf-8')
	);

	for (const { raceId, webpageContent } of raceReplayWebpagesData) {
		if (raceId <= 3000) {
			webpages1To3000.push({ raceId, webpageContent });
		} else if (raceId > 3000 && raceId <= 6000) {
			webpages3001To6000.push({ raceId, webpageContent });
		} else {
			webpages6001To9000.push({ raceId, webpageContent });
		}
	}
}

fs.writeFileSync(
	getRaceReplayWebpagesFilePath(1),
	jsonl.stringify(webpages1To3000.sort((a, b) => a.raceId - b.raceId))
);
fs.writeFileSync(
	getRaceReplayWebpagesFilePath(3001),
	jsonl.stringify(webpages3001To6000.sort((a, b) => a.raceId - b.raceId))
);
fs.writeFileSync(
	getRaceReplayWebpagesFilePath(6001),
	jsonl.stringify(webpages6001To9000.sort((a, b) => a.raceId - b.raceId))
);
