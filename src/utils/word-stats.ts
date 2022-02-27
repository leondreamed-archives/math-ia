import fs from 'node:fs';
import { jsonl } from 'js-jsonl';
import {
	getMonthlyWpmFilePath,
	getRaceDatesFilePath,
	getRaceStatsFilePaths,
	getWordStatsFilePath,
} from '~/utils/paths.js';
import type { RaceStatsData, WordStats } from '~/types/stats.js';

const monthlyWpmData = JSON.parse(
	fs.readFileSync(getMonthlyWpmFilePath()).toString()
) as Array<{ month: number; year: number; averageWpm: number }>;

const raceDates = JSON.parse(
	fs.readFileSync(getRaceDatesFilePath()).toString()
) as Array<{ raceId: number; date: string }>;

const raceIdToDate = Object.fromEntries(
	raceDates.map(({ date, raceId }) => [raceId, new Date(date)])
);

export function parseWordDataFromRaceStats() {
	const raceStatsFilePaths = getRaceStatsFilePaths();

	const wordToStatsMap = {} as Record<string, WordStats[]>;

	for (const raceStatsFilePath of raceStatsFilePaths) {
		const raceStatsJsonl = fs.readFileSync(raceStatsFilePath, 'utf-8');
		const raceStats = jsonl.parse<RaceStatsData>(raceStatsJsonl);

		for (const raceStat of raceStats) {
			const raceDate = raceIdToDate[raceStat.raceId];
			if (raceDate === undefined) {
				throw new Error(`Date for race ${raceStat.raceId} not found.`);
			}

			const result = monthlyWpmData.find(
				({ month, year }) =>
					month === raceDate.getMonth() && year === raceDate.getFullYear()
			);

			if (result === undefined) {
				console.error(
					`Unknown monthly wpm for month ${raceDate.getMonth()} and year ${raceDate.getFullYear()}, ${
						raceStat.raceId
					}`
				);
				continue;
			}

			const { averageWpm } = result;

			for (const { word, actualWpm, features } of raceStat.words) {
				if (wordToStatsMap[word] === undefined) {
					wordToStatsMap[word] = [];
				}

				const wpmRatio = actualWpm / averageWpm;

				wordToStatsMap[word]!.push({
					word,
					medianWpmRatio: wpmRatio,
					dataPoints: 0,
					...features,
				});
			}
		}
	}

	const finalWordStats: WordStats[] = [];
	// Fix the medianWpm
	for (const [_word, stats] of Object.entries(wordToStatsMap)) {
		const summaryWordStats = { ...stats[0] } as WordStats;
		const sortedStatsByWpms = [...stats].sort(
			(a, b) => a.medianWpmRatio - b.medianWpmRatio
		);

		let medianWpmRatio;
		if (sortedStatsByWpms.length % 2 === 0) {
			medianWpmRatio =
				(sortedStatsByWpms[sortedStatsByWpms.length / 2 - 1]!.medianWpmRatio +
					sortedStatsByWpms[sortedStatsByWpms.length / 2]!.medianWpmRatio) /
				2;
		} else {
			medianWpmRatio =
				sortedStatsByWpms[Math.floor(sortedStatsByWpms.length / 2)]!
					.medianWpmRatio;
		}

		summaryWordStats.medianWpmRatio = medianWpmRatio;
		summaryWordStats.dataPoints = stats.length;

		finalWordStats.push(summaryWordStats);
	}

	fs.writeFileSync(getWordStatsFilePath(), JSON.stringify(finalWordStats));
}
