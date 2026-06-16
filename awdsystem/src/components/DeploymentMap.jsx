import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const devices = [
  // 5 Devices in Khizarpur
  { id: 'AWD-01', lat: 30.881, lng: 76.412, location: 'Khizarpur, Punjab', status: 'Active' },
  { id: 'AWD-02', lat: 30.883, lng: 76.415, location: 'Khizarpur, Punjab', status: 'Active' },
  { id: 'AWD-03', lat: 30.879, lng: 76.411, location: 'Khizarpur, Punjab', status: 'Active' },
  { id: 'AWD-04', lat: 30.884, lng: 76.418, location: 'Khizarpur, Punjab', status: 'Inactive' },
  { id: 'AWD-05', lat: 30.880, lng: 76.416, location: 'Khizarpur, Punjab', status: 'Active' },
  
  // 5 Devices in Ranga (Punjab 140111)
  { id: 'AWD-06', lat: 30.891, lng: 76.431, location: 'Ranga, Punjab 140111', status: 'Active' },
  { id: 'AWD-07', lat: 30.895, lng: 76.435, location: 'Ranga, Punjab 140111', status: 'Active' },
  { id: 'AWD-08', lat: 30.890, lng: 76.438, location: 'Ranga, Punjab 140111', status: 'Inactive' },
  { id: 'AWD-09', lat: 30.896, lng: 76.430, location: 'Ranga, Punjab 140111', status: 'Active' },
  { id: 'AWD-10', lat: 30.893, lng: 76.433, location: 'Ranga, Punjab 140111', status: 'Active' },
];

const DeploymentMap = () => {
  return (
    <section id="map" className="section" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="badge">Live Network</span>
          <h2>Deployment Map</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-muted)' }}>
            Geospatial visualization of AWD system nodes deployed across Khizarpur and Ranga (Punjab).
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
          <MapContainer center={[30.888, 76.425]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {devices.map(d => (
              <Marker key={d.id} position={[d.lat, d.lng]}>
                <Popup>
                  <div style={{ padding: '4px', fontFamily: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                      <MapPin size={16} color="var(--primary)" />
                      <strong style={{ fontSize: '14px', color: '#111827' }}>ID: {d.id}</strong>
                    </div>
                    <span style={{ color: '#4b5563', display: 'block', marginBottom: '4px' }}>{d.location}</span>
                    <span style={{ 
                      color: d.status === 'Active' ? '#10b981' : '#f43f5e', 
                      fontWeight: '600',
                      fontSize: '12px',
                      display: 'inline-block',
                      padding: '2px 8px',
                      backgroundColor: d.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                      borderRadius: '12px'
                    }}>
                      {d.status}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>
      </div>
    </section>
  );
};

export default DeploymentMap;
