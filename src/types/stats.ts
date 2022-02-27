import type { WordFeatures } from '~/types/features.js';

export type RaceStatsData = {
	raceId: number;
	words: Array<{
		word: string;
		features: WordFeatures;
		actualWpm: number;
		time: number;
	}>;
};

export type WordStats = {
	word: string;
	medianWpmRatio: number;
} & WordFeatures;
