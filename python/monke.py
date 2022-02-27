import pandas as pd
from pathlib import Path
import json
import itertools

stats_file_paths = [
    "data/race-stats-1-3000.jsonl",
    "data/race-stats-3001-6000.jsonl",
    "data/race-stats-6001-9000.jsonl",
]

race_stats = []
for stat_file_path in stats_file_paths:
	race_stats.extend([json.loads(line) for line in Path(stat_file_path).read_text().splitlines()])

# Extract the words into their own
words_data = [stat['words'] for stat in race_stats]

data_frame = pd.DataFrame(words_data)
print(data_frame)
