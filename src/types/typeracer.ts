export type TyperacerText = {
	/**
	 * The ID of the text
	 */
	id: number;

	/**
	 * The text content
	 */
	content: string;
};

export type TyperacerGameResponse = {
	/**
	 * Accuracy.
	 */
	ac: number;

	/**
	 * Number of players.
	 */
	np: number;

	/**
	 * Words per minute.
	 */
	wpm: number;

	/**
	 * Ranking (1st, 2nd, etc.).
	 */
	r: number;

	/**
	 * UNIX timestamp of race.
	 */
	t: number;

	/**
	 * No idea what this parameter means
	 */
	sl: number;

	/**
	 * TypeRacer ID of the quote.
	 */
	tid: number;

	/**
	 * Race number.
	 */
	gn: number;

	/**
	 * Points awarded.
	 */
	pts: number;
};
