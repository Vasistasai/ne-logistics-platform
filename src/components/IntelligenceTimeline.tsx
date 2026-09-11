import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import type { IntelligenceItem } from '../types';
import { formatFreshness, sortByRecency } from '../services/intelligenceService';

interface IntelligenceTimelineProps {
  items: IntelligenceItem[];
  onSelect: (item: IntelligenceItem) => void;
}

export const IntelligenceTimeline: React.FC<IntelligenceTimelineProps> = ({ items, onSelect }) => (
  <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
      <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-400" /> Latest Intelligence</h3>
      <span className="text-[10px] text-slate-500 font-mono">{items.length} items</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
      {sortByRecency(items).slice(0, 8).map((item) => (
        <button key={item.id} onClick={() => onSelect(item)} className="text-left p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-lg transition-colors">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[9px] font-mono uppercase ${item.severity === 'critical' ? 'text-red-400' : item.severity === 'high' ? 'text-orange-400' : 'text-slate-500'}`}>{item.severity || 'normal'}</span>
            <span className="text-[9px] font-mono text-cyan-400">{item.status}</span>
          </div>
          <p className="text-xs font-semibold text-slate-200 line-clamp-2">{item.title}</p>
          <div className="mt-2 text-[10px] text-slate-500 space-y-1">
            <p className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400" />{item.location}</p>
            <p>{formatFreshness(item.timestamp)} · {item.source}</p>
          </div>
        </button>
      ))}
    </div>
  </section>
);
