import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, Calendar } from 'lucide-react';
import axios from 'axios';

export default function MovementCard({ onClose, selectedDeviceId }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);

  const fetchDistanceData = async () => {
    if (!startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }

    if (!selectedDeviceId) {
      setError("Please select a device from the map");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFilteredData([]);

    const formatDateString = (dateInput) => {
      if (!dateInput) return '';
      if (typeof dateInput === 'string') {
        const parts = dateInput.split('-');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      return format(new Date(dateInput), 'dd-MM-yyyy');
    };

    const formattedStart = formatDateString(startDate);
    const formattedEnd = formatDateString(endDate);

    const cleanDeviceId = selectedDeviceId.replace("Device: ", "").trim();
    const url = `https://d20y38p47doyqp.cloudfront.net/GPS_API_Data_func?Device_id=${cleanDeviceId}&startdate=${formattedStart}&enddate=${formattedEnd}`;

    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        const data = response.data;
        const filtered = data.filter(item => {
          const dist = parseFloat(item.Distance_Meters || 0);
          return dist > 100;
        });
        setFilteredData(filtered);
      } else {
        setError(`Error: ${response.status}`);
      }
    } catch (e) {
      setError(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="movement-card-overlay glass-panel">
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="movement-card-header" style={{ margin: 0 }}>Check Movements</div>
          <button className="glass-button" style={{ padding: '6px', background: 'transparent', border: 'none' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {error && <div style={{ color: '#ef4444', marginTop: '10px', fontSize: '0.9rem' }}>{error}</div>}

        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="input-group">
            <Calendar size={18} className="input-icon" />
            <input 
              type="date" 
              className="glass-input" 
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start Date"
            />
          </div>

          <div className="input-group">
            <Calendar size={18} className="input-icon" />
            <input 
              type="date" 
              className="glass-input" 
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End Date"
            />
          </div>

          <button 
            className="glass-button" 
            onClick={fetchDistanceData} 
            disabled={isLoading}
            style={{ marginTop: '8px' }}
          >
            {isLoading ? <div className="loading-spinner" /> : 'Check Data'}
          </button>
        </div>

        <div className="movements-list">
          {filteredData.length === 0 && !isLoading && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', marginTop: '20px' }}>
              No movements &gt; 100m found
            </div>
          )}
          {filteredData.map((item, index) => {
            const distance = parseFloat(item.Distance_Meters || 0);
            return (
              <div key={index} className="movement-item">
                <div className="movement-item-title">Moved {distance.toFixed(2)}m</div>
                <div className="movement-item-subtitle">at {item.Timestamp}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
