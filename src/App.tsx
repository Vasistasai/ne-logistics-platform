import { useState, useEffect, useMemo } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useIncidents } from './hooks/useIncidents';
import { generateMockMarkers } from './data/mockIncidents';
import { NE_STATES } from './data/states';
import { fetchLivePublicIntelligence } from './services/liveDataService';
import { normalizeMarkers } from './services/intelligenceService';

import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { IntelligenceView } from './components/IntelligenceView';
import { LocationPanel } from './components/LocationPanel';
import { EmergencyServices } from './components/EmergencyServices';
import { RegionalStatus } from './components/RegionalStatus';
import { IncidentReportForm } from './components/IncidentReportForm';
import { CommunityFeed } from './components/CommunityFeed';
import { SOSWorkflow } from './components/SOSWorkflow';

import type { MapMarker, IncidentReport, LiveDataServiceState, NavigationTab } from './types';

import { 
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const { location, requestLocation, setManualState, isLoading: isLocationLoading } = useGeolocation();
  const { incidents, addIncident } = useIncidents();
  
  const [selectedStateId, setSelectedStateId] = useState<string | undefined>(undefined);
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  // Live Public Intelligence State
  const [liveDataState, setLiveDataState] = useState<LiveDataServiceState>({
    events: [],
    isLiveLoading: true,
    liveSourceStatus: { sachet: 'fallback', imd: 'fallback', gdelt: 'fallback' },
    lastUpdated: new Date().toISOString()
  });

  // Fetch real public data on mount
  useEffect(() => {
    fetchLivePublicIntelligence().then((res) => {
      setLiveDataState(res);
    });
  }, []);

  // Derive current region name based on detected location or manual state selection
  const currentRegionName = useMemo(() => {
    if (location.state) return location.state;
    if (selectedStateId) {
      const found = NE_STATES.find(s => s.id === selectedStateId);
      return found ? found.name : undefined;
    }
    return undefined;
  }, [location.state, selectedStateId]);

  // Combine live intelligence + prototype markers + user-submitted incident markers
  const mapMarkers = useMemo(() => {
    // 1. Prototype base markers
    const baseMarkers = generateMockMarkers();
    
    // 2. Custom user submitted incidents
    const customMarkers: MapMarker[] = incidents
      .filter(inc => !baseMarkers.some(bm => bm.id === inc.id))
      .map(inc => ({
        id: inc.id,
        coordinates: inc.coordinates,
        type: 'incident' as const,
        title: `${inc.category} (${inc.location})`,
        description: inc.description,
        severity: inc.severity,
        state: inc.state,
        timestamp: inc.timestamp,
        source: inc.reportedBy,
        dataStatus: 'COMMUNITY'
      }));

    // 3. Live intelligence events converted to MapMarkers
    const liveEventsAsMarkers: MapMarker[] = liveDataState.events.map(ev => ({
      id: ev.id,
      coordinates: { lat: ev.latitude, lng: ev.longitude },
      type: ev.isOfficial 
        ? ('official-alert' as const) 
        : ev.category === 'WEATHER' 
        ? ('weather-alert' as const) 
        : ('live-news' as const),
      title: ev.title,
      description: ev.description,
      severity: ev.severity,
      state: ev.state,
      timestamp: ev.updatedTime,
      source: ev.source,
      sourceUrl: ev.sourceUrl,
      isOfficial: ev.isOfficial,
      publishedTime: ev.publishedTime,
      updatedTime: ev.updatedTime,
      dataStatus: ev.dataStatus
    }));

    return [...liveEventsAsMarkers, ...baseMarkers, ...customMarkers];
  }, [incidents, liveDataState.events]);

  const intelligenceItems = useMemo(() => normalizeMarkers(mapMarkers), [mapMarkers]);

  // Handle clicking a map marker
  const handleMarkerClick = (marker: MapMarker) => {
    setActiveMarker(marker);
  };

  // Handle submitting a new report
  const handleReportSubmit = (newReport: IncidentReport) => {
    addIncident(newReport);
  };

  const locationProps = {
    location,
    onRequestLocation: requestLocation,
    onSelectState: (stateName: string) => {
      setManualState(stateName);
      const stateObj = NE_STATES.find(s => s.name === stateName);
      if (stateObj) setSelectedStateId(stateObj.id);
    },
    isLoading: isLocationLoading
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Fixed Header */}
      <Header location={location} activeTab={activeTab} onSOSActivated={() => setIsSOSOpen(true)} onTabChange={(tab) => {
        setActiveTab(tab);
        setActiveMarker(null);
      }} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            markers={mapMarkers}
            userLocation={location}
            liveDataState={liveDataState}
            onMarkerClick={handleMarkerClick}
            onSelectState={locationProps.onSelectState}
            onSOSActivated={() => setIsSOSOpen(true)}
          />
        )}

        {activeTab === 'map' && (
          <IntelligenceView
            markers={mapMarkers}
            location={location}
            liveDataState={liveDataState}
            activeMarker={activeMarker}
            items={intelligenceItems}
            currentRegion={currentRegionName}
            onMarkerClick={handleMarkerClick}
            onCloseMarker={() => setActiveMarker(null)}
            onRequestLocation={requestLocation}
            onSelectState={locationProps.onSelectState}
            isLocationLoading={isLocationLoading}
            onSOSActivated={() => setIsSOSOpen(true)}
          />
        )}

        {activeTab === 'emergency' && (
          <section className="space-y-6 section-enter">
            <PageHeading title="Emergency Services" subtitle="Available emergency contacts for your detected region." />
            <SOSWorkflow inline location={location} currentRegion={currentRegionName} onRequestLocation={requestLocation} onClose={() => setIsSOSOpen(false)} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 space-y-6">
                <LocationPanel {...locationProps} />
                <RegionalStatus state={currentRegionName} />
              </div>
              <div className="lg:col-span-7"><EmergencyServices state={currentRegionName} /></div>
            </div>
          </section>
        )}

        {activeTab === 'report' && (
          <section className="max-w-3xl mx-auto space-y-6 section-enter">
            <PageHeading title="Report an Incident" subtitle="Help improve regional situational awareness with a community report." />
            <IncidentReportForm userLocation={location} onSubmit={handleReportSubmit} />
          </section>
        )}

        {activeTab === 'feed' && (
          <section className="space-y-6 section-enter">
            <PageHeading title="Community Intelligence" subtitle="Community reports supporting regional accessibility and logistics awareness." />
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-emerald-400 font-mono uppercase tracking-wider">Community Report Archive</span>
              <span className="text-xs text-slate-500 font-mono">{incidents.length} reports</span>
            </div>
            <CommunityFeed incidents={incidents} />
          </section>
        )}
      </main>

      {isSOSOpen && (
        <SOSWorkflow
          location={location}
          currentRegion={currentRegionName}
          onRequestLocation={requestLocation}
          onClose={() => setIsSOSOpen(false)}
          startActive
        />
      )}

      {/* Compact Clean Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© 2026 LifeLink • Emergency &amp; Intelligence Platform</p>
          <div className="flex items-center space-x-4 text-slate-400">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Full India Geographic Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const PageHeading = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="border-b border-slate-800 pb-4">
    <p className="text-[11px] text-blue-400 font-mono uppercase tracking-[0.18em] mb-2">LifeLink Platform</p>
    <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 capitalize">{title}</h2>
    <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
  </div>
);
