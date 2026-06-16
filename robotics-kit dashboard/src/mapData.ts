export interface LocationData {
  id: string;
  institution: string;
  lat: number;
  lng: number;
  kits: { type: 'Grove Shield' | 'Robotic Kit' | 'BLE Development Kit'; quantity?: number }[];
}

export const distributionData: LocationData[] = [
  { id: '1', institution: 'ITI Ropar', lat: 30.9664, lng: 76.5331, kits: [{ type: 'Grove Shield' }] },
  { id: '2', institution: 'GPC, Kotkapura', lat: 30.5843, lng: 74.8239, kits: [{ type: 'Grove Shield' }] },
  { id: '3', institution: 'NIT SIKKIM', lat: 27.2965, lng: 88.3592, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '4', institution: 'GPC, Amritsar', lat: 31.6340, lng: 74.8723, kits: [{ type: 'Grove Shield' }] },
  { id: '5', institution: 'GPC, Batala', lat: 31.8186, lng: 75.2028, kits: [{ type: 'Grove Shield' }] },
  { id: '6', institution: 'MIT-WPU, Pune', lat: 18.5184, lng: 73.8156, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '7', institution: 'GPC, Badbar(Barnala)', lat: 30.3813, lng: 75.5487, kits: [{ type: 'Grove Shield' }] },
  { id: '8', institution: 'GPC, Bhikhiwind', lat: 31.3364, lng: 74.7077, kits: [{ type: 'Grove Shield' }] },
  { id: '9', institution: 'Chandigarh University', lat: 30.7686, lng: 76.5750, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '10', institution: 'EPIC, Ambala', lat: 30.3752, lng: 76.7821, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '11', institution: 'Shoolini', lat: 30.8645, lng: 77.1181, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '12', institution: 'MIET', lat: 32.7937, lng: 74.8158, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '13', institution: 'Hindustan', lat: 12.7993, lng: 80.2296, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '14', institution: 'Acropolis', lat: 22.8215, lng: 75.9433, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '15', institution: 'SVPUAT', lat: 29.0543, lng: 77.6836, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '16', institution: 'HRIT', lat: 28.7249, lng: 77.4682, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '17', institution: 'IILM, G. Noida', lat: 28.4609, lng: 77.4906, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '18', institution: 'CICU', lat: 30.9010, lng: 75.8573, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '19', institution: 'IIIT UNA', lat: 31.4813, lng: 76.1903, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '20', institution: 'Khalsa college', lat: 31.6349, lng: 74.8351, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '21', institution: 'CCCT_Sikkim', lat: 27.1724, lng: 88.4695, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '22', institution: 'University of Ladakh', lat: 34.1854, lng: 77.4112, kits: [{ type: 'Grove Shield' }, { type: 'BLE Development Kit' }] },
  { id: '23', institution: 'Baba Farid College', lat: 30.1345, lng: 74.8279, kits: [{ type: 'Grove Shield' }, { type: 'Robotic Kit' }, { type: 'BLE Development Kit' }] },
  { id: '24', institution: 'Chitkara University', lat: 30.5157, lng: 76.6592, kits: [{ type: 'Grove Shield' }, { type: 'BLE Development Kit' }] },
  { id: '25', institution: 'Thapar University', lat: 30.3545, lng: 76.3658, kits: [{ type: 'Grove Shield' }, { type: 'BLE Development Kit' }] },
  { id: '26', institution: "TULA's", lat: 30.3428, lng: 77.8880, kits: [{ type: 'Grove Shield' }, { type: 'BLE Development Kit' }] },
  { id: '27', institution: 'NIT Jalandhar', lat: 31.3956, lng: 75.5348, kits: [{ type: 'Grove Shield' }, { type: 'BLE Development Kit' }] },
  { id: '28', institution: 'NIT DELHI', lat: 28.8428, lng: 77.1042, kits: [{ type: 'Grove Shield' }, { type: 'BLE Development Kit' }] }
];
