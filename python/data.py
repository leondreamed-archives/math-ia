import pandas as pd
from pathlib import Path
import tensorflow as tf
from matplotlib import pyplot as plt

import json
import itertools

stats_file_paths = [
    "data/race-stats-1-3000.jsonl",
    "data/race-stats-3001-6000.jsonl",
    "data/race-stats-6001-9000.jsonl",
]

race_stats = []
for stat_file_path in stats_file_paths:
    race_stats.extend(
        [json.loads(line) for line in Path(stat_file_path).read_text().splitlines()]
    )


def flatten_word_data(word_data, race_id):
    flat_word_data = {**word_data, **word_data["features"], 'race_id': race_id}
    del flat_word_data["features"]
    return flat_word_data


words_data = [flatten_word_data(word_data, stat['raceId']) for stat in race_stats for word_data in stat["words"]]

for word_data in words_data:
    if word_data["actualWpm"] < 40:
        print(word_data)

words_df = pd.DataFrame(words_data)


def plot_the_model(trained_weight, trained_bias, feature, label):
    """Plot the trained model against 200 random training examples."""

    # Label the axes.
    plt.xlabel(feature)
    plt.ylabel(label)

    random_examples = words_df.sample(n=200000)
    plt.scatter(random_examples[feature], random_examples[label])

    # Create a red line representing the model. The red line starts
    # at coordinates (x0, y0) and ends at coordinates (x1, y1).
    x0 = 0
    y0 = 0
    x1 = 4
    y1 = 300
    plt.plot([x0, x1], [y0, y1], c="r")

    # Render the scatter plot and the red line.
    plt.show()


def plot_the_loss_curve(epochs, rmse):
    """Plot a curve of loss vs. epoch."""

    plt.figure()
    plt.xlabel("Epoch")
    plt.ylabel("Root Mean Squared Error")

    plt.plot(epochs, rmse, label="Loss")
    plt.legend()
    plt.ylim([rmse.min() * 0.97, rmse.max()])
    plt.show()


print("Defined the plot_the_model and plot_the_loss_curve functions.")


def build_model(my_learning_rate):
    """Create and compile a simple linear regression model."""
    # Most simple tf.keras models are sequential.
    model = tf.keras.models.Sequential()

    # Describe the topography of the model.
    # The topography of a simple linear regression model
    # is a single node in a single layer.
    model.add(tf.keras.layers.Dense(units=1, input_shape=(1,)))

    # Compile the model topography into code that TensorFlow can efficiently
    # execute. Configure training to minimize the model's mean squared error.
    model.compile(
        optimizer=tf.keras.optimizers.RMSprop(lr=my_learning_rate),
        loss="mean_squared_error",
        metrics=[tf.keras.metrics.RootMeanSquaredError()],
    )

    return model


def train_model(model, df, feature, label, epochs, batch_size):
    """Train the model by feeding it data."""

    # Feed the model the feature and the label.
    # The model will train for the specified number of epochs.
    history = model.fit(
        x=df[feature], y=df[label], batch_size=batch_size, epochs=epochs
    )

    # Gather the trained model's weight and bias.
    trained_weight = model.get_weights()[0]
    trained_bias = model.get_weights()[1]

    # The list of epochs is stored separately from the rest of history.
    epochs = history.epoch

    # Isolate the error for each epoch.
    hist = pd.DataFrame(history.history)

    # To track the progression of training, we're going to take a snapshot
    # of the model's root mean squared error at each epoch.
    rmse = hist["root_mean_squared_error"]

    return trained_weight, trained_bias, epochs, rmse


# The following variables are the hyperparameters.
learning_rate = 0.01
epochs = 3
batch_size = 30

# Specify the feature and the label.
my_feature = "wordLength"  # the total number of rooms on a specific city block.
my_label = "actualWpm"  # the median value of a house on a specific city block.
# That is, you're going to create a model that predicts house value based
# solely on total_rooms.

# Discard any pre-existing version of the model.
my_model = None

# Invoke the functions.
my_model = build_model(learning_rate)
weight, bias, epochs, rmse = train_model(
    my_model, words_df, my_feature, my_label, epochs, batch_size
)

print("Defined the create_model and training_model functions.")

print("\nThe learned weight for your model is %.4f" % weight)
print("The learned bias for your model is %.4f\n" % bias)

plot_the_model(weight, bias, my_feature, my_label)
plot_the_loss_curve(epochs, rmse)
