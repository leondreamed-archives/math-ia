import matplotlib.pyplot as plt
import json
import random

fig = plt.figure()
ax = fig.add_subplot(projection='3d')

word_stats = json.load(open("data/word-stats.json", "r"))
word_stats = random.sample(word_stats, 2000)

ax.scatter(
    [stat["numCapitalLetters"] for stat in word_stats],
    [stat["wordLength"] for stat in word_stats],
		[stat['medianWpm'] for stat in word_stats]
)

ax.set_xlabel('Number of Capital Letters')
ax.set_ylabel('Word Length')
ax.set_zlabel('Median WPM')

plt.show()