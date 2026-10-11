# 🤖 Robot Path Planning Using A* Algorithm

An interactive web-based robot path-planning application that uses the **A* (A-Star) search algorithm** to find an optimal path from a starting point to a destination while avoiding obstacles. The application visualizes explored cells and the final path through step-by-step animation.

## 📌 Project Overview

Robot path planning is an important problem in robotics and artificial intelligence. A robot must determine a safe and efficient route from its initial position to a target while avoiding obstacles in its environment.

This project implements the A* search algorithm on a two-dimensional grid. Users can interact with the grid, create obstacles, select start and goal positions, and visualize how the algorithm explores the environment and finds a path.

## ✨ Features

- **Interactive Grid:** Visualize the environment using a 20 × 35 grid.
- **Obstacle Placement:** Add walls to block the robot's movement.
- **Start and Goal Selection:** Define the robot's starting position and destination.
- **A* Pathfinding:** Calculate a shortest path when a route exists.
- **Step-by-Step Animation:** Observe explored cells and the final path being displayed progressively.
- **Random Map Generation:** Generate random obstacles to test different scenarios.
- **Wall Density Control:** Adjust obstacle density when generating a random map.
- **Clear Board:** Reset the grid and start a new path-planning experiment.
- **Path Cost and Explored Cells:** View pathfinding results.
- **No-Path Detection:** Handle cases where obstacles prevent the robot from reaching the goal.
- **REST API Integration:** Connect the React frontend to a Python FastAPI backend.

## 🛠️ Technologies Used

| Technology   | Purpose                         |
|--------------|---------------------------------|
| Python       | A* algorithm implementation     |
| FastAPI      | Backend REST API                |
| React        | Interactive frontend            |
| Vite         | Frontend development server     |
| Tailwind CSS | User interface styling          |
| JavaScript   | Grid interactions and animation |
| Uvicorn      | Running the FastAPI application |

## 🧠 A* Search Algorithm

A* is an informed search algorithm that finds a least-cost path from a start node to a goal node by considering both the cost of reaching a node and an estimate of the remaining cost.

It evaluates each node using the function:

**f(n) = g(n) + h(n)**

Where:

- **g(n):** Actual cost of reaching node `n` from the starting node.
- **h(n):** Estimated cost from node `n` to the goal.
- **f(n):** Estimated total cost of a path through node `n`.

### Heuristic Function

This project uses the **Manhattan distance** heuristic because movement is restricted to four directions: up, down, left, and right.

\[
h(n)=|r_n-r_g|+|c_n-c_g|
\]

Where:

- \(r_n,c_n\) are the row and column of the current cell.
- \(r_g,c_g\) are the row and column of the goal.

Each movement to an adjacent cell has a cost of 1.

### How the Algorithm Works

1. Initialize the starting node with a path cost of zero.
2. Add the starting node to the set of nodes to explore.
3. Select the node with the lowest estimated total cost, `f(n)`.
4. If the selected node is the goal, reconstruct the path.
5. Otherwise, examine its valid neighboring cells.
6. Ignore cells that are blocked or outside the grid.
7. Update the costs and predecessor information of neighboring cells when a better route is found.
8. Repeat until the goal is reached or no nodes remain to explore.
9. Return the path, explored-cell information, and path cost.

If the goal cannot be reached, the algorithm returns an empty path.

## 📊 Algorithm Complexity

Let:

- \(V\) be the number of grid cells (vertices).
- \(E\) be the number of valid connections between adjacent cells (edges).

For a grid with four-directional movement, each cell has at most four neighbors, so \(E=O(V)\).

With a priority queue, a standard A* implementation has a worst-case time complexity of **O((V + E) log V)** and space complexity of **O(V)**, assuming efficient priority-queue operations and storage of explored nodes and path information.

For a grid with \(R\) rows and \(C\) columns, \(V=R \times C\). The actual number of cells explored depends on the obstacle layout and heuristic.

## 🏗️ Project Structure

```text
robot-path-planner/
├── backend/
│   ├── algorithms/
│   │   └── astar.py
│   ├── utils/
│   │   └── grid.py
│   ├── tests/
│   └── main.py
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Cell.jsx
│       │   ├── Grid.jsx
│       │   └── Legend.jsx
│       ├── utils/
│       │   └── gridUtils.js
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following before running the project:

- Python 3.10 or a compatible version supported by your dependencies
- Node.js and npm
- Git (optional, for version control)

### 1. Clone the Repository

```bash
git clone https://github.com/Tanisha02806/Robot-Path-Planning-using-A-Algorithm.git
cd robot-path-planner
```

Replace the placeholder with your actual repository URL.

### 2. Set Up the Backend

Open a terminal in the project root and run:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment.

**Windows PowerShell:**

```powershell
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```bash
pip install fastapi "uvicorn[standard]"
```

Start the backend server:

```bash
python -m uvicorn main:app --reload
```

The backend should be available at:

- API base URL: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs

Keep this terminal running.

### 3. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

http://localhost:5173

Keep the frontend and backend running simultaneously.

## 🔌 API Documentation

### Find Path

**Endpoint:** `POST /find-path`

**Purpose:** Receives a grid, start position, and goal position and returns the A* pathfinding results.

Example request:

```json
{
  "grid": [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  "start": [0, 0],
  "goal": [3, 3]
}
```

In this request:

- `0` represents a free cell.
- `1` represents an obstacle.
- `start` contains the starting row and column.
- `goal` contains the destination row and column.

Example response structure:

```json
{
  "path": [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 3]],
  "visited": [[0, 0], [0, 1]],
  "visited_order": [[0, 0], [0, 1]],
  "path_cost": 6
}
```

The arrays above illustrate the response format; actual explored cells and paths depend on the grid and algorithm execution.

You can test the endpoint using the interactive Swagger documentation at `/docs`.

## 🧪 Testing

The following scenarios should be tested to verify the correctness and reliability of the application:

| Test Case                       | Expected Result                                                     |
|---------------------------------|---------------------------------------------------------------------|
| Open grid with a reachable goal | A valid shortest path is returned                                   |
| Grid containing obstacles       | The path avoids blocked cells                                       |
| Goal completely blocked off     | An empty path and no-path message are returned                      |
| Start and goal are the same     | The implementation handles the case correctly                       |
| Clear Board during animation    | The previous animation stops and the board clears                   |
| Random Map during animation     | The previous animation stops and the new map appears                |
| Backend unavailable             | The frontend displays a readable error and resets its loading state |
| Repeated pathfinding requests   | The application displays the latest result correctly                |

Record actual test outcomes before submitting the project. The table describes expected behavior, not a claim that every test has been independently verified.

## 🚀 Future Improvements

Possible extensions, if required, include:

- Support for larger grid sizes.
- Adjustable animation speed.
- More advanced terrain with different movement costs.
- Integration with a simulated robot environment.
- Deployment of the frontend and backend.

## 🎯 Learning Outcomes

Through this project, the following concepts can be practiced:

- Implementation of informed search algorithms.
- Heuristic functions and shortest-path search.
- Grid-based graph representation.
- Time and space complexity analysis.
- REST API development using FastAPI.
- Frontend and backend integration.
- Interactive visualization of algorithm execution.
- Testing and debugging a full-stack application.

## 👩‍💻 Author

**Tanisha Thakur**

Computer Science Engineering — Artificial Intelligence

GitHub: [Tanisha02806](https://github.com/Tanisha02806)

---

*Developed as a Design and Analysis of Algorithms (DAA) project to demonstrate A* search through an interactive robot path-planning application.*
