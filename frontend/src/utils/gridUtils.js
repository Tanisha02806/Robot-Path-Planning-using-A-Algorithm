export const ROWS = 20
export const COLS = 35

export function createEmptyGrid() {
  const grid = []

  for (let row = 0; row < ROWS; row++) {
    const currentRow = []

    for (let col = 0; col < COLS; col++) {
      currentRow.push({
        row,
        col,
        type: "empty",
      })
    }

    grid.push(currentRow)
  }

  return grid
}