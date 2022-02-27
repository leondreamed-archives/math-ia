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
				if (word === 'see,boys ') {
					console.log('monke', raceStat.raceId)
				}

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

"TLv1,en,284,S140o134m71e73t95i138m13e1634s7 95y58o85u59 58n112e56v93e65r49 56f89e63e153l40 95m73e29a67n30e111r65 82t78h51a28n82 57t109h51e22 49m113o30m1736e963n45t50 60y48o82u50 33s91t30o61p105 88b104e46i83n79g38 59m110e49a49n61.64 58I129t93'106s88 70l91i70k119e27 63h69o67w70 72t82u48r105n127i56n113g37 65o89n77 51a88 116l121i83g64h156t12 37m139a29k99e63s48 77y60o70u65 39r99e47a48l63i111z100e111 80h156o131w70 856d114a89r46k106 63t94h42e38 56r428o143o152m29 107h64a112d439 93g113o51t101t139e20n569.91 63A71n81d48 24t110h31e59 31w106a45y42 56y145o69u72 33u130s104u86a66l56l1761y38 793a104c110t130,14 71t107h45e31 52t127h33i88n57g67s35 32y57o98u68 23w83o101u15l17d83 62h106a60v83e84 41n53o101r49m134a79l45l132y296 106d112o79n24e90,62 56a48r81e108 61l91i65k102e54 42t63h37e50s119e38 65g115h536o95s88t64s96 62t130h56a25t119 48e128v13e144r24y115o80n95e71 58c80a80n56 80s70e90e152 1255b288u65t133 64p74r241e70t1339e91n104d29s55 122n114o68t115 115t154o582.80|0,23,140,0+S,134,1+o,71,2+m,73,3+e,95,4+t,138,5+i,13,6+m,171,7+s,15,8+e,112,9+ ,48,10+y,104,11+o,322,0-S0-o0-m0-e0-t0-i0-m0-s0-e0- 0-y0-o,287,0+S,85,1+o,106,2+m,40,3+e,104,4+t,79,5+i,83,6+m,78,7+e,7,8+s,95,9+ ,10,4,58,0+y,85,1+o,59,2+u,58,3+ ,14,6,112,0+n,56,1+e,93,2+v,65,3+e,49,4+r,56,5+ ,20,5,89,0+f,63,1+e,153,1+e,40,3+l,95,4+ ,25,7,73,0+m,29,1+e,67,2+a,30,3+n,111,4+e,65,5+r,82,6+ ,32,5,78,0+t,51,1+h,28,2+a,82,3+n,57,4+ ,37,4,109,0+t,51,1+h,22,2+e,49,3+ ,41,28,113,0+m,30,1+o,168,2+e,64,3+n,66,4+t,70,5+s,161,5-s,160,4-t,242,0-m0-o0-e0-n,84,0+m,67,1+e,200,2+m,223,2-m,144,1-e,57,1+o,30,2+m,95,3+o,7,4+e,116,5+n,56,6+t,215,6-t,144,5-n,150,4-e,155,3-o,25,3+e,45,4+n,50,5+t,60,6+ ,48,4,48,0+y,82,1+o,50,2+u,33,3+ ,52,5,91,0+s,30,1+t,61,2+o,105,3+p,88,4+ ,57,6,104,0+b,46,1+e,83,2+i,79,3+n,38,4+g,59,5+ ,63,6,110,0+m,49,1+e,49,2+a,61,3+n,64,4+.,58,5+ ,69,5,129,0+I,93,1+t,106,2+',88,3+s,70,4+ ,74,5,91,0+l,70,1+i,119,2+k,27,3+e,63,4+ ,79,4,69,0+h,67,1+o,70,2+w,72,3+ ,83,8,82,0+t,48,1+u,105,2+r,127,3+n,56,4+i,113,5+n,37,6+g,65,7+ ,91,3,89,0+o,77,1+n,51,2+ ,94,2,88,0+a,116,1+ ,96,6,121,0+l,83,1+i,64,2+g,156,3+h,12,4+t,37,5+ ,102,6,139,0+m,29,1+a,99,2+k,63,3+e,48,4+s,77,5+ ,108,4,60,0+y,70,1+o,65,2+u,39,3+ ,112,8,99,0+r,47,1+e,48,2+a,63,3+l,111,4+i,100,5+z,111,6+e,80,7+ ,120,8,156,0+h,131,1+o,70,2+w,161,2-w,297,1+o,271,1-o,88,2+w,39,3+ ,124,5,114,0+d,89,1+a,46,2+r,106,3+k,63,4+ ,129,4,94,0+t,42,1+h,38,2+e,56,3+ ,133,7,162,0+m,215,0-m,51,0+r,143,1+o,152,1+o,29,3+m,107,4+ ,138,6,64,0+h,112,1+a,119,1+a,239,1-a,81,2+d,93,3+ ,142,12,113,0+g,51,1+o,101,2+t,139,2+t,20,4+e,148,5+.,29,6+n,209,6-n,144,5-.,39,5+n,91,6+.,63,7+ ,150,4,71,0+A,81,1+n,48,2+d,24,3+ ,154,4,110,0+t,31,1+h,59,2+e,31,3+ ,158,4,106,0+w,45,1+a,42,2+y,56,3+ ,162,4,145,0+y,69,1+o,72,2+u,33,3+ ,166,25,130,0+u,104,1+s,86,2+u,66,3+a,56,4+l,126,5+y,15,6+l,75,7+ ,95,8+a,15,9+c,169,10+t,89,10-t,254,0-u0-s0-u0-a0-l0-y0-l0- 0-a0-c,138,0+a,215,0-a,88,0+u,128,1+s,81,2+u,70,3+a,71,4+l,132,4+l,38,6+y,65,7+,,334,7-,,394,7+ ,174,5,104,0+a,110,1+c,130,2+t,14,3+,,71,4+ ,179,4,107,0+t,45,1+h,31,2+e,52,3+ ,183,7,127,0+t,33,1+h,88,2+i,57,3+n,67,4+g,35,5+s,32,6+ ,190,4,57,0+y,98,1+o,68,2+u,23,3+ ,194,6,83,0+w,101,1+o,15,2+u,17,3+l,83,4+d,62,5+ ,200,5,106,0+h,60,1+a,83,2+v,84,3+e,41,4+ ,205,9,53,0+n,101,1+o,49,2+r,134,3+m,79,4+a,45,5+l,132,5+l,296,7+y,106,8+ ,214,6,112,0+d,79,1+o,24,2+n,90,3+e,62,4+,,56,5+ ,220,4,48,0+a,81,1+r,108,2+e,61,3+ ,224,5,91,0+l,65,1+i,102,2+k,54,3+e,42,4+ ,229,6,63,0+t,37,1+h,50,2+e,119,3+s,38,4+e,65,5+ ,235,9,115,0+g,77,1+o,383,1-o,76,1+h,95,2+o,88,3+s,64,4+t,96,5+s,62,6+ ,242,5,130,0+t,56,1+h,25,2+a,119,3+t,48,4+ ,247,9,128,0+e,13,1+v,144,2+e,24,3+r,115,4+y,80,5+o,95,6+n,71,7+e,58,8+ ,256,4,80,0+c,80,1+a,56,2+n,80,3+ ,260,13,70,0+s,90,1+e,152,1+e,88,3+b,14,4+ ,122,5+u,14,6+t,162,7+ ,400,0-s0-e0-e0-b0- 0-u0-t0- ,128,0+s,120,1+e,152,1+e,55,3+ ,264,4,288,0+b,65,1+u,133,2+t,64,3+ ,268,17,74,0+p,241,1+r,70,2+e,242,3+n,201,4+e,83,5+t,108,6+s,176,6-s,151,5-t,168,4-e,145,3-n,65,3+t,91,4+e,104,5+n,29,6+d,55,7+s,122,8+ ,277,4,114,0+n,68,1+o,115,2+t,115,3+ ,281,7,154,0+t,82,1+e,158,2+.,143,2-.,169,1-e,30,1+o,80,2+.,"

