
import { useState, useEffect } from "react";
import Grid from "./components/Grid";
import { createEmptyGrid } from "./utils/gridUtils";
import Legend from "./components/Legend";

function App() {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [mode, setMode] = useState("wall");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [wallDensity, setWallDensity] = useState(25);
  const [pathResult, setPathResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);

  // Animate explored cells first, then the final path.
  useEffect(() => {
    if (!isAnimating || !pathResult) return;

    const visitedOrder = pathResult.visited_order ?? [];
    const finalPath = pathResult.path ?? [];

    let visitedIndex = 0;
    let pathIndex = 0;
    let phase = "visited";

    const timer = setInterval(() => {
      if (phase === "visited") {
        if (visitedIndex < visitedOrder.length) {
          const [rowIndex, colIndex] = visitedOrder[visitedIndex];

          setGrid((currentGrid) =>
            currentGrid.map((row, r) =>
              row.map((cell, c) => {
                if (r !== rowIndex || c !== colIndex) return cell;

                if (
                  cell.type === "start" ||
                  cell.type === "goal" ||
                  cell.type === "wall"
                ) {
                  return cell;
                }

                return { ...cell, type: "visited" };
              })
            )
          );

          visitedIndex++;
        } else {
          phase = "path";
        }
      } else {
        if (pathIndex < finalPath.length) {
          const [rowIndex, colIndex] = finalPath[pathIndex];

          setGrid((currentGrid) =>
            currentGrid.map((row, r) =>
              row.map((cell, c) => {
                if (r !== rowIndex || c !== colIndex) return cell;

                if (
                  cell.type === "start" ||
                  cell.type === "goal" ||
                  cell.type === "wall"
                ) {
                  return cell;
                }

                return { ...cell, type: "path" };
              })
            )
          );

          pathIndex++;
        } else {
          clearInterval(timer);
          setIsAnimating(false);
        }
      }
    }, animationSpeed);

    return () => clearInterval(timer);
  }, [isAnimating, pathResult, animationSpeed]);

  const clearPathVisualization = () => {
    setIsAnimating(false);
    setPathResult(null);
    setError("");

    setGrid((currentGrid) =>
      currentGrid.map((row) =>
        row.map((cell) =>
          cell.type === "visited" || cell.type === "path"
            ? { ...cell, type: "empty" }
            : cell
        )
      )
    );
  };

  const updateCell = (rowIndex, colIndex) => {
    clearPathVisualization();

    setGrid((currentGrid) => {
      const newGrid = currentGrid.map((row) =>
        row.map((cell) => ({ ...cell }))
      );

      const cell = newGrid[rowIndex][colIndex];

      if (mode === "wall") {
        if (
          cell.type !== "start" &&
          cell.type !== "goal" &&
          cell.type !== "wall"
        ) {
          cell.type = "wall";
        }
      }

      if (mode === "erase") {
        if (cell.type !== "start" && cell.type !== "goal") {
          cell.type = "empty";
        }
      }

      if (mode === "start") {
        if (cell.type === "wall" || cell.type === "goal") {
          return currentGrid;
        }

        for (let r = 0; r < newGrid.length; r++) {
          for (let c = 0; c < newGrid[r].length; c++) {
            if (newGrid[r][c].type === "start") {
              newGrid[r][c].type = "empty";
            }
          }
        }

        newGrid[rowIndex][colIndex].type = "start";
      }

      if (mode === "goal") {
        if (cell.type === "wall" || cell.type === "start") {
          return currentGrid;
        }

        for (let r = 0; r < newGrid.length; r++) {
          for (let c = 0; c < newGrid[r].length; c++) {
            if (newGrid[r][c].type === "goal") {
              newGrid[r][c].type = "empty";
            }
          }
        }

        newGrid[rowIndex][colIndex].type = "goal";
      }

      return newGrid;
    });
  };

  const handleCellClick = (row, col) => {
    updateCell(row, col);
  };

  const handleMouseDown = (row, col) => {
    setIsMouseDown(true);
    updateCell(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (isMouseDown && (mode === "wall" || mode === "erase")) {
      updateCell(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setGrid(createEmptyGrid());
    setPathResult(null);
    setError("");
    setMode("wall");
    setIsMouseDown(false);
  };

  const handleRandomMap = () => {
    setIsAnimating(false);
    setPathResult(null);
    setError("");

    setGrid((currentGrid) =>
      currentGrid.map((row) =>
        row.map((cell) => {
          if (cell.type === "start" || cell.type === "goal") {
            return { ...cell };
          }

          const isWall = Math.random() < wallDensity / 100;

          return {
            ...cell,
            type: isWall ? "wall" : "empty",
          };
        })
      )
    );

    setMode("wall");
  };

  const hasStart = grid.some((row) =>
    row.some((cell) => cell.type === "start")
  );

  const hasGoal = grid.some((row) =>
    row.some((cell) => cell.type === "goal")
  );

  const handleFindPath = async () => {
    const startCell = grid.flat().find((cell) => cell.type === "start");
    const goalCell = grid.flat().find((cell) => cell.type === "goal");

    if (!startCell || !goalCell) {
      setError("Please place both a Start and a Goal first.");
      return;
    }

    const numericGrid = grid.map((row) =>
      row.map((cell) => (cell.type === "wall" ? 1 : 0))
    );

    setIsAnimating(false);
    setIsLoading(true);
    setError("");
    setPathResult(null);

    // Clear any previous visualization while preserving Start, Goal, and Walls.
    setGrid((currentGrid) =>
      currentGrid.map((row) =>
        row.map((cell) =>
          cell.type === "visited" || cell.type === "path"
            ? { ...cell, type: "empty" }
            : cell
        )
      )
    );

    try {
      const response = await fetch("http://127.0.0.1:8000/find-path", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grid: numericGrid,
          start: [startCell.row, startCell.col],
          goal: [goalCell.row, goalCell.col],
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      const data = await response.json();

      console.log("A* API response:", data);
      console.log("Visited order:", data.visited_order);
      console.log("Path:", data.path);

      if (!data.path || data.path.length === 0) {
        setPathResult(null);
        setError("No path found. Try removing some walls.");
        return;
      }

      setPathResult(data);
      setIsAnimating(true);
    } catch (err) {
      console.error("Pathfinding error:", err);
      setError(
        "Could not connect to the Python backend. Check that FastAPI is running on port 8000."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 p-8 text-white"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <header className="mb-8 flex flex-col gap-4 border-b border-slate-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-blue-500/15 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
              DAA Project
            </span>
            <span className="text-xs text-slate-500">
              Pathfinding Visualizer
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Robot Path Planner
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Design a grid, place obstacles, and visualize how the A*
            algorithm finds an efficient route from Start to Goal.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 sm:self-center">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isAnimating
                ? "animate-pulse bg-blue-400"
                : "bg-green-400"
            }`}
          />
          <span className="text-sm font-medium text-slate-300">
            {isAnimating ? "Animating..." : "Editor Ready"}
          </span>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap gap-3">
        {[
          ["wall", "Wall"],
          ["erase", "Erase"],
          ["start", "Start"],
          ["goal", "Goal"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setMode(value)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
              mode === value
                ? "border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
            }`}
          >
            {label}
          </button>
        ))}

        <button
          onClick={handleReset}
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 transition hover:border-red-400 hover:bg-red-500/20"
        >
          Clear Board
        </button>

        <button
          onClick={handleRandomMap}
          className="rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 transition hover:border-purple-400 hover:bg-purple-500/20"
        >
          Random Map
        </button>

        <button
          onClick={handleFindPath}
          disabled={isLoading || isAnimating}
          className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {isLoading
            ? "Finding Path..."
            : isAnimating
              ? "Visualizing..."
              : "Find Path"}
        </button>
      </div>

      <div className="mb-6 max-w-md rounded-xl border border-slate-700 bg-slate-900 p-4">
        <div className="mb-3 flex items-center justify-between">
          <label htmlFor="wall-density" className="font-medium">
            Wall Density
          </label>
          <span className="font-semibold text-blue-400">
            {wallDensity}%
          </span>
        </div>

        <input
          id="wall-density"
          type="range"
          min="0"
          max="60"
          step="5"
          value={wallDensity}
          onChange={(e) => setWallDensity(Number(e.target.value))}
          className="w-full cursor-pointer accent-blue-500"
        />

        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>Sparse</span>
          <span>Balanced</span>
          <span>Dense</span>
        </div>
      </div>

      <div className="mb-6 max-w-md rounded-xl border border-slate-700 bg-slate-900 p-4">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="animation-speed" className="font-medium">
            Animation Speed
          </label>
          <span className="text-sm text-blue-400">
            {animationSpeed} ms
          </span>
        </div>

        <input
          id="animation-speed"
          type="range"
          min="10"
          max="200"
          step="10"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(Number(e.target.value))}
          className="w-full cursor-pointer accent-blue-500"
        />

        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-slate-700 bg-slate-900 p-3">
        {!hasStart && !hasGoal && (
          <p className="text-amber-400">
            Place both a Start node and a Goal node to prepare the map.
          </p>
        )}

        {!hasStart && hasGoal && (
          <p className="text-amber-400">
            Start node is missing. Select Start and click an empty cell.
          </p>
        )}

        {hasStart && !hasGoal && (
          <p className="text-amber-400">
            Goal node is missing. Select Goal and click an empty cell.
          </p>
        )}

        {hasStart && hasGoal && (
          <p className="text-emerald-400">
            Map ready! Start and Goal nodes are placed.
          </p>
        )}
      </div>

      <Legend />

      <Grid
        grid={grid}
        onCellClick={handleCellClick}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
      />

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      {pathResult && pathResult.path?.length > 0 && (
        <p className="mt-3 text-sm text-emerald-400">
          Path found! Cost: {pathResult.path_cost} steps | Cells explored:{" "}
          {pathResult.visited_order?.length ??
            pathResult.visited?.length ??
            0}
        </p>
      )}
    </div>
  );
}

export default App;
