import { useState, useCallback } from 'react';
import type { UserLocation, Coordinates } from '../types';
import { NE_STATES } from '../data/states';
import { CITIES } from '../data/cities';

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation>({ status: 'idle' });
  const [isLoading, setIsLoading] = useState(false);

  const getNearestState = (coords: Coordinates): string => {
    let nearest = NE_STATES[0];
    let minDistance = Infinity;
    NE_STATES.forEach(state => {
      const dist = Math.pow(state.center.lat - coords.lat, 2) + Math.pow(state.center.lng - coords.lng, 2);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = state;
      }
    });
    return nearest.name;
  };

  const getNearestCity = (coords: Coordinates): string => {
    let nearest = CITIES[0];
    let minDistance = Infinity;
    CITIES.forEach(city => {
      const dist = Math.pow(city.coordinates.lat - coords.lat, 2) + Math.pow(city.coordinates.lng - coords.lng, 2);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = city;
      }
    });
    return nearest.name;
  };

  const requestLocation = useCallback(() => {
    setIsLoading(true);
    setLocation({ status: 'requesting' });
    
    if (!navigator.geolocation) {
      setLocation({ status: 'denied' });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocation({
          status: 'detected',
          coordinates: coords,
          state: getNearestState(coords),
          city: getNearestCity(coords),
          accuracy: position.coords.accuracy
        });
        setIsLoading(false);
      },
      () => {
        setLocation({ status: 'denied' });
        setIsLoading(false);
      }
    );
  }, []);

  const setManualState = useCallback((stateName: string) => {
    const stateObj = NE_STATES.find(s => s.name === stateName);
    setLocation({
      status: 'manual',
      state: stateName,
      coordinates: stateObj?.center
    });
  }, []);

  return { location, requestLocation, setManualState, isLoading };
}
