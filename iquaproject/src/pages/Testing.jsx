import React, { useState, useEffect } from 'react';
import { fetchIquaData } from '../api';
import DeviceChart from '../components/DeviceChart';
import DataCards from '../components/DataCards';

const devices = [
  { id: 101, name: '101 - IIT Campus' },
  { id: 102, name: '102 - Satluj river' }
];

const Testing = () => {
  const [selectedDevice, setSelectedDevice] = useState(devices[0].id);
  const [startDate, setStartDate] = useState('2023-10-18');
  const [endDate, setEndDate] = useState('2024-04-17');
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDateForAPI = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const loadData = async () => {
    if (!startDate || !endDate) {
      setError('Please enter both Start Date and End Date to view data.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const result = await fetchIquaData(selectedDevice, formatDateForAPI(startDate), formatDateForAPI(endDate));
      setData(result);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Removed auto-fetch on mount so the dashboard waits for user input

  const chartData = data?.data || [];
  const latestDataPoint = chartData.length > 0 ? chartData[chartData.length - 1] : null;

  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <h1><span>Chloritron Smart and IQUA</span> Dashboard</h1>
        <p>Real-time water quality monitoring and analytics</p>
      </div>

      <div className="controls-panel">
        <select 
          className="control-input"
          value={selectedDevice} 
          onChange={(e) => setSelectedDevice(Number(e.target.value))}
        >
          {devices.map(device => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
        <input 
          type="date" 
          className="control-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input 
          type="date" 
          className="control-input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="btn" onClick={loadData}>
          Fetch Data
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <h2 style={{ color: 'var(--accent-blue)' }}>Loading Dashboard...</h2>
        </div>
      ) : error ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <div className="glass-panel" style={{ borderColor: 'var(--danger)' }}>
            <h2 style={{ color: 'var(--danger)' }}>Error</h2>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          <DataCards latestData={latestDataPoint} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <DeviceChart data={chartData} dataKey="Temperature" name="Temperature" color="#f97316" unit="°C" />
            <DeviceChart data={chartData} dataKey="Chlorine" name="Chlorine Level" color="#22c55e" unit="mg/L" />
            <DeviceChart data={chartData} dataKey="DO" name="Dissolved Oxygen (DO)" color="#3b82f6" unit="mg/L" />
            <DeviceChart data={chartData} dataKey="COD" name="Chemical Oxygen Demand (COD)" color="#8b5cf6" unit="mg/L" />
            <DeviceChart data={chartData} dataKey="BOD" name="Biochemical Oxygen Demand (BOD)" color="#ec4899" unit="mg/L" />
            <DeviceChart data={chartData} dataKey="TDS" name="Total Dissolved Solids (TDS)" color="#f59e0b" unit="ppm" />
            <DeviceChart data={chartData} dataKey="pH" name="pH Level" color="#10b981" unit="" />
            <DeviceChart data={chartData} dataKey="EC" name="Electrical Conductivity (EC)" color="#ef4444" unit="mS/cm" />
          </div>
        </>
      )}
    </div>
  );
};

export default Testing;
