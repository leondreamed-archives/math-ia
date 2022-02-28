import matplotlib.pyplot as plt

word_stats = [
	['month.', 6 , 1.8523997581589209],
	['should ', 7 , 1.7302841332533008],
	['meaning.', 8 , 1.614390135538142],
	['singing. ', 9 , 1.5007211799003408],
	['thoughts. ', 10, 1.448833713008257],
	['standpoint ', 11, 1.3051500032628751],
]

plt.scatter(
    x=[stat[1] for stat in word_stats],
    y=[stat[2] for stat in word_stats],
)

plt.title('Word Length vs. WPM Ratio')
plt.xlabel("Word Length (# of characters)")
plt.ylabel("WPM Ratio")

plt.show()
