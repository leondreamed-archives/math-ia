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


def cost_function(weight):
    summation_sum = 0
    for x, y in zip(x_values, y_values):
        summation_sum += (y - weight * x) ** 2
    return (1 / len(x_values)) * summation_sum


weights = [x / 10000 for x in range(500, 3000)]
cost_y = [cost_function(weight) for weight in weights]

plt.plot(weights, cost_y)

plt.title("Weight vs. Cost")
plt.xlabel("Weight")
plt.ylabel("Cost")

plt.show()
