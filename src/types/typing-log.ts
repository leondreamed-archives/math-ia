export type RawTypingLogData = {
	raceId: number;
	rawTypingLog: string;
};

export type TypingLogKeystroke = {
	type: 'add' | 'remove';
	key: string;
	keyIndex: number;
	deltaTime: number;
};

export type TypingLogKeyTime = {
	key: string;
	deltaTime: number;
};

export type TypingLog = {
	keystrokes: TypingLogKeystroke[];
	keyTimes: TypingLogKeyTime[];
};

export type TypingLogData = {
	raceId: number;
	typingLog: TypingLog;
};
