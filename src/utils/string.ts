export function countLetters(str: string, letters: string[]) {
	let count = 0;
	for (const c of str) {
		if (letters.includes(c)) count += 1;
	}

	return count;
}
