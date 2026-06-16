import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { distributionData } from '../mapData';
import L from 'leaflet';

// Fix leaflet default icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const kitColors = {
  'Grove Shield': '#EF4444', // Red
  'Robotic Kit': '#3B82F6', // Blue
  'BLE Development Kit': '#10B981', // Green
};

// Helper function to create a custom div icon showing colored dots for each kit
const createCustomIcon = (kits: { type: string }[]) => {
  const dots = kits.map(kit => {
    const color = kitColors[kit.type as keyof typeof kitColors] || '#FFFFFF';
    return `<div style="width: 12px; height: 12px; background-color: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); margin: 0 2px;"></div>`;
  }).join('');

  return L.divIcon({
    html: `<div style="display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.5); padding: 4px; border-radius: 12px; backdrop-filter: blur(4px);">${dots}</div>`,
    className: 'custom-kit-icon',
    iconSize: [kits.length * 16 + 8, 24],
    iconAnchor: [(kits.length * 16 + 8) / 2, 12],
    popupAnchor: [0, -12]
  });
};

const KitDistributionMap: React.FC = () => {
  // Center roughly over Northern India based on the data spread
  const center: [number, number] = [28.6139, 77.2090]; 

  return (
    <div className="w-full h-full relative z-10">
      <div className="absolute bottom-4 right-4 z-[1000] bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-lg">
        <h3 className="font-headline font-bold text-white mb-2 text-sm uppercase tracking-widest">Distribution Map</h3>
        <div className="flex flex-col gap-2">
          {Object.entries(kitColors).map(([kit, color]) => (
            <div key={kit} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
              <span className="text-xs font-body text-white/80">{kit}</span>
            </div>
          ))}
        </div>
      </div>

      <MapContainer 
        center={center} 
        zoom={5} 
        scrollWheelZoom={false} 
        className="w-full h-full z-0"
        attributionControl={false} // Removed attribution as requested
      >
        {/* Dark theme tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {distributionData.map((location) => (
          <Marker 
            key={location.id} 
            position={[location.lat, location.lng]}
            icon={createCustomIcon(location.kits)}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h4 className="font-headline font-bold text-gray-900 text-lg mb-2">{location.institution}</h4>
                <ul className="flex flex-col gap-1">
                  {location.kits.map((kit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: kitColors[kit.type as keyof typeof kitColors] || '#000' }}
                      ></div>
                      {kit.type}
                    </li>
                  ))}
                </ul>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default KitDistributionMap;
