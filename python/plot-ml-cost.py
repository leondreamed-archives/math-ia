import matplotlib.pyplot as plt
import re
from pathlib import Path

output = Path('output.txt').read_text()
output2 = Path('output2.txt').read_text()

costs = []
for line in output.splitlines():
	result = re.match(r'cost:  ([^\s]+)$', line)
	if result is not None:
		costs.append(float(result.group(1)))

for line in output2.splitlines():
	result = re.match(r'cost: ([^\s]+)$', line)
	if result is not None:
		costs.append(float(result.group(1)))

print(costs)

plt.plot(range(len(costs)), costs)

plt.title("Iteration Number vs. Cost")
plt.xlabel("Iteration Number")
plt.ylabel("Cost")

plt.yscale('log', base=10, subs=[2, 3, 4, 5, 6, 7, 8, 9])

plt.show()
