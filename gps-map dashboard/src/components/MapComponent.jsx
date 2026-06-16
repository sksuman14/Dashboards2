import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { differenceInDays } from 'date-fns';

const NO_DATA_DAYS_THRESHOLD = 2;

// Custom hook to handle map center changes
function MapCenterController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

// Custom hook to handle map resize automatically
function MapResizeController() {
  const map = useMap();
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    
    const container = map.getContainer();
    if (container) {
      resizeObserver.observe(container);
    }
    
    return () => resizeObserver.disconnect();
  }, [map]);
  return null;
}

export default function MapComponent({ 
  centerCoordinates, 
  zoomLevel, 
  deviceLocations, 
  searchPin, 
  onDeviceClick 
}) {

  const getMarkerColor = (device) => {
    const hasMoved = device.has_moved === true;
    const lastActiveStr = device.last_active || '';

    if (!lastActiveStr) return '#ef4444'; // red (no data)

    try {
      const lastActiveUtc = new Date(lastActiveStr + (lastActiveStr.endsWith('Z') ? '' : 'Z'));
      const nowUtc = new Date();
      const daysSinceLast = differenceInDays(nowUtc, lastActiveUtc);

      if (daysSinceLast > NO_DATA_DAYS_THRESHOLD) {
        return '#ef4444'; // dark-red
      }
    } catch (e) {
      return '#ef4444'; 
    }

    return hasMoved ? '#3b82f6' : '#22c55e'; // blue for moved, green for stationary
  };

  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="40px" height="40px" stroke="white" stroke-width="1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  const searchIcon = L.divIcon({
    className: 'custom-marker',
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" width="40px" height="40px" stroke="white" stroke-width="1"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  return (
    <MapContainer 
      center={centerCoordinates} 
      zoom={zoomLevel} 
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <MapCenterController center={centerCoordinates} zoom={zoomLevel} />
      <MapResizeController />

      {searchPin && (
        <Marker position={[searchPin.lat, searchPin.lon]} icon={searchIcon} />
      )}

      {deviceLocations.map((device, idx) => (
        <Marker 
          key={idx} 
          position={[device.latitude, device.longitude]} 
          icon={createCustomIcon(getMarkerColor(device))}
          eventHandlers={{
            click: () => onDeviceClick(device),
          }}
        >
        </Marker>
      ))}
    </MapContainer>
  );
}
