from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from algorithms.astar import astar

app = FastAPI(title="Robot Path Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PathRequest(BaseModel):
    grid: list[list[int]]
    start: list[int]
    goal: list[int]


@app.get("/")
def home():
    return {"message": "Robot Path Planner API is running"}


@app.post("/find-path")
def find_path(request: PathRequest):
    result = astar(
        request.grid,
        tuple(request.start),
        tuple(request.goal),
    )
    
    return {
        "path": [list(cell) for cell in result["path"]],
        "visited": [list(cell) for cell in result["visited"]],
        "visited_order": [
            list(cell) for cell in result["visited_order"]
        ],
        "path_cost": result["path_cost"],
    }