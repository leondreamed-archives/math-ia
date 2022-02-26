import * as fs from 'node:fs';
import { setTimeout } from 'node:timers/promises';
import { got } from 'got';
import pThrottle from 'p-throttle';
import { jsonl } from 'js-jsonl';
import jsonlines from 'jsonlines';
import { getRaceReplayWebpagesFilePaths } from '~/utils/paths.js';
import { getTotalNumRaces } from '~/utils/race.js';
import type { RaceReplayWebpageData } from '~/types/race-replay-webpage.js';

export async function getRaceReplayWebpagesData() {
	const raceReplayWebpagesFilePaths = getRaceReplayWebpagesFilePaths();

	const raceReplayWebpagesData: RaceReplayWebpageData[] = [];
	for (const raceReplayWebpagesFilePath of raceReplayWebpagesFilePaths) {
		// eslint-disable-next-line no-await-in-loop
		const raceReplayWebpagesJsonl = await fs.promises.readFile(
			raceReplayWebpagesFilePath,
			'utf-8'
		);
		const raceReplayWebpages = jsonl.parse<RaceReplayWebpageData>(
			raceReplayWebpagesJsonl
		);
		raceReplayWebpagesData.push(...raceReplayWebpages);
	}

	return raceReplayWebpagesData;
}

export async function scrapeRaceReplayWebpage(
	raceId: number
): Promise<RaceReplayWebpageData> {
	console.log(raceId);
	const url = `https://data.typeracer.com/pit/result?id=|tr:leonzalion|${raceId}`;

	let webpageContent: string;
	try {
		const response = await got.get(url);
		webpageContent = response.body;
	} catch {
		// Wait 2 seconds before trying again
		await setTimeout(2000);
		return scrapeRaceReplayWebpage(raceId);
	}

	return {
		raceId,
		webpageContent,
	};
}

export async function scrapeRaceReplayWebpages({
	startRaceId,
}: {
	startRaceId: number;
}) {
	// Retrieve the race IDs that are already in the JSONL file
	const raceReplayWebpagesFilePaths = getRaceReplayWebpagesFilePaths();

	const existingRaceIdsArray = [];
	// Creating the race replay webpages if they don't already exist
	for (const raceReplayWebpagesFilePath of raceReplayWebpagesFilePaths) {
		if (fs.existsSync(raceReplayWebpagesFilePath)) {
			// eslint-disable-next-line no-await-in-loop
			const raceReplayWebpagesJsonl = await fs.promises.readFile(
				raceReplayWebpagesFilePath,
				'utf-8'
			);
			const raceReplayWebpages = jsonl.parse<RaceReplayWebpageData>(
				raceReplayWebpagesJsonl
			);
			existingRaceIdsArray.push(
				...raceReplayWebpages.map(({ raceId }) => raceId)
			);
		} else {
			// eslint-disable-next-line no-await-in-loop
			await fs.promises.writeFile(raceReplayWebpagesFilePath, '');
		}
	}

	const stringifiers: jsonlines.Stringifier[] = [];
	for (const raceReplayWebpagesFilePath of raceReplayWebpagesFilePaths) {
		const stringifier = jsonlines.stringify();
		stringifier.pipe(
			fs.createWriteStream(raceReplayWebpagesFilePath, { flags: 'a' })
		);
		stringifiers.push(stringifier);
	}

	function getJsonlinesStringifer(raceId: number) {
		if (raceId <= 3000) {
			return stringifiers[0]!;
		} else if (raceId > 3000 && raceId <= 6000) {
			return stringifiers[1]!;
		} else {
			return stringifiers[2]!;
		}
	}

	const existingRaceIds = new Set(existingRaceIdsArray);

	const mostRecentRaceId = await getTotalNumRaces();
	const throttle = pThrottle({
		limit: 1,
		interval: 2000,
	});

	const throttledScrapeRaceReplayWebpage = throttle(async (raceId: number) =>
		scrapeRaceReplayWebpage(raceId)
	);

	const raceReplayWebpagesPromises = [];
	const raceIdsToScrape: number[] = [];
	for (let raceId = startRaceId; raceId <= mostRecentRaceId; raceId += 1) {
		if (!existingRaceIds.has(raceId)) {
			raceIdsToScrape.push(raceId);
			raceReplayWebpagesPromises.push(
				(async () => {
					const data = await throttledScrapeRaceReplayWebpage(raceId);
					getJsonlinesStringifer(raceId).write(data);
				})()
			);
		}
	}

	console.info(`Scraping races ${raceIdsToScrape.join(', ')}`);

	for (const raceReplayWebpagePromise of raceReplayWebpagesPromises) {
		// Doing this in a loop so the races stay sorted
		// eslint-disable-next-line no-await-in-loop
		await raceReplayWebpagePromise;
	}

	for (const stringifier of stringifiers) {
		stringifier.end();
	}
}
