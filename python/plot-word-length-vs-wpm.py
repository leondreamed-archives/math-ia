import json
from pathlib import Path
import pandas as pd
from matplotlib import pyplot as plt

word_stats = json.load(open("data/word-stats.json", "r"))

plt.scatter(
    x=[stat["wordLength"] for stat in word_stats],
    y=[stat["medianWpmRatio"] for stat in word_stats],
)

plt.title('Word Length vs. WPM')
plt.xlabel("Number of Characters in Word")
plt.ylabel("WPM Ratio")

plt.show()
