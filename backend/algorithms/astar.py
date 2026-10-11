import heapq

DIRECTIONS = [
    (-1, 0),
    (1, 0),
    (0, -1),
    (0, 1)
]


def heuristic(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])


def astar(grid, start, goal):
    rows = len(grid)
    cols = len(grid[0])

    open_heap = []
    
    heapq.heappush(
        open_heap,
        (heuristic(start, goal), 0, start)
    )

    came_from = {}

    g_cost = {
        start: 0
    }

    visited = set()
    visited_order = []

    while open_heap:

        current_f, current_g, current = heapq.heappop(open_heap)

        if current in visited:
            continue

        visited.add(current)
        visited_order.append(current)

        if current == goal:
            path = reconstruct_path(came_from, current)

            return {
                "path": path,
                "visited": visited,
                "visited_order": visited_order,
                "path_cost": g_cost[current]
            }

        row, col = current

        for dr, dc in DIRECTIONS:

            neighbor_row = row + dr
            neighbor_col = col + dc

            if not (
                0 <= neighbor_row < rows
                and 0 <= neighbor_col < cols
            ):
                continue

            if grid[neighbor_row][neighbor_col] == 1:
                continue

            neighbor = (neighbor_row, neighbor_col)

            new_g = g_cost[current] + 1

            if (
                neighbor not in g_cost
                or new_g < g_cost[neighbor]
            ):

                g_cost[neighbor] = new_g

                h = heuristic(neighbor, goal)
                f = new_g + h

                came_from[neighbor] = current

                heapq.heappush(
                    open_heap,
                    (f, new_g, neighbor)
                )

    return {
        "path": [],
        "visited": visited,
        "visited_order": visited_order,
        "path_cost": None
    }


def reconstruct_path(came_from, current):
    path = [current]

    while current in came_from:
        current = came_from[current]
        path.append(current)

    path.reverse()

    return path