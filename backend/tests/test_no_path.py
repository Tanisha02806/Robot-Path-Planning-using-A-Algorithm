from algorithms.astar import astar


grid = [
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0]
]

start = (0, 0)
goal = (0, 4)

result = astar(grid, start, goal)

print("Path:")
print(result["path"])

print("\nPath Cost:")
print(result["path_cost"])

print("\nNodes Explored:")
print(len(result["visited"]))