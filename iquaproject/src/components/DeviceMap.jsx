import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const availableLocations = [
  { name: 'Ropar Head Works', coords: [30.9754, 76.5267] },
  { name: 'Rattanpur', coords: [30.9854, 76.5167] },
  { name: 'Beli Kalan', coords: [30.9954, 76.5067] },
  { name: 'Kamalpur', coords: [31.0054, 76.4967] },
  { name: 'Nanakpur Alias Sharfalbad', coords: [31.0154, 76.4867] },
  { name: 'Miani River front', coords: [31.0254, 76.4767] },
  { name: 'Asron', coords: [31.0354, 76.4667] },
  { name: 'Kiratpur Sahib', coords: [31.1822, 76.5636] },
  { name: 'Kheri Salabatpur', coords: [31.0454, 76.4567] },
  { name: 'Pailon', coords: [31.0554, 76.4467] },
  { name: 'Sutlej River bypass bridge (Ropar)', coords: [30.9664, 76.5331] },
  { name: 'Sutlej River bridge', coords: [30.9564, 76.5431] },
  { name: 'Balrampur bridge', coords: [30.9464, 76.5531] },
];

const DeviceMap = ({ devices }) => {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    let unassignedIndex = 0;
    const newMarkers = devices.map((device) => {
      if (device.location && device.location.length === 2) {
        return {
          id: device.id,
          name: device.name,
          coords: device.location,
          locationName: device.locationName || `[${device.location[0].toFixed(4)}, ${device.location[1].toFixed(4)}]`
        };
      } else {
        const assignedLoc = availableLocations[unassignedIndex % availableLocations.length];
        unassignedIndex++;
        return {
          id: device.id,
          name: device.name,
          coords: assignedLoc.coords,
          locationName: assignedLoc.name
        };
      }
    });
    setMarkers(newMarkers);
  }, [devices]);

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--panel-border)' }}>
      <MapContainer center={[30.9664, 76.5331]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.coords}>
            <Popup>
              <div style={{ color: '#000' }}>
                <strong>{marker.name}</strong><br/>
                Location: {marker.locationName}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DeviceMap;
