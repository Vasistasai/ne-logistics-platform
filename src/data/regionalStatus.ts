import type { RegionalStatus } from '../types';

export const REGIONAL_STATUS: Record<string, RegionalStatus> = {
  'Arunachal Pradesh': {
    state: 'Arunachal Pradesh',
    weatherCondition: 'Heavy Heavy Rainfall',
    temperature: '18°C',
    roadStatus: 'Blocked',
    activeAlerts: 4,
    riskLevel: 'Critical'
  },
  'Assam': {
    state: 'Assam',
    weatherCondition: 'Moderate Rain & Inundation',
    temperature: '28°C',
    roadStatus: 'Disrupted',
    activeAlerts: 6,
    riskLevel: 'High'
  },
  'Manipur': {
    state: 'Manipur',
    weatherCondition: 'Partly Cloudy',
    temperature: '24°C',
    roadStatus: 'Normal',
    activeAlerts: 2,
    riskLevel: 'Moderate'
  },
  'Meghalaya': {
    state: 'Meghalaya',
    weatherCondition: 'Torrential Downpour',
    temperature: '20°C',
    roadStatus: 'Disrupted',
    activeAlerts: 5,
    riskLevel: 'High'
  },
  'Mizoram': {
    state: 'Mizoram',
    weatherCondition: 'Overcast & Fog',
    temperature: '22°C',
    roadStatus: 'Normal',
    activeAlerts: 1,
    riskLevel: 'Low'
  },
  'Nagaland': {
    state: 'Nagaland',
    weatherCondition: 'Scattered Showers',
    temperature: '21°C',
    roadStatus: 'Blocked',
    activeAlerts: 3,
    riskLevel: 'High'
  },
  'Sikkim': {
    state: 'Sikkim',
    weatherCondition: 'Mountain Mist',
    temperature: '15°C',
    roadStatus: 'Normal',
    activeAlerts: 1,
    riskLevel: 'Low'
  },
  'Tripura': {
    state: 'Tripura',
    weatherCondition: 'Humid & Thunderstorms',
    temperature: '30°C',
    roadStatus: 'Normal',
    activeAlerts: 2,
    riskLevel: 'Moderate'
  }
};
