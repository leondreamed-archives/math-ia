import functools
from stat import ST_SIZE
import matplotlib.pyplot as plt
from pathlib import Path
import json
import numpy as np
import random


def predict(features_of_words, weights):
    predictions = []
    for word_features in features_of_words:
        prediction = 0

        # weights[0] * word_features[0] +
        # weights[1] * word_features[1] +
        # weights[2] * word_features[2] + ...
        for word_feature, weight in zip(weights, word_features):
            prediction += weight * word_feature

        # Add the bias term
        prediction += weights[-1]

        predictions.append(prediction)
    return predictions


def cost_function(features_of_words, targets, weights):
    N = len(features_of_words)

    predictions = predict(features_of_words, weights)

    sq_error = 0
    for prediction, target in zip(predictions, targets):
        sq_error += (prediction - target) ** 2

    return 1 / N * sq_error


batch_size = int()

def cost_derivative(features_of_words, targets, weights, feature_index):
    global batch_size
    sum = 0

    features_of_words_batch = random.sample(features_of_words, batch_size)

    predictions = predict(features_of_words_batch, weights)

    # Iterating through all words
    # For each word, find the inner value of the summation
    for prediction, target, word_features in zip(
        predictions,
        targets,
        features_of_words_batch
    ):
        # Checking for the bias term
        if feature_index == len(features_of_words[0]):
            sum += (target - prediction)
        else:
            sum += (target - prediction) * word_features[feature_index]

    return -2.0 / batch_size * sum

def update_weights(features_of_words, targets, weights, learning_rate):
    num_features = len(features_of_words[0])

    weight_derivatives = [
        cost_derivative(features_of_words, targets, weights, feature_index)
        for feature_index in range(num_features)
    ]

    bias_derivative = cost_derivative(features_of_words, targets, weights, len(features_of_words[0]))

    next_weights = []
    for feature_index in range(num_features):
        next_weights.append(
            weights[feature_index] - weight_derivatives[feature_index] * learning_rate
        )

    next_bias = weights[-1] - bias_derivative * learning_rate

    return [*next_weights, next_bias]


weights_history = []


def train(weights, features, targets):
    global weights_history

    epochs = 10000
    learning_rate = 0.008
    for epoch in range(epochs):
        next_weights = update_weights(features, targets, weights, learning_rate)

        cost = cost_function(features, targets, weights)
        if epoch % 100 == 0:
            print("Epoch ", epoch)
            print("Cost ", cost)

        weights = next_weights

        weights_history.append(next_weights)
    return weights


word_stats = json.loads(Path("data/word-stats.json").read_text())


def parse_words(word_stats):
    """
    features_of_word: [
            is_word_common,
            num_capital_letters,
            num_consecutive_fingers,
            num_double_letters,
            num_home_row_letters,
            num_left_hand_letters,
            num_numbers,
            num_right_hand_letters,
            num_shifted_letters,
            word_length
    ]
    """
    targets = []
    features_of_words = []
    num_features = int()

    word_stats = sorted(
        word_stats,
        key=functools.cmp_to_key(
            lambda a, b: a["medianWpmRatio"] - b["medianWpmRatio"]
        ),
    )

    for word in word_stats:
        median_wpm_ratio = word["medianWpmRatio"]
        is_word_common = word["isWordCommon"]
        num_capital_letters = word["numCapitalLetters"]
        num_consecutive_fingers = word["numConsecutiveFingers"]
        num_double_letters = word["numDoubleLetters"]
        num_home_row_letters = word["numHomeRowLetters"]
        num_left_hand_letters = word["numLeftHandLetters"]
        num_numbers = word["numNumbers"]
        num_right_hand_letters = word["numRightHandLetters"]
        num_shifted_letters = word["numShiftedLetters"]
        word_length = word["wordLength"]
        targets.append(median_wpm_ratio)

        features_of_word = [
            is_word_common,
            num_capital_letters,
            num_consecutive_fingers,
            num_double_letters,
            num_home_row_letters,
            num_left_hand_letters,
            num_numbers,
            num_right_hand_letters,
            num_shifted_letters,
            word_length,
        ]
        num_features = len(features_of_word)

        features_of_words.append(features_of_word)

    # +1 because we also need the bias term
    weights = [0 for feature in range(num_features + 1)]

    return targets, features_of_words, weights


targets, features_of_words, weights = parse_words(word_stats)
batch_size = len(word_stats) // 40


def plot_loss_function():
    losses = [
        cost_function(features_of_words, targets, weights)
        for weights in weights_history
    ]
    plt.plot(range(len(losses)), losses)
    plt.show()


# plt.plot(weights, cost_y)
# plt.plot(weights, cost_dy, color='red')

# plt.title("Weight vs. Cost")
# plt.xlabel("Weight")
# plt.ylabel("Cost")

# plt.show()


def plot_line(weights):
    print(weights)
    num_words = len(features_of_words)
    predictions = predict(features_of_words, weights)

    plt.scatter(range(num_words), predictions, color="orange", s=1)
    plt.scatter(range(num_words), targets, color="green", s=1)
    plt.show()


final_weights = train(weights, features_of_words, targets)

# plot_loss_function()
plot_line(final_weights)
