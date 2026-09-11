export function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 backdrop-blur rounded-lg p-3 shadow-xl space-y-2 text-xs">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-1">
        Map Legend
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-red-500 rounded-sm rotate-45 border border-red-700" />
          <span className="text-slate-300">Disaster Alert</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-orange-500 rounded-sm rotate-45 border border-orange-700" />
          <span className="text-slate-300">Road Blocked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-blue-500 rounded-sm border border-blue-700" />
          <span className="text-slate-300">Logistics Hub</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full border border-yellow-700" />
          <span className="text-slate-300">User Incident</span>
        </div>
      </div>
    </div>
  );
}
