import matplotlib.pyplot as plt

def predict(features_of_words, weights):
	predictions = []
	for word_features in features_of_words:
		w_1 = weights[0]
		b = weights[1]

		prediction = w_1 * word_features[0] + b

		predictions.append(prediction)
	return predictions

def cost_function(features_of_words, targets, weights):
	N = len(features_of_words)

	predictions = predict(features_of_words, weights)

	sq_error = 0
	for prediction, target in zip(predictions, targets):
		sq_error += (prediction - target) ** 2

	return 1/N * sq_error

def cost_derivative(features_of_words, targets, weights, feature_index):
	N = len(features_of_words)
	sum = 0

	predictions = predict(features_of_words, weights)

	# Iterating through all words
	for prediction, target, word_features in zip(predictions, targets, features_of_words):
		# For each word, find the inner value of the summation
		sum += (target - prediction) * word_features[feature_index]

	return -2.0/N * sum

def cost_derivative_bias(features_of_words, targets, weights):
	N = len(features_of_words)
	sum = 0

	predictions = predict(features_of_words, weights)

	# Iterating through all words
	for prediction, target in zip(predictions, targets):
		# For each word, find the inner value of the summation
		sum += (target - prediction)

	return -2.0/N * sum

def update_weights(features_of_words, targets, weights, learning_rate):
	weight_derivative = cost_derivative(features_of_words, targets, weights, 0)
	bias_derivative = cost_derivative_bias(features_of_words, targets, weights)

	next_weight = weights[0] - weight_derivative * learning_rate
	next_bias = weights[1] - bias_derivative * learning_rate

	return [next_weight, next_bias]


weights_history = []
epochs = 100

def train(weights, features, targets):
	global weights_history

	learning_rate = 0.01
	epoch = 0
	while True:
		next_weights = update_weights(features, targets, weights, learning_rate)

		cost = cost_function(features, targets, weights)

		weights = next_weights

		new_cost = cost_function(features, targets, weights)

		if cost - new_cost < 1e-9:
			print("Epoch: ", epoch)
			break

		epoch += 1

		weights_history.append(next_weights)
	return weights

# Two weights, $w_1$ and $b$
weights = [0, 0]
features_of_words = [
	[6], # word 1 has 6 chars
	[7], # word 2 has 7 chars
	[8], # word 3 has 8 chars
	[9], # word 4 has 9 chars
	[10], # word 5 has 10 chars
	[11], # word 6 has 11 chars
]

targets = [
	# word 1 wpm ratio
	1.8523997581589209,
	# word 2 wpm ratio
	1.7302841332533008,
	# word 3 wpm ratio
	1.614390135538142,
	# word 4 wpm ratio
	1.5007211799003408,
	# word 5 wpm ratio
	1.448833713008257,
	# word 6 wpm ratio
	1.3051500032628751
]

def plot_loss_function():
	losses = [cost_function(features_of_words, targets, weights) for weights in weights_history]
	plt.plot(range(len(losses)), losses)
	plt.title("Iteration Number vs. Cost", size=20)
	plt.xlabel("Iteration Number", size=20)
	plt.ylabel("Cost", size=20)
	plt.show()

plt.show()

def plot_line(weights):
	print(weights)
	predictions = predict(features_of_words, weights)
	features = [features_of_word[0] for features_of_word in features_of_words]

	plt.plot(features, predictions)
	plt.scatter(features, targets)
	plt.title("Word Length vs. WPM Ratio")
	plt.xlabel("Word Length")
	plt.ylabel("WPM Ratio")
	plt.show()

final_weights = train(weights, features_of_words, targets)

plot_loss_function()


print("final: ", final_weights)

# plot_loss_function()
plot_line(final_weights)
