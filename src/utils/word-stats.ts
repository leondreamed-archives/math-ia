import fs from 'node:fs';
import { jsonl } from 'js-jsonl';
import jsonlines from 'jsonlines';
import { getRaceStatsFilePaths, getWordStatsFilePath } from '~/utils/paths.js';
import type { RaceStatsData } from '~/types/stats.js';
import type { WordFeatures } from '~/types/features.js';

type WordStats = {
	word: string;
	medianWpm: number;
} & WordFeatures;

export function parseWordDataFromRaceStats() {
	const raceStatsFilePaths = getRaceStatsFilePaths();

	const wordToStatsMap = {} as Record<string, WordStats[]>;

	for (const raceStatsFilePath of raceStatsFilePaths) {
		const raceStatsJsonl = fs.readFileSync(raceStatsFilePath, 'utf-8');
		const raceStats = jsonl.parse<RaceStatsData>(raceStatsJsonl);

		for (const raceStat of raceStats) {
			for (const { word, actualWpm, features } of raceStat.words) {
				if (wordToStatsMap[word] === undefined) {
					wordToStatsMap[word] = [];
				}

				wordToStatsMap[word]!.push({
					word,
					medianWpm: actualWpm,
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
			(a, b) => a.medianWpm - b.medianWpm
		);

		let medianWpm;
		if (sortedStatsByWpms.length % 2 === 0) {
			medianWpm =
				(sortedStatsByWpms[sortedStatsByWpms.length / 2 - 1]!.medianWpm +
					sortedStatsByWpms[sortedStatsByWpms.length / 2]!.medianWpm) /
				2;
		} else {
			medianWpm =
				sortedStatsByWpms[Math.floor(sortedStatsByWpms.length / 2)]!.medianWpm;
		}

		summaryWordStats.medianWpm = medianWpm;

		finalWordStats.push(summaryWordStats);
	}

	const stringifier = jsonlines.stringify();
	stringifier.pipe(fs.createWriteStream(getWordStatsFilePath()));
	for (const wordStats of finalWordStats) {
		stringifier.write(wordStats);
	}

	stringifier.end();
}
