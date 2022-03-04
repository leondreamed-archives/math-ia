from pathlib import Path
import functools
import matplotlib.pyplot as plt
import json

ac_predictions = json.loads(Path("data/100-ac-predictions.json").read_text())

ac_predictions = sorted(
    ac_predictions,
    key=functools.cmp_to_key(lambda a, b: a["actual"] - b["actual"]),
)
num_predictions = len(ac_predictions)

predictions = [prediction["predicted"] for prediction in ac_predictions]
actual = [prediction["actual"] for prediction in ac_predictions]

plt.scatter(
    range(num_predictions),
    predictions,
    color="orange",
    s=2,
    label="Predicted WPM",
)
plt.scatter(
    range(num_predictions), actual, color="green", s=2, label="Actual WPM"
)

plt.xlabel("Text Number", size="20")
plt.ylabel("WPM", size="20")
plt.title("Predicted vs. Actual WPM", size="20")
plt.ylim([100, 230])
plt.legend(prop={"size": 16})
plt.show()
