import React from 'react';
import { AlertTriangle, ExternalLink, MapPin } from 'lucide-react';
import type { LiveDataServiceState, MapMarker, UserLocation } from '../types';
import { IndiaMap } from './IndiaMap';
import { LocationPanel } from './LocationPanel';
import { IntelligenceAssistant } from './IntelligenceAssistant';
import { IntelligenceTimeline } from './IntelligenceTimeline';
import { DataSourcesPanel } from './DataSourcesPanel';
import { SOSButton } from './SOSButton';
import type { IntelligenceItem } from '../types';

interface IntelligenceViewProps {
  markers: MapMarker[];
  location: UserLocation;
  liveDataState: LiveDataServiceState;
  items: IntelligenceItem[];
  currentRegion?: string;
  activeMarker: MapMarker | null;
  onMarkerClick: (marker: MapMarker) => void;
  onCloseMarker: () => void;
  onRequestLocation: () => void;
  onSelectState: (stateName: string) => void;
  isLocationLoading: boolean;
  onSOSActivated: () => void;
}

export const IntelligenceView: React.FC<IntelligenceViewProps> = ({
  markers,
  location,
  liveDataState,
  activeMarker,
  onMarkerClick,
  onCloseMarker,
  items,
  currentRegion,
  onRequestLocation,
  onSelectState,
  isLocationLoading,
  onSOSActivated
}) => (
  <section className="space-y-6 section-enter">
    <div className="border-b border-slate-800 pb-4">
      <p className="text-[11px] text-blue-400 font-mono uppercase tracking-[0.18em] mb-2">Intelligence Workspace</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">National Intelligence</h2>
      <p className="text-sm text-slate-400 mt-1">India-wide logistics, accessibility and disaster intelligence</p>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <div className="xl:col-span-8 h-[min(72vh,720px)] min-h-[360px] sm:min-h-[460px] xl:min-h-[560px]">
        <div className="mb-3 max-w-xs"><SOSButton onActivated={onSOSActivated} /></div>
        <IndiaMap
          markers={markers}
          userLocation={location.coordinates}
          onMarkerClick={onMarkerClick}
          liveDataState={liveDataState}
          focusMarker={activeMarker}
        />
      </div>

      <aside className="xl:col-span-4 space-y-4">
        <IntelligenceAssistant
          items={items}
          currentRegion={currentRegion}
          onViewItem={(item) => {
            const marker = markers.find((candidate) => candidate.id === item.id);
            if (marker) onMarkerClick(marker);
          }}
        />

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-[250px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-slate-100">Selected Intelligence</h3>
            {activeMarker && <button onClick={onCloseMarker} className="text-xs text-slate-500 hover:text-slate-200">Clear</button>}
          </div>

          {activeMarker ? (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-100 leading-snug">{activeMarker.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400" />{activeMarker.state}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 border border-slate-800 rounded-lg p-3">{activeMarker.description}</p>
              <div className="flex items-center justify-between text-[10px] font-mono uppercase border-t border-slate-800 pt-3">
                <span className="text-slate-500">{activeMarker.isOfficial ? 'Official Alert' : activeMarker.type}</span>
                <span className={activeMarker.severity === 'critical' ? 'text-red-400' : 'text-amber-400'}>{activeMarker.severity || 'Normal'}</span>
              </div>
              {activeMarker.sourceUrl && (
                <a href={activeMarker.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1">
                  View source <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ) : (
            <div className="flex min-h-[180px] items-center justify-center text-center text-xs text-slate-500">
              Select a marker or intelligence event to inspect its details.
            </div>
          )}
        </div>

        <DataSourcesPanel liveDataState={liveDataState} />

        <LocationPanel
          location={location}
          onRequestLocation={onRequestLocation}
          onSelectState={onSelectState}
          isLoading={isLocationLoading}
        />
      </aside>
    </div>

    <IntelligenceTimeline
      items={items}
      onSelect={(item) => {
        const marker = markers.find((candidate) => candidate.id === item.id);
        if (marker) onMarkerClick(marker);
      }}
    />
  </section>
);
