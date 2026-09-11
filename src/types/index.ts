export interface Coordinates {
  lat: number;
  lng: number;
}

export interface NEState {
  id: string;
  name: string;
  capital: string;
  abbreviation: string;
  center: Coordinates;
  color: string; // hex color for map
}

export interface City {
  id: string;
  name: string;
  state: string;
  coordinates: Coordinates;
  type: 'capital' | 'major' | 'town';
}

export interface MapMarker {
  id: string;
  coordinates: Coordinates;
  type: 'disaster' | 'road-issue' | 'logistics' | 'user' | 'incident' | 'official-alert' | 'weather-alert' | 'live-news';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  state: string;
  timestamp?: string;
  source?: string;
  sourceUrl?: string;
  isOfficial?: boolean;
  publishedTime?: string;
  updatedTime?: string;
  dataStatus?: IntelligenceStatus;
}

export type IntelligenceStatus = 'LIVE' | 'CACHED' | 'DEMO' | 'COMMUNITY' | 'UNAVAILABLE';

export interface IntelligenceItem {
  id: string;
  type: MapMarker['type'];
  title: string;
  description: string;
  severity?: MapMarker['severity'];
  location: string;
  coordinates: Coordinates;
  timestamp?: string;
  source: string;
  sourceUrl?: string;
  status: IntelligenceStatus;
  isLive: boolean;
  isCached: boolean;
  isCommunity: boolean;
}

export type IncidentCategory = 'Flood' | 'Landslide' | 'Road Damage' | 'Infrastructure Damage' | 'Other';

export interface IncidentReport {
  id: string;
  category: IncidentCategory;
  description: string;
  location: string;
  state: string;
  coordinates: Coordinates;
  imageUrl: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  reportedBy: string;
}

export interface EmergencyService {
  name: string;
  number: string;
  icon: string; // lucide icon name
  description: string;
}

export interface RegionalEmergency {
  state: string;
  services: EmergencyService[];
}

export interface RegionalStatus {
  state: string;
  weatherCondition: string;
  temperature: string;
  roadStatus: 'Normal' | 'Disrupted' | 'Blocked';
  activeAlerts: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export type LocationStatus = 'idle' | 'requesting' | 'detected' | 'denied' | 'manual';

export interface UserLocation {
  status: LocationStatus;
  coordinates?: Coordinates;
  state?: string;
  city?: string;
  accuracy?: number;
}

export type SOSStatus = 'draft' | 'active' | 'cancelled' | 'completed';
export type SOSNotificationStatus = 'not-sent' | 'prepared-demo' | 'sent' | 'failed';
export type SOSResponse = 'yes' | 'no' | 'not-sure';
export type SOSHelpType = 'Medical' | 'Police' | 'Fire / Rescue' | 'Road assistance' | 'General emergency' | 'Not sure';
export type SOSSituation = 'Accident' | 'Medical emergency' | 'Road blockage' | 'Fire' | 'Flood' | 'Landslide' | 'Unsafe situation' | 'Other';

export interface EmergencyContact {
  name: string;
  number: string;
}

export interface SOSNearestService {
  name: string;
  number: string;
  description: string;
  source: string;
}

export interface SOSEvent {
  id: string;
  status: SOSStatus;
  createdAt: string;
  location?: Coordinates;
  locationAccuracy?: number;
  locationLabel?: string;
  emergencyType?: SOSSituation;
  injured?: SOSResponse;
  medicalAssistanceRequired?: SOSResponse;
  helpTypes: SOSHelpType[];
  description: string;
  nearestService?: SOSNearestService;
  notificationStatus: SOSNotificationStatus;
  notificationProvider: 'demo' | 'backend';
  isDemo: boolean;
}

export type MapFilterType = 'ALL' | 'DISASTER' | 'WEATHER' | 'ROAD' | 'LOGISTICS' | 'COMMUNITY';

export type MapProviderStyle = 'standard' | 'dark' | 'satellite' | 'satellite-labels';

export type NavigationTab = 'dashboard' | 'map' | 'emergency' | 'report' | 'feed';

export interface LiveIntelligenceEvent {
  id: string;
  title: string;
  category: 'DISASTER' | 'WEATHER' | 'ROAD' | 'LOGISTICS' | 'NEWS';
  severity: 'low' | 'medium' | 'high' | 'critical';
  latitude: number;
  longitude: number;
  source: string;
  sourceUrl?: string;
  publishedTime: string;
  updatedTime: string;
  description: string;
  isOfficial: boolean;
  state: string;
  dataStatus: IntelligenceStatus;
}

export interface LiveDataServiceState {
  events: LiveIntelligenceEvent[];
  isLiveLoading: boolean;
  liveSourceStatus: {
    sachet: 'connected' | 'blocked' | 'fallback';
    imd: 'connected' | 'blocked' | 'fallback';
    gdelt: 'connected' | 'blocked' | 'fallback';
  };
  lastUpdated: string;
}
