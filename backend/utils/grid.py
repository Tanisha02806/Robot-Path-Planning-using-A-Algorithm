def print_grid(grid, start, goal, path):

    path = set(path)

    for row in range(len(grid)):

        line = ""

        for col in range(len(grid[0])):

            position = (row, col)

            if position == start:
                line += "S "

            elif position == goal:
                line += "G "

            elif grid[row][col] == 1:
                line += "# "

            elif position in path:
                line += "* "

            else:
                line += ". "

        print(line)