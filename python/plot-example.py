import matplotlib.pyplot as plt

word_data = [
    ["month.", 6, 1.8523997581589209],
    ["should ", 7, 1.7302841332533008],
    ["meaning.", 8, 1.614390135538142],
    ["singing. ", 9, 1.5007211799003408],
    ["thoughts. ", 10, 1.448833713008257],
    ["standpoint ", 11, 1.3051500032628751],
]

x_values = [data[1] for data in word_data]
y_values = [data[2] for data in word_data]

plt.scatter(x_values, y_values)

w_1 = -0.2
b = 3.2

plt.plot(x_values, [x_value * w_1 + b for x_value in x_values])
plt.scatter(x_values, y_values)

plt.title("Word Length vs. WPM Ratio", size=20)
plt.xlabel("Word Length", size=20)
plt.ylabel("WPM Ratio", size=20)

plt.show()
