import type { IntelligenceItem, MapMarker } from '../types';

export function normalizeMarkers(markers: MapMarker[]): IntelligenceItem[] {
  return markers.map((marker) => {
    const status = marker.dataStatus || (marker.type === 'incident' || marker.type === 'user' ? 'COMMUNITY' : 'DEMO');
    return {
      id: marker.id,
      type: marker.type,
      title: marker.title,
      description: marker.description,
      severity: marker.severity,
      location: marker.state,
      coordinates: marker.coordinates,
      timestamp: marker.timestamp,
      source: marker.source || (status === 'COMMUNITY' ? 'Local community report' : 'Seed intelligence dataset'),
      sourceUrl: marker.sourceUrl,
      status,
      isLive: status === 'LIVE',
      isCached: status === 'CACHED',
      isCommunity: status === 'COMMUNITY'
    };
  });
}

export function sortByRecency(items: IntelligenceItem[]): IntelligenceItem[] {
  return [...items].sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
}

export function formatFreshness(timestamp?: string): string {
  if (!timestamp) return 'Timestamp unavailable';
  return new Date(timestamp).toLocaleString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}
