import fs from 'node:fs';
import type { WordStats } from '~/types/stats';
import { getWordStatsFilePath } from '~/utils/paths.js';

const wordStats = JSON.parse(
	fs.readFileSync(getWordStatsFilePath()).toString()
) as WordStats[];

console.log(wordStats.length);
const bounds = {
	5: [1.9, 2.4],
	6: [1.8, 2.1],
	7: [1.7, 1.9],
	8: [1.6, 1.8],
	9: [1.5, 1.7],
	10: [1.4, 1.6],
	11: [1.3, 1.5],
	12: [1.2, 1.4],
	13: [1.1, 1.3],
	14: [1, 1.2],
	15: [0.95, 1.1],
	16: [0.9, 1],
	17: [0.8, 0.95],
	18: [0.7, 0.9],
} as const;

const wordData = [];

for (let i = 5; i <= 18; i += 1) {
	const [lower, upper] = bounds[i as keyof typeof bounds];
	const words = wordStats
		.filter((w) => w.wordLength === i)
		.filter(
			(word) => word.medianWpmRatio > lower && word.medianWpmRatio < upper
		);

	wordData.push(...words);
	console.log(words.map((w) => w.word));
}

fs.writeFileSync('data/selected-word-stats.json', JSON.stringify(wordData));
