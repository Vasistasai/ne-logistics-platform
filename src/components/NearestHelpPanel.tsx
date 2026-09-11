import React from 'react';
import { Phone, ShieldCheck } from 'lucide-react';
import type { SOSNearestService } from '../types';

interface NearestHelpPanelProps {
  service?: SOSNearestService;
}

export const NearestHelpPanel: React.FC<NearestHelpPanelProps> = ({ service }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Nearest configured assistance</div>
    {service ? (
      <>
        <p className="text-sm font-semibold text-slate-100">{service.name}</p>
        <p className="text-xs text-slate-400">{service.description}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] text-slate-500">Source: {service.source}</span>
          <a href={`tel:${service.number}`} className="inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 text-xs font-mono text-cyan-300"><Phone className="w-3 h-3" /> {service.number}</a>
        </div>
      </>
    ) : <p className="text-xs text-slate-500">Select the help you need to identify a configured contact. Distance and availability are unavailable.</p>}
  </div>
);
