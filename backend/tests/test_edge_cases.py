from algorithms.astar import astar


grid = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
]

start = (1, 1)
goal = (1, 1)

result = astar(grid, start, goal)

print("Start = Goal")
print("Path:", result["path"])
print("Path Cost:", result["path_cost"])

grid = [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1]
]

start = (1, 1)
goal = (0, 0)

result = astar(grid, start, goal)

print("\nStart Completely Surrounded")
print("Path:", result["path"])
print("Path Cost:", result["path_cost"])

grid = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
]

start = (0, 0)
goal = (1, 1)

result = astar(grid, start, goal)

print("\nGoal Surrounded")
print("Path:", result["path"])
print("Path Cost:", result["path_cost"])