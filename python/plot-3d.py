import matplotlib.pyplot as plt
from mpl_toolkits import mplot3d
import json
import random
from pathlib import Path

fig = plt.figure()
ax = fig.axes(projection='3d')

word_stats = json.loads(Path("data/word-stats.json").read_text())


['month.', 6, 1.8523997581589209],
['should ', 7, 1.7302841332533008],
['meaning.', 8, 1.614390135538142],
['singing. ', 9, 1.5007211799003408],
['thoughts. ', 10, 1.448833713008257],
['standpoint ', 11, 1.3051500032628751],

targets = []
weights = []
biases = []

ax.contour3D()
word_stats = random.sample(word_stats, 2000)

ax.scatter(
    [stat["numCapitalLetters"] for stat in word_stats],
    [stat["wordLength"] for stat in word_stats],
		[stat['medianWpmRatio'] for stat in word_stats]
)

ax.set_xlabel('Number of Capital Letters')
ax.set_ylabel('Word Length')
ax.set_zlabel('Median WPM Ratio')

plt.show()