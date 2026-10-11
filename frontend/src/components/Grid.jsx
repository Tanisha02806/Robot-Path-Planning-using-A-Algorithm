import Cell from "./Cell"

function Grid({ 
    grid, 
    onCellClick,
    onMouseDown,
    onMouseEnter,
 }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-3 w-max">
        <div className="w-max">
            <div className="inline-block border border-slate-700 w-max">
            {grid.map((row, rowIndex) => (
                <div
                key={rowIndex}
                className="flex w-max"
                >
                {row.map((cell) => (
                    <Cell
                    key={`${cell.row}-${cell.col}`}
                    cell={cell}
                    onClick={onCellClick}
                    onMouseDown={onMouseDown}
                    onMouseEnter={onMouseEnter}
                    />
                ))}
                </div>
            ))}
            </div>
        </div>
    </div>
  )
}

export default Grid