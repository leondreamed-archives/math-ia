import * as path from 'node:path';
import onetime from 'onetime';
import { join } from 'desm';

export const getRootPath = onetime(() => join(import.meta.url, '../..'));

export function getRaceReplayWebpagesFilePath(raceId: number) {
	if (raceId <= 3000) {
		return `data/race-replay-webpages-1-3000.jsonl`;
	} else if (raceId > 3000 && raceId <= 6000) {
		return `data/race-replay-webpages-3001-6000.jsonl`;
	} else {
		return `data/race-replay-webpages-6001-9000.jsonl`;
	}
}

export const getRaceReplayWebpagesFilePaths = onetime(() =>
	[
		'data/race-replay-webpages-1-3000.jsonl',
		'data/race-replay-webpages-3001-6000.jsonl',
		'data/race-replay-webpages-6001-9000.jsonl',
	].map((jsonlPath) => path.join(getRootPath(), jsonlPath))
);

export const getRawTypingLogsFilePath = onetime(() =>
	path.join(getRootPath(), 'data/raw-typing-logs.jsonl')
);

export const getTypingLogsFilePaths = onetime(() =>
	[
		'data/typing-logs-1-3000.jsonl',
		'data/typing-logs-3001-6000.jsonl',
		'data/typing-logs-6001-9000.jsonl',
	].map((jsonlPath) => path.join(getRootPath(), jsonlPath))
);

export const getRaceStatsFilePaths = onetime(() =>
	[
		'data/race-stats-1-3000.jsonl',
		'data/race-stats-3001-6000.jsonl',
		'data/race-stats-6001-9000.jsonl',
	].map((jsonlPath) => path.join(getRootPath(), jsonlPath))
);
