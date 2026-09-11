import React from 'react';
import { Database, Radio } from 'lucide-react';
import type { LiveDataServiceState } from '../types';

interface DataSourcesPanelProps {
  liveDataState: LiveDataServiceState;
}

const sourceTone = (status: string) => {
  if (status === 'LIVE') return 'text-emerald-400';
  if (status === 'UNAVAILABLE') return 'text-red-400';
  if (status === 'COMMUNITY') return 'text-emerald-400';
  return 'text-amber-400';
};

export const DataSourcesPanel: React.FC<DataSourcesPanelProps> = ({ liveDataState }) => {
  const gdeltStatus = liveDataState.liveSourceStatus.gdelt === 'connected' ? 'LIVE' : 'UNAVAILABLE';
  const sources = [
    ['GDELT news connector', gdeltStatus],
    ['Official disaster bulletins', 'DEMO'],
    ['Regional weather status', 'DEMO'],
    ['Community reports', 'COMMUNITY'],
    ['Logistics corridors and hubs', 'DEMO']
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-3">
        <Database className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-slate-100">Data Sources</h3>
      </div>
      <div className="space-y-2">
        {sources.map(([label, status]) => (
          <div key={label} className="flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 flex items-center gap-2"><Radio className="w-3 h-3 text-slate-600" />{label}</span>
            <span className={`font-mono text-[10px] font-semibold ${sourceTone(status)}`}>{status}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-slate-600 mt-3 pt-3 border-t border-slate-800">Connector check: {new Date(liveDataState.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    </div>
  );
};
