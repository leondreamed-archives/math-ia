import fs from 'node:fs';
import cheerio from 'cheerio';
import { jsonl } from 'js-jsonl';
import {
	getRaceDatesFilePath,
	getRaceReplayWebpagesFilePaths,
} from '~/utils/paths.js';
import type { RaceReplayWebpageData } from '~/types/race-replay-webpage.js';

const raceDates: Array<{ raceId: number; date: Date }> = [];
for (const filePath of getRaceReplayWebpagesFilePaths()) {
	const webpagesData = jsonl.parse<RaceReplayWebpageData>(
		fs.readFileSync(filePath, 'utf-8')
	);
	for (const { raceId, webpageContent } of webpagesData) {
		const $ = cheerio.load(webpageContent);
		const dateString = $("td:contains('Date')").next().text();
		raceDates.push({
			date: new Date(dateString),
			raceId,
		});
	}
}

fs.writeFileSync(getRaceDatesFilePath(), JSON.stringify(raceDates));
