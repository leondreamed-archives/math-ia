import { scrapeRaceReplayWebpages } from '~/utils/race-replay-webpage.js';

// https://data.typeracer.com/pit/result?id=|tr:leonzalion|41 is the first race with a typing log
await scrapeRaceReplayWebpages({ startRaceId: 41 });
