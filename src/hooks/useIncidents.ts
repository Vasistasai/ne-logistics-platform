import { useState, useCallback } from 'react';
import type { IncidentReport } from '../types';
import { MOCK_INCIDENTS } from '../data/mockIncidents';

const STORAGE_KEY = 'ne-platform-incidents';

export function useIncidents() {
  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return [...MOCK_INCIDENTS, ...parsed];
      } catch {
        return MOCK_INCIDENTS;
      }
    }
    return MOCK_INCIDENTS;
  });

  const addIncident = useCallback((report: IncidentReport) => {
    setIncidents(prev => {
      const newIncidents = [report, ...prev];
      const customIncidents = newIncidents.filter(i => !MOCK_INCIDENTS.some(mi => mi.id === i.id));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customIncidents));
      return newIncidents;
    });
  }, []);

  return { incidents, addIncident };
}
