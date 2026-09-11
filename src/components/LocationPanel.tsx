import React from 'react';
import { MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';
import type { UserLocation } from '../types';
import { NE_STATES } from '../data/states';

interface LocationPanelProps {
  location: UserLocation;
  onRequestLocation: () => void;
  onSelectState: (state: string) => void;
  isLoading: boolean;
}

export const LocationPanel: React.FC<LocationPanelProps> = ({
  location,
  onRequestLocation,
  onSelectState,
  isLoading
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-slate-100 font-semibold text-sm flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-400" />
          <span>Location Intelligence</span>
        </h3>
        <span className="text-[11px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
          GPS / MANUAL
        </span>
      </div>

      {location.status === 'idle' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 leading-relaxed">
            Allow browser location access to automatically detect your state, nearest emergency services & regional logistics routes.
          </p>
          <button
            onClick={onRequestLocation}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow"
          >
            <MapPin className="w-4 h-4" />
            <span>{isLoading ? 'Detecting Location...' : 'Detect My Location'}</span>
          </button>
        </div>
      )}

      {location.status === 'requesting' && (
        <div className="py-4 text-center space-y-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Requesting coordinates from Geolocation API...</p>
        </div>
      )}

      {(location.status === 'detected' || location.status === 'manual') && (
        <div className="space-y-3">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Detected Region:</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                {location.state || 'Northeast Region'}
              </span>
            </div>
            {location.coordinates && (
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Coordinates:</span>
                <span>
                  {location.coordinates.lat.toFixed(4)}° N, {location.coordinates.lng.toFixed(4)}° E
                </span>
              </div>
            )}
            {location.city && (
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Nearest City:</span>
                <span className="font-semibold text-slate-300">{location.city}</span>
              </div>
            )}
          </div>

          {/* Change Manual State Selection */}
          <div className="pt-2">
            <label className="block text-[11px] text-slate-400 mb-1">
              Switch Region / Manual Override:
            </label>
            <select
              value={location.state || ''}
              onChange={(e) => onSelectState(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Select a Northeast State</option>
              {NE_STATES.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {location.status === 'denied' && (
        <div className="space-y-3">
          <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-amber-300">Location Unavailable</p>
              <p className="text-slate-400 mt-0.5">Permission denied or unavailable. Please select your region manually below.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-semibold">
              Select Region:
            </label>
            <select
              defaultValue=""
              onChange={(e) => onSelectState(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Select Northeast State</option>
              {NE_STATES.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
