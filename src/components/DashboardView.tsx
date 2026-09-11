import React from 'react';
import type { MapMarker, UserLocation, LiveDataServiceState } from '../types';
import { IndiaMap } from './IndiaMap';
import { SOSButton } from './SOSButton';
import { NE_STATES } from '../data/states';
import { REGIONAL_STATUS } from '../data/regionalStatus';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CloudRain, 
  Truck, 
  Activity, 
  Clock, 
  MapPin, 
  Layers, 
} from 'lucide-react';

interface DashboardViewProps {
  markers: MapMarker[];
  userLocation: UserLocation;
  liveDataState: LiveDataServiceState;
  onMarkerClick: (marker: MapMarker) => void;
  onSelectState: (stateName: string) => void;
  onSOSActivated: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  markers,
  userLocation,
  liveDataState,
  onMarkerClick,
  onSelectState,
  onSOSActivated
}) => {

  // Calculate real KPI statistics from current markers
  const activeAlertsCount = markers.filter(m => m.isOfficial || m.severity === 'critical' || m.type === 'official-alert').length;
  const roadDisruptionsCount = markers.filter(m => m.type === 'road-issue' || m.severity === 'high').length;
  const weatherWarningsCount = markers.filter(m => m.type === 'weather-alert' || m.title.toLowerCase().includes('rain') || m.title.toLowerCase().includes('flood')).length;
  const logisticsRisksCount = markers.filter(m => m.type === 'logistics' || m.type === 'disaster').length;

  // Recent 5 incidents
  const recentIncidents = [...markers]
    .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* System Status Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg backdrop-blur">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20 shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>LifeLink Emergency &amp; Intelligence Platform</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              National & North Eastern Region Accessibility Dashboard
            </p>
          </div>
        </div>

        <div className="flex w-full md:w-auto flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-ping" />
            <span className="text-emerald-400 font-bold">SYSTEM ONLINE</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800 text-slate-400 hidden sm:block">
            Last update: {new Date(liveDataState.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="w-full sm:w-56"><SOSButton onActivated={onSOSActivated} /></div>
        </div>
      </div>

      {/* Compact KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Active Alerts</p>
            <h3 className="text-2xl font-black text-red-400 mt-1 font-mono">{activeAlertsCount}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">High / Critical Priority</p>
          </div>
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Road Disruptions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Road Disruptions</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1 font-mono">{roadDisruptionsCount}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Corridors Affected</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Weather Warnings */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Weather Warnings</p>
            <h3 className="text-2xl font-black text-cyan-400 mt-1 font-mono">{weatherWarningsCount}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">IMD Radar Alerts</p>
          </div>
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
            <CloudRain className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Logistics Risks */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Logistics Risks</p>
            <h3 className="text-2xl font-black text-purple-400 mt-1 font-mono">{logisticsRisksCount}</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Depots Monitored</p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Truck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Intelligence Map Container */}
      <div className="space-y-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-slate-100 text-sm">Main Operations Intelligence Map</h3>
          </div>
          <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 font-mono">
            India & NE Region
          </span>
        </div>

          <div className="w-full h-[420px] sm:h-[520px]">
          <IndiaMap
            markers={markers}
            userLocation={userLocation.coordinates}
            onMarkerClick={onMarkerClick}
            liveDataState={liveDataState}
          />
        </div>
      </div>

      {/* Under Map: Recent Intelligence & Regional Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Intelligence Stream (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Recent Intelligence Feed</span>
            </h3>
            <span className="text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
              INTELLIGENCE STREAM
            </span>
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {recentIncidents.map((incident) => (
              <div 
                key={incident.id} 
                onClick={() => onMarkerClick(incident)}
                className="p-3 bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-lg cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors truncate max-w-[200px]">
                    {incident.title}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    incident.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    incident.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {incident.severity || 'normal'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {incident.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900 font-mono">
                  <span className="flex items-center gap-1 text-slate-400">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    {incident.state}
                  </span>
                  <span>{incident.source ? incident.source : 'Community Report'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Overview — Compact 8 NE State Cards (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Northeast Regional Overview (8 States)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">COMPACT STATUS</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {NE_STATES.map((state) => {
              const status = REGIONAL_STATUS[state.name];
              const isBlocked = status?.roadStatus === 'Blocked';
              const isDisrupted = status?.roadStatus === 'Disrupted';

              return (
                <div 
                  key={state.id}
                  onClick={() => onSelectState(state.name)}
                  className="p-3 bg-slate-950 border border-slate-800/80 hover:border-blue-500/50 rounded-lg cursor-pointer transition-all space-y-1.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200 group-hover:text-blue-400 transition-colors">
                      {state.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{state.abbreviation}</span>
                  </div>

                  {status && (
                    <>
                      <p className="text-[10px] text-slate-400 truncate">{status.weatherCondition}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                        <span className={`font-semibold ${isBlocked ? 'text-red-400' : isDisrupted ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {status.roadStatus}
                        </span>
                        <span className="text-slate-500">{status.temperature}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
