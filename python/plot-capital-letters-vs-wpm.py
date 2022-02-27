import json
from pathlib import Path
import pandas as pd
from matplotlib import pyplot as plt

word_stats = json.load(open("data/word-stats.json", "r"))

# Word length

plt.scatter(
    x=[stat["numCapitalLetters"] for stat in word_stats],
    y=[stat["medianWpm"] for stat in word_stats],
)
plt.title('Number of Capital Letters vs. WPM')
plt.xlabel("Number of Capital Letters")
plt.ylabel("WPM")

plt.show()
