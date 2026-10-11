const legendItems = [
    { label: "Start", color: "bg-green-500" },
    { label: "Goal", color: "bg-red-500" },
    { label: "Wall", color: "bg-slate-800" },
    { label: "Visited", color: "bg-blue-400" },
    { label: "Final Path", color: "bg-yellow-400" },
    { label: "Empty", color: "bg-slate-950 border border-slate-700" },
]

export default function Legend() {
    return (
        <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y03 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
            {legendItems.map((item) => (
                <div key={item.label} className="flex item-center gap-2">
                    <span
                        className={`h-4 w-4 rounded-sm ${item.color}`}
                    />
                    <span className="text-sm text-slate-300">
                        {item.label}
                    </span>
                </div>
            ))}
        </div>
    )
}