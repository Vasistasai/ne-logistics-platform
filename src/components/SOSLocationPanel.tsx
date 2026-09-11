import React from 'react';
import { LocateFixed, MapPin } from 'lucide-react';
import type { UserLocation } from '../types';

interface SOSLocationPanelProps {
  location: UserLocation;
  onRequestLocation: () => void;
  onSelectState: (state: string) => void;
}

export const SOSLocationPanel: React.FC<SOSLocationPanelProps> = ({ location, onRequestLocation, onSelectState }) => {
  const isDetected = location.status === 'detected' && location.coordinates;
  const isManual = location.status === 'manual' && location.state;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
        <MapPin className="w-4 h-4 text-red-400" /> Location for emergency alert
      </div>
      <p className="text-[11px] text-slate-400 leading-relaxed">
        Your location is used to identify configured emergency assistance and include your position in the alert.
      </p>
      {isDetected ? (
        <div className="text-xs space-y-1">
          <p className="text-emerald-400 font-semibold">Location detected</p>
          <p className="text-slate-300">Near {location.city || location.state || 'known area'}, {location.state || 'India'}</p>
          {location.accuracy && <p className="text-[10px] text-slate-500">Browser accuracy: approximately {Math.round(location.accuracy)} m</p>}
        </div>
      ) : isManual ? (
        <div className="text-xs space-y-1">
          <p className="text-amber-300 font-semibold">Manual region selected</p>
          <p className="text-slate-300">Near {location.state}</p>
          <p className="text-[10px] text-slate-500">GPS location was not confirmed.</p>
        </div>
      ) : location.status === 'requesting' ? (
        <p className="text-xs text-cyan-300">Requesting browser location...</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-amber-300">Location unavailable</p>
          <button type="button" onClick={onRequestLocation} className="w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold py-2 flex items-center justify-center gap-2">
            <LocateFixed className="w-3.5 h-3.5" /> Request location
          </button>
          <select defaultValue="" onChange={(event) => onSelectState(event.target.value)} className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200">
            <option value="" disabled>Select manual region</option>
            <option>Arunachal Pradesh</option>
            <option>Assam</option>
            <option>Manipur</option>
            <option>Meghalaya</option>
            <option>Mizoram</option>
            <option>Nagaland</option>
            <option>Sikkim</option>
            <option>Tripura</option>
          </select>
        </div>
      )}
    </div>
  );
};
