function Cell({ 
    cell, 
    onClick,
    onMouseDown,
    onMouseEnter,
 }) {
  const getCellStyle = () => {
    switch (cell.type) {
      case "wall":
        return "bg-slate-800"

      case "start":
        return "bg-green-500"

      case "goal":
        return "bg-red-500"

      case "visited":
        return "bg-blue-400"

      case "path":
        return "bg-yellow-400"

      default:
        return "bg-slate-950"
    }
  }

  return (
    <div
      onClick={() => onClick(cell.row, cell.col)}
      onMouseDown={() => onMouseDown(cell.row, cell.col)}
      onMouseEnter={() => onMouseEnter(cell.row, cell.col)}
      onDragStart={(e) => e.preventDefault()}
      className={`h-6 w-6 shrink-0 cursor-pointer border border-slate-800/80 transition-colors duration-100 hover:brightness-125 ${getCellStyle()}`}
    />
  )
}

export default Cell