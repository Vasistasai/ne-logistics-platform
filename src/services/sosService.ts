import type { EmergencyContact, SOSEvent, SOSNearestService } from '../types';

const CONTACT_STORAGE_KEY = 'ne-platform-emergency-contact';

export interface SOSAlertPayload {
  event: SOSEvent;
  emergencyContact?: EmergencyContact;
}

export interface SOSNotificationResult {
  status: SOSEvent['notificationStatus'];
  provider: SOSEvent['notificationProvider'];
  message: string;
}

export function createSOSEvent(): SOSEvent {
  return {
    id: `sos-${Date.now()}`,
    status: 'active',
    createdAt: new Date().toISOString(),
    helpTypes: [],
    description: '',
    notificationStatus: 'not-sent',
    notificationProvider: 'demo',
    isDemo: true
  };
}

export function getEmergencyContact(): EmergencyContact | undefined {
  const stored = localStorage.getItem(CONTACT_STORAGE_KEY);
  if (!stored) return undefined;
  try {
    const parsed = JSON.parse(stored) as EmergencyContact;
    return parsed.name && parsed.number ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export function saveEmergencyContact(contact: EmergencyContact): void {
  localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify(contact));
}

export function clearEmergencyContact(): void {
  localStorage.removeItem(CONTACT_STORAGE_KEY);
}

export function findNearestConfiguredService(helpTypes: SOSEvent['helpTypes'], state?: string): SOSNearestService | undefined {
  const wantsMedical = helpTypes.includes('Medical');
  const wantsPolice = helpTypes.includes('Police');
  const wantsFire = helpTypes.includes('Fire / Rescue');

  if (wantsMedical) return { name: 'National Emergency Response', number: '112', description: 'Pan-India emergency response', source: 'Configured emergency services' };
  if (wantsPolice) return { name: 'Police Helpline', number: '100', description: state ? `${state} police emergency response` : 'Police emergency response', source: 'Configured emergency services' };
  if (wantsFire) return { name: 'Fire & Rescue Service', number: '101', description: 'Fire brigade and rescue operations', source: 'Configured emergency services' };
  if (helpTypes.length > 0) return { name: 'National Emergency Response', number: '112', description: 'Pan-India emergency response', source: 'Configured emergency services' };
  return undefined;
}

export function prepareEmergencyMessage(event: SOSEvent): string {
  return [
    'EMERGENCY SOS',
    'A user has requested emergency assistance.',
    `Situation: ${event.emergencyType || 'Not specified'}`,
    `Injured: ${event.injured || 'Not specified'}`,
    `Medical assistance: ${event.medicalAssistanceRequired || 'Not specified'}`,
    `Help requested: ${event.helpTypes.join(', ') || 'Not specified'}`,
    `Location: ${event.locationLabel || 'Unavailable'}`,
    event.location ? `Coordinates: ${event.location.lat.toFixed(5)}, ${event.location.lng.toFixed(5)}` : 'Coordinates: Unavailable',
    `Additional information: ${event.description || 'None provided'}`,
    `Timestamp: ${new Date(event.createdAt).toISOString()}`
  ].join('\n');
}

export async function sendEmergencyAlert(payload: SOSAlertPayload): Promise<SOSNotificationResult> {
  void payload;
  return {
    status: 'prepared-demo',
    provider: 'demo',
    message: 'Live emergency messaging is not configured. The alert was prepared locally and was not sent.'
  };
}
