interface MapTooltipProps {
  visible: boolean;
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  type?: string;
}

export function MapTooltip({ visible, x, y, title, subtitle, type }: MapTooltipProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none bg-slate-900/95 border border-slate-700 backdrop-blur rounded-lg p-2.5 shadow-2xl text-xs max-w-xs space-y-1 transform -translate-x-1/2 -translate-y-full mb-2"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-bold text-slate-100">{title}</span>
        {type && (
          <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded uppercase">
            {type}
          </span>
        )}
      </div>
      {subtitle && <p className="text-slate-400 text-[11px] leading-tight">{subtitle}</p>}
    </div>
  );
}
