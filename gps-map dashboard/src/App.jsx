import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { format, differenceInMilliseconds } from 'date-fns';
import { Search, MapPin, Calendar, RefreshCw, Map, Menu, X } from 'lucide-react';
import MapComponent from './components/MapComponent';
import MovementCard from './components/MovementCard';
import { calculateDistance, reverseGeocode, geocode } from './utils/geoUtils';
import './index.css';
import './App.css';

import img1 from './assets/images/1.jpg';
import img2 from './assets/images/2.jpg';
import img3 from './assets/images/3.jpg';
import img4 from './assets/images/4.jpg';

const POSITIONS_KEY = 'device_previous_positions';
const DISPLACEMENT_THRESHOLD = 100.0;
const STATIONARY_TIME_THRESHOLD = 10 * 60 * 1000;

function App() {
  const [centerCoordinates, setCenterCoordinates] = useState([20.5937, 78.9629]);
  const [zoomLevel, setZoomLevel] = useState(5.0);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceLocations, setDeviceLocations] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [allDeviceIds, setAllDeviceIds] = useState(['None']);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchPin, setSearchPin] = useState(null);
  
  const [selectedDeviceId, setSelectedDeviceId] = useState('None');
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [showCard, setShowCard] = useState(false);
  const [selectedDeviceForCard, setSelectedDeviceForCard] = useState(null);
  
  const [showDeviceDialog, setShowDeviceDialog] = useState(false);
  const [deviceDialogInfo, setDeviceDialogInfo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const previousPositionsRef = useRef({});

  useEffect(() => {
    loadPreviousPositions();
  }, []);

  const loadPreviousPositions = () => {
    try {
      const storedData = localStorage.getItem(POSITIONS_KEY);
      if (storedData) {
        const decodedData = JSON.parse(storedData);
        previousPositionsRef.current = decodedData;
        
        let ids = Object.keys(decodedData).sort();
        if (!ids.includes('None')) {
          ids = ['None', ...ids];
        }
        setAllDeviceIds(ids);
      }
    } catch (e) {
      console.error('Error loading previous positions', e);
      previousPositionsRef.current = {};
      setAllDeviceIds(['None']);
    }
    fetchDeviceLocations();
  };

  const savePreviousPositions = () => {
    try {
      localStorage.setItem(POSITIONS_KEY, JSON.stringify(previousPositionsRef.current));
    } catch (e) {
      console.error('Error saving previous positions', e);
    }
  };

  const fetchDeviceLocations = async (deviceId = selectedDeviceId, date = selectedDate) => {
    setIsLoading(true);
    setSearchPin(null);

    try {
      let url = 'https://d20y38p47doyqp.cloudfront.net/GPS_API_Data_func';
      if (deviceId && deviceId !== 'None' && date) {
        let dateStr = '';
        if (typeof date === 'string') {
          const parts = date.split('-');
          if (parts.length === 3) {
            dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
        if (!dateStr) {
          dateStr = format(new Date(date), 'dd-MM-yyyy');
        }
        url += `?Device_id=${deviceId}&startdate=${dateStr}&enddate=${dateStr}`;
      }

      const response = await axios.get(url, { validateStatus: false });

      if (response.status === 200) {
        const data = response.data;
        const latestDevices = {};
        const fetchedDevices = [];
        let positionsUpdated = false;

        data.forEach(device => {
          const devId = device.Device_id.toString();
          if (deviceId && deviceId !== 'None' && devId !== deviceId) {
            return;
          }

          const timestamp = device.Timestamp.toString();
          const hasNote = device.Note && device.Note.trim() !== '';

          if (!latestDevices[devId]) {
            latestDevices[devId] = device;
          } else {
            const existingTime = new Date(latestDevices[devId].Timestamp);
            const currentTime = new Date(timestamp);
            const existingHasNote = latestDevices[devId].Note && latestDevices[devId].Note.trim() !== '';

            if (currentTime > existingTime) {
              latestDevices[devId] = device;
            } else if (currentTime.getTime() === existingTime.getTime()) {
              if (hasNote && !existingHasNote) {
                latestDevices[devId] = device;
              }
            }
          }
        });

        if (!deviceId || deviceId === 'None') {
          let ids = Object.keys(latestDevices).sort();
          if (!ids.includes('None')) ids = ['None', ...ids];
          setAllDeviceIds(ids);
        }

        const previousPositions = previousPositionsRef.current;
        const devicesToGeocode = [];

        for (const devId of Object.keys(latestDevices)) {
          const device = latestDevices[devId];
          const lat = parseFloat(device.Latitude);
          const lon = parseFloat(device.Longitude);
          const currentTimestamp = device.Timestamp.toString();
          let hasMoved = false;
          let initialMovedTimestamp = currentTimestamp;
          let place = 'Loading...';
          let state = 'Unknown';
          let country = 'Unknown';

          if (previousPositions[devId]) {
            const prevData = previousPositions[devId];
            const prevTimestamp = prevData.timestamp;
            initialMovedTimestamp = prevData.initial_moved_timestamp;

            if (currentTimestamp === prevTimestamp) {
              fetchedDevices.push({
                name: `Device: ${devId}`,
                latitude: lat,
                longitude: lon,
                place: prevData.place || 'Unknown',
                state: prevData.state || 'Unknown',
                country: prevData.country || 'Unknown',
                last_active: currentTimestamp,
                has_moved: prevData.has_moved || false,
                note: device.Note || '',
              });
              continue;
            }

            const dist = calculateDistance(prevData.latitude, prevData.longitude, lat, lon);
            if (dist >= DISPLACEMENT_THRESHOLD) {
              hasMoved = true;
              initialMovedTimestamp = currentTimestamp;
            } else {
              hasMoved = prevData.has_moved || false;
            }

            if (prevData.latitude === lat && prevData.longitude === lon && prevData.place) {
              place = prevData.place;
              state = prevData.state;
              country = prevData.country;
            } else {
              place = prevData.place ? `${prevData.place} (Updating...)` : 'Loading...';
              state = prevData.state || 'Unknown';
              country = prevData.country || 'Unknown';
              devicesToGeocode.push({ devId, lat, lon, currentTimestamp, initialMovedTimestamp, hasMoved });
            }
          } else {
            devicesToGeocode.push({ devId, lat, lon, currentTimestamp, initialMovedTimestamp, hasMoved });
          }

          fetchedDevices.push({
            name: `Device: ${devId}`,
            latitude: lat,
            longitude: lon,
            place: place,
            state: state,
            country: country,
            last_active: currentTimestamp,
            has_moved: hasMoved,
            note: device.Note || '',
          });
        }

        if (!deviceId || deviceId === 'None') {
          for (const devId of Object.keys(previousPositions)) {
            if (!latestDevices[devId]) {
              const prevData = previousPositions[devId];
              fetchedDevices.push({
                name: `Device: ${devId}`,
                latitude: prevData.latitude,
                longitude: prevData.longitude,
                place: prevData.place || 'Unknown',
                state: prevData.state || 'Unknown',
                country: prevData.country || 'Unknown',
                last_active: prevData.timestamp,
                has_moved: prevData.has_moved || false,
                note: '',
              });
            }
          }
        }

        updateDeviceStatusesForInactivity(fetchedDevices);

        if (devicesToGeocode.length > 0) {
          triggerBackgroundGeocoding(devicesToGeocode);
        }

      } else if (response.status === 404) {
        setDeviceLocations([]);
        setFilteredDevices([]);
        setCenterCoordinates([0, 0]);
        setZoomLevel(5.0);
        if (deviceId && deviceId !== 'None' && date) {
          alert('No data found for the selected device and date');
        }
      } else {
        handleFallback(deviceId);
      }
    } catch (e) {
      console.error('Error fetching devices', e);
      handleFallback(deviceId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFallback = (deviceId) => {
    const previousPositions = previousPositionsRef.current;
    const fetchedDevices = [];
    if (!deviceId || deviceId === 'None') {
      for (const devId of Object.keys(previousPositions)) {
        const prevData = previousPositions[devId];
        fetchedDevices.push({
          name: `Device: ${devId}`,
          latitude: prevData.latitude,
          longitude: prevData.longitude,
          place: prevData.place || 'Unknown',
          state: prevData.state || 'Unknown',
          country: prevData.country || 'Unknown',
          last_active: prevData.timestamp,
          has_moved: prevData.has_moved || false,
          note: '',
        });
      }
    } else if (previousPositions[deviceId]) {
      const prevData = previousPositions[deviceId];
      fetchedDevices.push({
        name: `Device: ${deviceId}`,
        latitude: prevData.latitude,
        longitude: prevData.longitude,
        place: prevData.place || 'Unknown',
        state: prevData.state || 'Unknown',
        country: prevData.country || 'Unknown',
        last_active: prevData.timestamp,
        has_moved: prevData.has_moved || false,
        note: '',
      });
    }

    updateDeviceStatusesForInactivity(fetchedDevices);
  };

  const updateDeviceStatusesForInactivity = (devices) => {
    const currentTimeUtc = new Date();
    const previousPositions = previousPositionsRef.current;

    devices.forEach(device => {
      const devId = device.name.replace('Device: ', '');
      if (!previousPositions[devId]) return;

      const prevData = previousPositions[devId];
      const initialMovedTimestamp = prevData.initial_moved_timestamp;

      if (!initialMovedTimestamp) {
        device.has_moved = false;
        prevData.has_moved = false;
        return;
      }

      try {
        const initialMovedTime = new Date(initialMovedTimestamp);
        const timeSince = differenceInMilliseconds(currentTimeUtc, initialMovedTime);

        if (timeSince >= STATIONARY_TIME_THRESHOLD && device.has_moved === true) {
          device.has_moved = false;
          prevData.has_moved = false;
          prevData.initial_moved_timestamp = currentTimeUtc.toISOString();
        }
      } catch (e) {
        console.error(e);
      }
    });

    setDeviceLocations(devices);
    setFilteredDevices(devices);
    
    if (devices.length > 0) {
      setCenterCoordinates([devices[0].latitude, devices[0].longitude]);
      setZoomLevel(12.0);
    } else {
      setCenterCoordinates([20.5937, 78.9629]);
      setZoomLevel(5.0);
    }

    savePreviousPositions();
  };

  const triggerBackgroundGeocoding = async (devices) => {
    const previousPositions = previousPositionsRef.current;
    for (const item of devices) {
      const { devId, lat, lon, currentTimestamp, initialMovedTimestamp, hasMoved } = item;
      try {
        const geoData = await reverseGeocode(lat, lon);
        
        previousPositions[devId] = {
          latitude: lat,
          longitude: lon,
          timestamp: currentTimestamp,
          initial_moved_timestamp: initialMovedTimestamp || currentTimestamp,
          has_moved: hasMoved,
          place: geoData.place,
          state: geoData.state,
          country: geoData.country,
        };

        setDeviceLocations(prev => prev.map(d => {
          if (d.name === `Device: ${devId}`) {
            return {
              ...d,
              place: geoData.place || 'Unknown',
              state: geoData.state || 'Unknown',
              country: geoData.country || 'Unknown'
            };
          }
          return d;
        }));

        setFilteredDevices(prev => prev.map(d => {
          if (d.name === `Device: ${devId}`) {
            return {
              ...d,
              place: geoData.place || 'Unknown',
              state: geoData.state || 'Unknown',
              country: geoData.country || 'Unknown'
            };
          }
          return d;
        }));

        savePreviousPositions();
      } catch (e) {
        console.error(`Background geocoding failed for device ${devId}:`, e);
      }
    }
  };

  const handleSearchUpdate = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setSuggestions([]);
      setSearchPin(null);
      setFilteredDevices(deviceLocations);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const sugs = deviceLocations.filter(d => 
      (d.name && d.name.toLowerCase().includes(lowerQuery)) ||
      (d.place && d.place.toLowerCase().includes(lowerQuery)) ||
      (d.state && d.state.toLowerCase().includes(lowerQuery)) ||
      (d.country && d.country.toLowerCase().includes(lowerQuery))
    );
    setSuggestions(sugs);
  };

  const handleSearchSubmit = async (e) => {
    if (e.key === 'Enter') {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = deviceLocations.filter(d => 
        (d.name && d.name.toLowerCase().includes(lowerQuery)) ||
        (d.place && d.place.toLowerCase().includes(lowerQuery)) ||
        (d.state && d.state.toLowerCase().includes(lowerQuery)) ||
        (d.country && d.country.toLowerCase().includes(lowerQuery))
      );
      setFilteredDevices(filtered);
      setSuggestions([]);

      if (filtered.length === 0 && searchQuery) {
        const result = await geocode(searchQuery);
        if (result) {
          setCenterCoordinates([result.lat, result.lon]);
          setZoomLevel(12.0);
          setSearchPin(result);
        } else {
          alert(`No results found for '${searchQuery}'`);
        }
      } else if (filtered.length > 0) {
        setCenterCoordinates([filtered[0].latitude, filtered[0].longitude]);
        setZoomLevel(12.0);
        setSearchPin(null);
      }
    }
  };

  const selectSuggestion = (sug) => {
    setSearchQuery(sug.place);
    setSuggestions([]);
    setCenterCoordinates([sug.latitude, sug.longitude]);
    setZoomLevel(12.0);
    setSearchPin(null);
  };

  const onDeviceSelect = (e) => {
    const val = e.target.value;
    setSelectedDeviceId(val);
    if (val && val !== 'None' && selectedDate) {
      fetchDeviceLocations(val, selectedDate);
    } else if (val === 'None') {
      fetchDeviceLocations('None', null);
    }
  };

  const onDateSelect = (e) => {
    const val = e.target.value;
    setSelectedDate(val);
    if (selectedDeviceId && selectedDeviceId !== 'None' && val) {
      fetchDeviceLocations(selectedDeviceId, val);
    }
  };

  const handleMarkerClick = (device) => {
    setSelectedDeviceForCard(device.name);
    setDeviceDialogInfo(device);
    setShowDeviceDialog(true);
  };

  return (
    <div className="app-container">
      <header className="dashboard-header">
        <div className="header-left">
          <button 
            className="menu-toggle-btn" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="dashboard-brand">
            <div className="brand-icon">
              <Map size={24} />
            </div>
            <h1 className="brand-title">Asset Tracking</h1>
          </div>
        </div>
        <nav className="header-nav">
          <ul className="nav-links">
            <li><a href="#datasheet">Datasheet</a></li>
            <li><a href="#deployment">Deployment</a></li>
          </ul>
        </nav>
      </header>

      <div className="dashboard-content">
        <aside className={`dashboard-sidebar ${!isSidebarOpen ? 'closed' : ''}`}>
          <div className="sidebar-controls">
          <div className="control-section">
            <span className="control-label">Search</span>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchSubmit({ key: 'Enter' });
              }}
              className="input-group"
            >
              <Search size={18} className="input-icon" />
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Search Location..." 
                value={searchQuery}
                onChange={handleSearchUpdate}
                onKeyDown={handleSearchSubmit}
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list glass-panel" style={{ padding: 0 }}>
                  {suggestions.map((s, i) => (
                    <li key={i} className="suggestion-item" onClick={() => selectSuggestion(s)}>
                      <div className="suggestion-title">{s.place}</div>
                      <div className="suggestion-subtitle">{s.state}, {s.country} - {s.name}</div>
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>

          <div className="control-section">
            <span className="control-label">Device Selection</span>
            <div className="input-group">
              <MapPin size={18} className="input-icon" />
              <select 
                className="glass-input" 
                value={selectedDeviceId || 'None'}
                onChange={onDeviceSelect}
              >
                {allDeviceIds.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="control-section">
            <span className="control-label">Filter by Date</span>
            <div className="input-group">
              <Calendar size={18} className="input-icon" />
              <input 
                type="date" 
                className="glass-input" 
                value={selectedDate || ''}
                onChange={onDateSelect}
                min="2020-01-01"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <button 
            className="glass-button" 
            style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}
            onClick={() => {
              setSelectedDeviceId('None');
              setSelectedDate('');
              fetchDeviceLocations('None', null);
            }}
            disabled={isLoading}
          >
            {isLoading ? <div className="loading-spinner" style={{width: 18, height: 18}} /> : <RefreshCw size={18} />}
            {isLoading ? 'Syncing...' : 'Refresh Data'}
          </button>
        </div>
      </aside>

      <div className="main-scroll-container">
        <div className="map-area">
          <MapComponent 
            centerCoordinates={centerCoordinates}
            zoomLevel={zoomLevel}
            deviceLocations={filteredDevices}
            searchPin={searchPin}
            onDeviceClick={handleMarkerClick}
          />
        </div>

        <section id="datasheet" className="specifications-section">
          <div className="section-header">
            <h2 className="section-title">Specifications Explorer</h2>
            <p className="section-subtitle">Technical details, compliance, and device capabilities.</p>
          </div>
          <div className="specs-grid">
            <div className="spec-card glass-panel">
              <div className="spec-icon-wrapper">🔋</div>
              <h3>Battery & Power</h3>
              <ul>
                <li>5000mAh Li-Polymer</li>
                <li>Up to 6 months standby</li>
                <li>Solar charging support</li>
              </ul>
            </div>
            <div className="spec-card glass-panel">
              <div className="spec-icon-wrapper">📡</div>
              <h3>Connectivity</h3>
              <ul>
                <li>4G LTE-M / NB-IoT</li>
                <li>LoRaWAN & BLE 5.2</li>
                <li>Fallback to 2G Network</li>
              </ul>
            </div>
            <div className="spec-card glass-panel">
              <div className="spec-icon-wrapper">🛡️</div>
              <h3>Enclosure & Safety</h3>
              <ul>
                <li>IP67 Waterproof</li>
                <li>IK08 Impact Rated</li>
                <li>Tamper detection sensor</li>
              </ul>
            </div>
            <div className="spec-card glass-panel">
              <div className="spec-icon-wrapper">📍</div>
              <h3>Positioning</h3>
              <ul>
                <li>Multi-GNSS (GPS, GLONASS)</li>
                <li>Wi-Fi Positioning fallback</li>
                <li>Cell ID localization</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="deployment" className="deployment-section">
          <div className="section-header">
            <h2 className="section-title">Deployment Scenarios</h2>
            <p className="section-subtitle">Visualizing real-world applications and installations.</p>
          </div>
          <div className="deployment-grid">
            <div className="deployment-card glass-panel">
              <div className="deployment-img-wrapper">
                <img src={img1} alt="Deployment Image 1" className="deployment-img" />
              </div>
              <div className="deployment-info">
                <h3>Deployment 1</h3>
              </div>

            </div>
            <div className="deployment-card glass-panel">
              <div className="deployment-img-wrapper">
                <img src={img2} alt="Deployment Image 2" className="deployment-img" />
              </div>
              <div className="deployment-info">
                <h3>Deployment 2</h3>
              </div>

            </div>
            <div className="deployment-card glass-panel">
              <div className="deployment-img-wrapper">
                <img src={img3} alt="Deployment Image 3" className="deployment-img" />
              </div>
              <div className="deployment-info">
                <h3>Deployment 3</h3>
              </div>

            </div>
            <div className="deployment-card glass-panel">
              <div className="deployment-img-wrapper">
                <img src={img4} alt="Deployment Image 4" className="deployment-img" />
              </div>
              <div className="deployment-info">
                <h3>Deployment 4</h3>
              </div>

            </div>
          </div>
        </section>
      </div>
    </div>

      {showDeviceDialog && deviceDialogInfo && (
        <div className="movement-card-overlay glass-panel device-dialog" style={{ padding: '20px', width: 'auto', maxHeight: 'auto' }}>
          <h3>{deviceDialogInfo.name}</h3>
          <p>Latitude: {deviceDialogInfo.latitude.toFixed(3)}</p>
          <p>Longitude: {deviceDialogInfo.longitude.toFixed(3)}</p>
          <p>Place: {deviceDialogInfo.place}</p>
          <p>State: {deviceDialogInfo.state}</p>
          <p>Country: {deviceDialogInfo.country}</p>
          <p>Last Active: {deviceDialogInfo.last_active}</p>
          <p style={{ 
            color: deviceDialogInfo.has_moved ? '#ef4444' : '#22c55e', 
            fontWeight: 'bold',
            marginTop: '8px'
          }}>
            Status: {deviceDialogInfo.has_moved ? "Moved (>100m)" : "Stationary (<100m or >10 min)"}
          </p>
          {deviceDialogInfo.note && (
            <p style={{ color: '#f59e0b', fontStyle: 'italic', marginTop: '8px' }}>
              Note: {deviceDialogInfo.note}
            </p>
          )}

          <div className="device-dialog-actions">
            <button className="glass-button" onClick={() => setShowDeviceDialog(false)} style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
              Close
            </button>
            <button className="glass-button" onClick={() => {
              setShowDeviceDialog(false);
              setShowCard(true);
            }}>
              Check Movements
            </button>
          </div>
        </div>
      )}

      {showCard && (
        <MovementCard 
          selectedDeviceId={selectedDeviceForCard} 
          onClose={() => setShowCard(false)} 
        />
      )}
    </div>
  );
}

export default App;
