import fs from 'node:fs';
import { jsonl } from 'js-jsonl';
import { getRaceStatsFilePaths, getWordStatsFilePath } from '~/utils/paths.js';
import type { RaceStatsData } from '~/types/stats.js';
import type { WordFeatures } from '~/types/features.js';

type WordStats = {
	word: string;
	medianWpmRatio: number;
} & WordFeatures;

export function parseWordDataFromRaceStats() {
	const raceStatsFilePaths = getRaceStatsFilePaths();

	const wordToStatsMap = {} as Record<string, WordStats[]>;

	for (const raceStatsFilePath of raceStatsFilePaths) {
		const raceStatsJsonl = fs.readFileSync(raceStatsFilePath, 'utf-8');
		const raceStats = jsonl.parse<RaceStatsData>(raceStatsJsonl);

		// Get average wpm of all words in the race

		for (const raceStat of raceStats) {
			let totalWpm = 0;
			for (const { actualWpm } of raceStat.words) {
				totalWpm += actualWpm;
			}

			const averageWpm = totalWpm / raceStat.words.length;

			for (const { word, actualWpm, features } of raceStat.words) {
				if (wordToStatsMap[word] === undefined) {
					wordToStatsMap[word] = [];
				}

				const wpmRatio = actualWpm / averageWpm;

				wordToStatsMap[word]!.push({
					word,
					medianWpmRatio: wpmRatio,
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

		finalWordStats.push(summaryWordStats);
	}

	fs.writeFileSync(getWordStatsFilePath(), JSON.stringify(finalWordStats));
}
