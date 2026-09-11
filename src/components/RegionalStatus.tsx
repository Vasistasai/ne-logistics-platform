import React from 'react';
import { Cloud, CloudRain, Sun, Activity } from 'lucide-react';
import { REGIONAL_STATUS } from '../data/regionalStatus';

interface RegionalStatusProps {
  state?: string;
}

export const RegionalStatus: React.FC<RegionalStatusProps> = ({ state }) => {
  if (!state || !REGIONAL_STATUS[state]) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg text-center">
        <Activity className="w-6 h-6 text-slate-600 mx-auto mb-2" />
        <h4 className="text-xs font-semibold text-slate-400">Regional Overview Status</h4>
        <p className="text-[11px] text-slate-500 mt-1">Select a state on the map or in the panel to view weather & route risk index.</p>
      </div>
    );
  }

  const status = REGIONAL_STATUS[state];

  const getWeatherIcon = (condition: string) => {
    if (condition.toLowerCase().includes('rain')) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (condition.toLowerCase().includes('cloud')) return <Cloud className="w-5 h-5 text-slate-400" />;
    return <Sun className="w-5 h-5 text-amber-400" />;
  };

  const getRiskBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono text-[11px] font-bold">CRITICAL RISK</span>;
      case 'high':
        return <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-mono text-[11px] font-bold">HIGH RISK</span>;
      case 'moderate':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono text-[11px] font-bold">MODERATE</span>;
      default:
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono text-[11px] font-bold">LOW RISK</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-slate-100 font-semibold text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <span>Regional Status — {state}</span>
        </h3>
        {getRiskBadge(status.riskLevel)}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center space-x-3">
          <div className="p-1.5 bg-slate-800 rounded-md">
            {getWeatherIcon(status.weatherCondition)}
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Weather</p>
            <p className="font-semibold text-slate-200">{status.weatherCondition}, {status.temperature}</p>
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
          <p className="text-[11px] text-slate-400">Road Corridor Status</p>
          <p className={`font-bold ${status.roadStatus === 'Normal' ? 'text-emerald-400' : status.roadStatus === 'Disrupted' ? 'text-amber-400' : 'text-red-400'}`}>
            {status.roadStatus}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
        <span className="text-slate-400">Active Vulnerability Alerts:</span>
        <span className="font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
          {status.activeAlerts} Alerts Pinned
        </span>
      </div>
    </div>
  );
};
