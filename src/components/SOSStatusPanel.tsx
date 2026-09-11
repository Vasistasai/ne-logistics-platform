import React from 'react';
import { CheckCircle2, CircleAlert, Phone, X } from 'lucide-react';
import type { SOSEvent } from '../types';
import { prepareEmergencyMessage } from '../services/sosService';

interface SOSStatusPanelProps {
  event: SOSEvent;
  onUpdate: () => void;
  onCancel: () => void;
}

export const SOSStatusPanel: React.FC<SOSStatusPanelProps> = ({ event, onUpdate, onCancel }) => {
  const prepared = event.notificationStatus === 'prepared-demo';
  const steps = [
    ['SOS activated', true],
    ['Location detected', Boolean(event.location)],
    ['Situation identified', Boolean(event.emergencyType || event.helpTypes.length)],
    ['Alert prepared', prepared]
  ];

  return (
    <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-wider text-red-300">SOS active</p>
          <h3 className="text-lg font-bold text-white mt-1">Emergency assistance requested</h3>
        </div>
        <CircleAlert className="w-6 h-6 text-red-400 shrink-0" />
      </div>
      <div className="space-y-2">
        {steps.map(([label, complete]) => <div key={label as string} className="flex items-center gap-2 text-xs"><CheckCircle2 className={`w-4 h-4 ${complete ? 'text-emerald-400' : 'text-slate-600'}`} /><span className={complete ? 'text-slate-200' : 'text-slate-500'}>{label}</span></div>)}
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
        <p className="font-semibold">Demo notification prepared</p>
        <p className="mt-1 text-amber-100/70">Live emergency messaging is not configured. Nothing was sent automatically.</p>
      </div>
      <details className="rounded-lg border border-slate-800 bg-slate-950 p-3">
        <summary className="cursor-pointer text-xs font-semibold text-slate-300">View prepared emergency message</summary>
        <pre className="mt-3 whitespace-pre-wrap text-[10px] leading-relaxed text-slate-500">{prepareEmergencyMessage(event)}</pre>
      </details>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onUpdate} className="rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 text-xs font-semibold">Update information</button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-200 px-3 py-2 text-xs font-semibold inline-flex items-center justify-center gap-1"><X className="w-3.5 h-3.5" /> Cancel emergency</button>
      </div>
      <a href="tel:112" className="w-full rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-2 text-xs font-semibold inline-flex items-center justify-center gap-2"><Phone className="w-3.5 h-3.5" /> Call 112 directly</a>
    </div>
  );
};
