import type { LiveIntelligenceEvent, LiveDataServiceState } from '../types';

// Static fixtures remain available for demonstration when the public connector is unavailable.
const DEMO_PUBLIC_BULLETINS: LiveIntelligenceEvent[] = [
  {
    id: 'sachet-01',
    title: 'NDMA Severe Flood Warning — Brahmaputra River Basin',
    category: 'DISASTER',
    severity: 'critical',
    latitude: 26.1833,
    longitude: 91.7333,
    source: 'NDMA / SACHET Disaster Alert Portal',
    sourceUrl: 'https://sachet.ndma.gov.in/',
    publishedTime: '2026-09-11T08:30:00Z',
    updatedTime: '2026-09-11T10:15:00Z',
    description: 'Official Red Alert: Water levels in Brahmaputra exceeding danger threshold in Kamrup Metropolitan and Morigaon districts. NDRF teams deployed.',
    isOfficial: true,
    state: 'Assam',
    dataStatus: 'DEMO'
  },
  {
    id: 'imd-01',
    title: 'IMD Heavy Rainfall & Cloudburst Watch — Meghalaya Hills',
    category: 'WEATHER',
    severity: 'high',
    latitude: 25.5788,
    longitude: 91.8933,
    source: 'India Meteorological Department (IMD)',
    sourceUrl: 'https://mausam.imd.gov.in/',
    publishedTime: '2026-09-11T06:00:00Z',
    updatedTime: '2026-09-11T09:45:00Z',
    description: 'Orange Warning: Extremely heavy rainfall (>200mm) expected in East Khasi Hills and Cherrapunji region. Risk of flash floods and landslides.',
    isOfficial: true,
    state: 'Meghalaya',
    dataStatus: 'DEMO'
  },
  {
    id: 'sachet-02',
    title: 'NH-29 Highway Corridor Blockade Alert',
    category: 'ROAD',
    severity: 'high',
    latitude: 25.8078,
    longitude: 93.7744,
    source: 'BRO / Nagaland State Disaster Management',
    sourceUrl: 'https://nsdma.nagaland.gov.in/',
    publishedTime: '2026-09-11T07:15:00Z',
    updatedTime: '2026-09-11T11:00:00Z',
    description: 'Major rockfall and road erosion near Chumukedima. Freight traffic rerouted via alternative district roads.',
    isOfficial: true,
    state: 'Nagaland',
    dataStatus: 'DEMO'
  },
  {
    id: 'gdelt-01',
    title: 'Monsoon Disruption & Supply Logistics Notice',
    category: 'NEWS',
    severity: 'medium',
    latitude: 27.5866,
    longitude: 91.8661,
    source: 'GDELT Project (Geographic News Mining)',
    sourceUrl: 'https://www.gdeltproject.org/',
    publishedTime: '2026-09-10T18:20:00Z',
    updatedTime: '2026-09-11T04:30:00Z',
    description: 'Unverified Media Report: Essential commodity movement delayed along Tawang sector. Note: News intelligence is not an official government alert.',
    isOfficial: false,
    state: 'Arunachal Pradesh',
    dataStatus: 'DEMO'
  },
  {
    id: 'imd-02',
    title: 'IMD Coastal & Cyclone Advisory — Bay of Bengal',
    category: 'WEATHER',
    severity: 'medium',
    latitude: 21.6444,
    longitude: 88.0774,
    source: 'India Meteorological Department (IMD)',
    sourceUrl: 'https://mausam.imd.gov.in/',
    publishedTime: '2026-09-11T05:00:00Z',
    updatedTime: '2026-09-11T10:00:00Z',
    description: 'Squally winds 45-55 kmph along West Bengal and North Odisha coast. Fishermen advised not to venture into deep sea.',
    isOfficial: true,
    state: 'West Bengal',
    dataStatus: 'DEMO'
  },
  {
    id: 'log-01',
    title: 'Siliguri Corridor ("Chicken\'s Neck") Freight Flow',
    category: 'LOGISTICS',
    severity: 'low',
    latitude: 26.7271,
    longitude: 88.3953,
    source: 'Logistics Operations Control',
    sourceUrl: 'https://lpis.nhai.gov.in/',
    publishedTime: '2026-09-11T07:00:00Z',
    updatedTime: '2026-09-11T11:30:00Z',
    description: 'Siliguri multi-modal transit hub operating at normal throughput. Green corridor active for essential food and medical freight to NE states.',
    isOfficial: true,
    state: 'West Bengal',
    dataStatus: 'DEMO'
  }
];

export async function fetchLivePublicIntelligence(): Promise<LiveDataServiceState> {
  const resultState: LiveDataServiceState = {
    events: [],
    isLiveLoading: true,
    liveSourceStatus: {
      sachet: 'fallback',
      imd: 'fallback',
      gdelt: 'fallback'
    },
    lastUpdated: new Date().toISOString()
  };

  const fetchedEvents: LiveIntelligenceEvent[] = [];

  // 1. Try fetching real GDELT GeoJSON API
  try {
    const gdeltUrl = 'https://api.gdeltproject.org/api/v2/geo/geo?query=India%20flood%20OR%20landslide%20OR%20disaster%20OR%20highway&format=geojson';
    const response = await fetch(gdeltUrl, { method: 'GET', signal: AbortSignal.timeout(4000) });
    
    if (response.ok) {
      const geojson = await response.json();
      if (geojson && geojson.features && Array.isArray(geojson.features)) {
        resultState.liveSourceStatus.gdelt = 'connected';
        
        geojson.features.slice(0, 10).forEach((feat: any, index: number) => {
          if (feat.geometry && feat.geometry.coordinates) {
            const [lng, lat] = feat.geometry.coordinates;
            // Only add if within India bounding box (approx lat 6-37, lng 68-98)
            if (lat >= 6 && lat <= 37 && lng >= 68 && lng <= 98) {
              const props = feat.properties || {};
              fetchedEvents.push({
                id: `gdelt-live-${index}`,
                title: props.name || props.html || 'Live News Geographic Event',
                category: 'NEWS',
                severity: 'medium',
                latitude: lat,
                longitude: lng,
                source: 'GDELT Project (Live API)',
                sourceUrl: props.url || 'https://www.gdeltproject.org/',
                publishedTime: new Date().toISOString(),
                updatedTime: new Date().toISOString(),
                description: `Live news intelligence extracted by GDELT. (Note: Media report, not official government alert).`,
                isOfficial: false,
                state: 'India',
                dataStatus: 'LIVE'
              });
            }
          }
        });
      }
    } else {
      resultState.liveSourceStatus.gdelt = 'blocked';
    }
  } catch {
    // CORS or network timeout limit hit in browser
    resultState.liveSourceStatus.gdelt = 'blocked';
  }

  // 2. Combine fetched events with clearly labelled demo fixtures
  if (fetchedEvents.length > 0) {
    resultState.events = [...fetchedEvents, ...DEMO_PUBLIC_BULLETINS];
  } else {
    // Keep the workspace populated for demonstration when the public connector is unavailable.
    resultState.events = DEMO_PUBLIC_BULLETINS;
  }

  resultState.isLiveLoading = false;
  return resultState;
}
