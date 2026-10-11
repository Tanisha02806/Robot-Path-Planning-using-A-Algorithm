from algorithms.astar import astar
from utils.grid import print_grid


grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
]

start = (0, 0)
goal = (4, 4)

result = astar(grid, start, goal)

print_grid(
    grid,
    start,
    goal,
    result["path"]
)

print("\nPath:", result["path"])
print("Path Cost:", result["path_cost"])
print("Nodes Explored:", len(result["visited"]))

print("\nVisited Order:")

for step, node in enumerate(result["visited_order"], start=1):
    print(f"Step {step}: {node}")