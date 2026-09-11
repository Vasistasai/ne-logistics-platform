import type { IntelligenceItem } from '../types';
import { formatFreshness, sortByRecency } from './intelligenceService';

export interface LocalEvidenceResult {
  summary: string;
  matchedItems: IntelligenceItem[];
}

const getQueryTerms = (query: string) => query.toLowerCase().split(/\s+/).filter((term) => term.length > 2);

export function createLocalEvidenceSummary(
  query: string,
  items: IntelligenceItem[],
  currentRegion?: string
): LocalEvidenceResult {
  const terms = getQueryTerms(query);
  const isSevereQuery = /severe|serious|critical|highest|major/i.test(query);
  const requestedType = /road|route|highway|disruption/i.test(query)
    ? 'road-issue'
    : /weather|rain|storm|warning/i.test(query)
    ? 'weather-alert'
    : /logistics|warehouse|freight|supply/i.test(query)
    ? 'logistics'
    : /community|report|incident/i.test(query)
    ? 'incident'
    : undefined;
  const mentionedRegion = [...new Set(items.map((item) => item.location))]
    .find((location) => new RegExp(location.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(query));
  const region = mentionedRegion || (currentRegion && new RegExp(currentRegion, 'i').test(query) ? currentRegion : undefined);

  let matchedItems = sortByRecency(items).filter((item) => {
    const searchable = `${item.title} ${item.description} ${item.location} ${item.type} ${item.source}`.toLowerCase();
    const matchesTerms = terms.length === 0 || terms.some((term) => searchable.includes(term));
    const matchesRegion = !region || item.location.toLowerCase() === region.toLowerCase();
    const matchesSeverity = !isSevereQuery || item.severity === 'critical' || item.severity === 'high';
    const matchesType = !requestedType || item.type === requestedType;
    return matchesTerms && matchesRegion && matchesSeverity && matchesType;
  });

  if (matchedItems.length === 0 && region && !requestedType) {
    matchedItems = sortByRecency(items).filter((item) => item.location.toLowerCase() === region.toLowerCase());
  }

  if (matchedItems.length === 0) {
    return {
      summary: 'No matching intelligence items were found in the application data. Try a region, hazard type, or severity such as Assam, road, weather, or critical.',
      matchedItems: []
    };
  }

  const critical = matchedItems.filter((item) => item.severity === 'critical').length;
  const high = matchedItems.filter((item) => item.severity === 'high').length;
  const locations = [...new Set(matchedItems.map((item) => item.location))].slice(0, 3).join(', ');
  const latest = matchedItems[0];
  const freshness = latest.timestamp ? formatFreshness(latest.timestamp) : 'timestamp unavailable';

  return {
    summary: `${matchedItems.length} matching item${matchedItems.length === 1 ? '' : 's'} found${locations ? ` across ${locations}` : ''}. ${critical} critical and ${high} high-severity item${high === 1 ? '' : 's'}. Highest-priority item: ${latest.title}. Latest source timestamp: ${freshness}.`,
    matchedItems
  };
}
