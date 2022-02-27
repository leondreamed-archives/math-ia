import fs from 'node:fs';
import type { WordStats } from '~/types/stats';
import { getWordStatsFilePath } from '~/utils/paths.js';

const wordStats = JSON.parse(
	fs.readFileSync(getWordStatsFilePath()).toString()
) as WordStats[];

for (const wordStat of wordStats) {
	if (wordStat.medianWpmRatio < 0.5) {
		console.log(wordStat.word, wordStat.dataPoints)
	}
}
