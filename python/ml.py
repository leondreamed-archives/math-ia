import matplotlib.pyplot as plt

def predict(features_of_words, weights):
	predictions = []
	for word_features in features_of_words:
		prediction = 0
		for feature, weight in zip(word_features, weights):
			prediction += feature * weight
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

def update_weights(features_of_words, targets, weights, learning_rate):
	next_weights = []
	for feature_index in range(len(features_of_words[0])):
		derivative = cost_derivative(features_of_words, targets, weights, feature_index)
		next_weight = weights[feature_index] - derivative * learning_rate
		next_weights.append(next_weight)
	return next_weights


weights_history = []
epochs = 100

def train(weights, features, targets):
	global weights_history

	epochs = 100
	learning_rate = 0.001
	for epoch in range(epochs):
		next_weights = update_weights(features, targets, weights, learning_rate)

		cost = cost_function(features, targets, weights)

		weights = next_weights
		weights_history.append(next_weights)
	return weights

# Only one weight
weights = [0]
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

weights = [x / 10000 for x in range(500, 3000)]
cost_y = [cost_function(features_of_words, targets, [weight]) for weight in weights]
cost_dy = [cost_derivative(features_of_words, targets, [weight], 0) for weight in weights]

def plot_loss_function():
	losses = [cost_function(features_of_words, targets, weights) for weights in weights_history]
	plt.plot(range(len(losses)), losses)
	plt.show()

# plt.plot(weights, cost_y)
# plt.plot(weights, cost_dy, color='red')

# plt.title("Weight vs. Cost")
# plt.xlabel("Weight")
# plt.ylabel("Cost")

# plt.show()


train(weights, features_of_words, targets)

plot_loss_function()