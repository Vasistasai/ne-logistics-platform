import type { IncidentReport, MapMarker } from '../types';

export const MOCK_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-1',
    category: 'Landslide',
    description: 'Major landslide blocking NH-29 corridor between Dimapur and Kohima.',
    location: 'Chumukedima Highway',
    state: 'Nagaland',
    coordinates: { lat: 25.8078, lng: 93.7744 },
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&auto=format&fit=crop&q=60',
    severity: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    reportedBy: 'Regional Highway Patrol'
  },
  {
    id: 'inc-2',
    category: 'Flood',
    description: 'Brahmaputra water levels overflowing near low-lying logistics corridors.',
    location: 'Guwahati Outskirts',
    state: 'Assam',
    coordinates: { lat: 26.1445, lng: 91.7362 },
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600&auto=format&fit=crop&q=60',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    reportedBy: 'Assam Disaster Sentinel'
  },
  {
    id: 'inc-3',
    category: 'Road Damage',
    description: 'Culvert structural collapse due to torrential rain on Tawang access road.',
    location: 'Near Tawang Pass',
    state: 'Arunachal Pradesh',
    coordinates: { lat: 27.5866, lng: 91.8661 },
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=60',
    severity: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    reportedBy: 'BRO Inspection Team'
  },
  {
    id: 'inc-4',
    category: 'Infrastructure Damage',
    description: 'Electrical grid pole collapse blocking secondary supply truck route.',
    location: 'Shillong Bypass',
    state: 'Meghalaya',
    coordinates: { lat: 25.5788, lng: 91.8933 },
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600&auto=format&fit=crop&q=60',
    severity: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    reportedBy: 'Power Grid Sentinel'
  },
  {
    id: 'inc-5',
    category: 'Landslide',
    description: 'Minor debris accumulation cleared to single-lane traffic.',
    location: 'Nathu La Sector',
    state: 'Sikkim',
    coordinates: { lat: 27.3866, lng: 88.8310 },
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=60',
    severity: 'low',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    reportedBy: 'Border Logistics Unit'
  },
  {
    id: 'inc-6',
    category: 'Flood',
    description: 'Urban waterlogging affecting warehouse loading docks.',
    location: 'Agartala Freight Depot',
    state: 'Tripura',
    coordinates: { lat: 23.8315, lng: 91.2868 },
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=60',
    severity: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    reportedBy: 'Civic Intelligence'
  }
];

export function generateMockMarkers(): MapMarker[] {
  const markers: MapMarker[] = MOCK_INCIDENTS.map(inc => ({
    id: inc.id,
    coordinates: inc.coordinates,
    type: inc.category === 'Flood' || inc.category === 'Landslide' ? 'disaster' : 'road-issue',
    title: `${inc.category} — ${inc.location}`,
    description: inc.description,
    severity: inc.severity,
    state: inc.state,
    timestamp: inc.timestamp
  }));
  
  // Logistics hubs
  markers.push({
    id: 'log-1',
    coordinates: { lat: 26.1445, lng: 91.7362 },
    type: 'logistics',
    title: 'Guwahati Intermodal Logistics Hub',
    description: 'Primary Northeast distribution node operating at 95% capacity.',
    state: 'Assam'
  });
  markers.push({
    id: 'log-2',
    coordinates: { lat: 24.8170, lng: 93.9368 },
    type: 'logistics',
    title: 'Imphal Relief & Freight Depot',
    description: 'Emergency medicine & supply stockpile base.',
    state: 'Manipur'
  });
  markers.push({
    id: 'log-3',
    coordinates: { lat: 23.7271, lng: 92.7176 },
    type: 'logistics',
    title: 'Aizawl Logistics Gateway',
    description: 'Southern NE corridor staging depot.',
    state: 'Mizoram'
  });
  
  return markers;
}
