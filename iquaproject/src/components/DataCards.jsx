import React from 'react';
import { 
  FaVial, 
  FaWind, 
  FaFlask, 
  FaSeedling, 
  FaWater, 
  FaThermometerHalf, 
  FaBolt,
  FaTemperatureHigh
} from 'react-icons/fa';

const DataCards = ({ latestData }) => {
  if (!latestData) return null;

  const parameters = [
    { key: 'Temperature', name: 'Temperature', value: latestData.Temperature, unit: '°C', icon: <FaTemperatureHigh />, color: '#f97316' },
    { key: 'Chlorine', name: 'Chlorine', value: latestData.Chlorine, unit: 'mg/L', icon: <FaVial />, color: 'var(--accent-teal)' },
    { key: 'DO', name: 'Dissolved Oxygen', value: latestData.DO, unit: 'mg/L', icon: <FaWind />, color: 'var(--accent-blue)' },
    { key: 'COD', name: 'COD', value: latestData.COD, unit: 'mg/L', icon: <FaFlask />, color: '#8b5cf6' },
    { key: 'BOD', name: 'BOD', value: latestData.BOD, unit: 'mg/L', icon: <FaSeedling />, color: '#ec4899' },
    { key: 'TDS', name: 'TDS', value: latestData.TDS, unit: 'ppm', icon: <FaWater />, color: '#f59e0b' },
    { key: 'pH', name: 'pH Level', value: latestData.pH, unit: '', icon: <FaThermometerHalf />, color: '#10b981' },
    { key: 'EC', name: 'Conductivity', value: latestData.EC, unit: 'mS/cm', icon: <FaBolt />, color: '#ef4444' }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '24px',
      marginBottom: '40px'
    }}>
      {parameters.map((param, index) => (
        <div 
          key={param.key} 
          className={`glass-panel animate-fade-in delay-${(index % 4) + 1}`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderTop: `3px solid ${param.color}`,
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>
              {param.name}
            </span>
            <div style={{ 
              color: param.color, 
              background: `${param.color}20`, 
              padding: '10px', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              {param.icon}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--text-primary)', fontWeight: '600' }}>
              {param.value !== undefined ? param.value : '--'}
            </h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              {param.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataCards;
