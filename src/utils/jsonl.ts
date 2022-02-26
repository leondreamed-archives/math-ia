import is from '@sindresorhus/is';

export const JSONL = {
	stringify(obj: unknown[]) {
		if (!is.array(obj)) {
			throw new Error('The object to be JSONL stringified must be an array.');
		}
	},
	parse(jsonl: string): unknown[] {
		return jsonl.split('\n').map((json) => JSON.parse(json) as unknown);
	},
};
