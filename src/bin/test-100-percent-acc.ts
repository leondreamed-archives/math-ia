/* eslint-disable unicorn/prefer-json-parse-buffer */

import fs from 'node:fs';
import type {
	TyperacerGameResponse,
	TyperacerText,
} from '~/types/typeracer.js';
import { predictText } from '~/utils/predict.js';

// gets 100% accuracy races

const races = JSON.parse(
	fs.readFileSync('data/races.json', 'utf-8')
) as TyperacerGameResponse[];
const perfectRacesStats = races
	.filter((race) => race.ac === 1)
	.map((race) => [race.gn, race.tid, race.wpm] as const);

const texts = JSON.parse(
	fs.readFileSync('data/texts.json', 'utf-8')
) as TyperacerText[];

const raceDates = JSON.parse(
	fs.readFileSync('data/race-dates.json', 'utf-8')
) as Array<{ date: string; raceId: number }>;

const monthlyWpm = JSON.parse(
	fs.readFileSync('data/monthly-wpm.json', 'utf-8')
) as Array<{ averageWpm: number; month: number; year: number }>;

const perfectRaceTexts = perfectRacesStats.map(([raceId, textId, wpm]) => {
	const text = texts.find(({ id }) => id === textId);
	if (text === undefined) {
		throw new Error(`Text with id ${textId} not found`);
	}

	const raceDate = new Date(
		raceDates.find(({ raceId: rid }) => rid === raceId)!.date
	);

	const month = raceDate.getMonth();
	const year = raceDate.getFullYear();

	const y = monthlyWpm.find((x) => x.month === month && x.year === year);
	if (y === undefined) {
		throw new Error(
			`Could not find monthly wpm for month ${month} year ${year}`
		);
	}

	const { averageWpm } = y;

	return {
		predicted: predictText({
			averageWpm,
			text: text.content,
		}),
		actual: wpm,
	};
});

fs.writeFileSync(
	'data/100-ac-predictions.json',
	JSON.stringify(perfectRaceTexts)
);
