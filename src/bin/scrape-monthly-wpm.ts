import fs from 'node:fs';
import { got } from 'got';
import cheerio from 'cheerio';
import { getMonthlyWpmFilePath } from '~/utils/paths.js';

const response = await got.get(
	'https://typeracerdata.com/profile?username=leonzalion'
);

const $ = cheerio.load(response.body);

const monthlyWpm: Array<{
	month: number; // 0-11
	year: number;
	averageWpm: number;
}> = [];

$("h3:contains('Career')")
	.next()
	.find('tbody')
	.children()
	.slice(1)
	.each(function () {
		const th = $(this).children();
		const date = new Date(th.eq(0).text());
		const averageWpm = Number(th.eq(1).text());

		monthlyWpm.push({
			averageWpm,
			month: date.getMonth(),
			year: date.getFullYear(),
		});
	});

fs.writeFileSync(getMonthlyWpmFilePath(), JSON.stringify(monthlyWpm));
