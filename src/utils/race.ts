import { got } from 'got';
import type { TyperacerGameResponse } from '~/types/typeracer.js';

export async function getTotalNumRaces() {
	const url =
		'https://data.typeracer.com/games?playerId=tr:leonzalion&universe=play&n=1';
	const response = await got.get(url);
	const data = JSON.parse(response.body) as TyperacerGameResponse[];
	return data[0]?.gn ?? 0;
}

