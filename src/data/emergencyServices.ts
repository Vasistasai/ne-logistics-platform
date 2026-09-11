import type { EmergencyService, RegionalEmergency } from '../types';

export const COMMON_SERVICES: EmergencyService[] = [
  { name: 'National Emergency', number: '112', icon: 'phone', description: 'Pan-India single emergency helpline' },
  { name: 'Police Helpline', number: '100', icon: 'shield', description: 'State Police Emergency Response' },
  { name: 'Medical Ambulance', number: '108', icon: 'heart', description: 'Emergency Medical & Trauma Care' },
  { name: 'Fire & Rescue Service', number: '101', icon: 'flame', description: 'Fire Brigade & Rescue Operations' },
  { name: 'NDRF Disaster Helpline', number: '1078', icon: 'siren', description: 'National Disaster Response Force Control Room' }
];

export const EMERGENCY_SERVICES: Record<string, RegionalEmergency> = {
  'Arunachal Pradesh': {
    state: 'Arunachal Pradesh',
    services: [
      ...COMMON_SERVICES,
      { name: 'State Disaster Control Room', number: '0360-2292398', icon: 'siren', description: 'Arunachal Pradesh SDMA Emergency Control' }
    ]
  },
  'Assam': {
    state: 'Assam',
    services: [
      ...COMMON_SERVICES,
      { name: 'Assam SDMA Toll Free', number: '1070', icon: 'siren', description: 'State Disaster Management Authority' },
      { name: 'Brahmaputra River Police', number: '0361-2733052', icon: 'shield', description: 'River Inundation & Rescue Police' }
    ]
  },
  'Manipur': {
    state: 'Manipur',
    services: [
      ...COMMON_SERVICES,
      { name: 'Manipur Disaster Response', number: '0385-2443441', icon: 'siren', description: 'State Emergency Operation Centre' }
    ]
  },
  'Meghalaya': {
    state: 'Meghalaya',
    services: [
      ...COMMON_SERVICES,
      { name: 'Meghalaya SDMA Emergency', number: '1070', icon: 'siren', description: 'Disaster Management Helpline' }
    ]
  },
  'Mizoram': {
    state: 'Mizoram',
    services: [
      ...COMMON_SERVICES,
      { name: 'Mizoram SDMA Helpline', number: '0389-2342520', icon: 'siren', description: 'Disaster Control & Landslide Response' }
    ]
  },
  'Nagaland': {
    state: 'Nagaland',
    services: [
      ...COMMON_SERVICES,
      { name: 'Nagaland SDMA Control Room', number: '1070', icon: 'siren', description: 'State Disaster Emergency Line' }
    ]
  },
  'Sikkim': {
    state: 'Sikkim',
    services: [
      ...COMMON_SERVICES,
      { name: 'Sikkim SDMA Control Room', number: '03592-202461', icon: 'siren', description: 'Mountain & Highway Disaster Response' }
    ]
  },
  'Tripura': {
    state: 'Tripura',
    services: [
      ...COMMON_SERVICES,
      { name: 'Tripura SDMA Helpline', number: '1070', icon: 'siren', description: 'State Emergency Response Center' }
    ]
  }
};
