import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Activity, Clock, Search, AlertCircle, RefreshCw, MapPin, Maximize, Minimize, Crosshair, Plus, Minus, ArrowLeft } from 'lucide-react';
import { format, parse } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const mapLocations = [
  { id: 1, name: 'Gopal Gaushala, Ropar', position: [30.9664, 76.5331], deviceCount: 15, baseId: 1000 },
  { id: 2, name: 'Mand, Chahal', position: [31.0715, 76.0127], deviceCount: 14, baseId: 2000 },
  { id: 3, name: 'GADVASU, Ludhiana', position: [30.9010, 75.8072], deviceCount: 12, baseId: 3000 },
  { id: 4, name: 'Daljit Sandhu Farm, Rupnagar, Punjab', position: [30.9800, 76.5300], deviceCount: 10, baseId: 4000 },
  { id: 5, name: 'Tarn Taran', position: [31.4522, 74.9250], deviceCount: 11, baseId: 5000 },
  { id: 6, name: 'NABARD, Chandigarh', position: [30.7220, 76.7680], deviceCount: 10, baseId: 6000 }
];

const createDeviceIcon = () => {
  return L.divIcon({
    html: `<div style="background-color: #3b82f6; border-radius: 50%; width: 28px; height: 28px; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.5);"></div>`,
    className: 'custom-device-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const FIXED_COLORS = [
  '#ef4444', // Red
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#cbeb1b', // Yellow-green
  '#ae184a', // Magenta-ish
];

const Toast = ({ message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;
  return (
    <div className="toast-container">
      <div className="toast">{message}</div>
    </div>
  );
};

const MapController = ({ isFullScreen, toggleFullScreen }) => {
  const map = useMap();
  
  useEffect(() => {
    if (isFullScreen) {
      map.scrollWheelZoom.enable();
      map.dragging.enable();
    } else {
      map.scrollWheelZoom.disable();
    }
    
    // Invalidate size after transition to fix tile loading
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timer);
  }, [isFullScreen, map]);

  const handleRecenter = () => {
    map.setView([30.8500, 75.8500], 8);
  };

  return (
    <>
      {isFullScreen && (
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
          <button 
            className="map-btn" 
            style={{ width: 'auto', padding: '0 1rem', gap: '8px', background: 'rgba(15, 23, 42, 0.9)' }}
            onClick={(e) => { e.preventDefault(); toggleFullScreen(); }} 
            title="Back to Dashboard"
          >
            <ArrowLeft /> <span style={{ fontWeight: 500 }}>Back to Dashboard</span>
          </button>
        </div>
      )}
      <div className="custom-map-controls">
        {isFullScreen && (
          <>
            <button className="map-btn" onClick={(e) => { e.preventDefault(); map.zoomIn(); }} title="Zoom In">
              <Plus />
            </button>
            <button className="map-btn" onClick={(e) => { e.preventDefault(); map.zoomOut(); }} title="Zoom Out">
              <Minus />
            </button>
          </>
        )}
        <button className="map-btn" onClick={(e) => { e.preventDefault(); handleRecenter(); }} title="Recenter Map">
          <Crosshair />
        </button>
        {!isFullScreen && (
          <button className="map-btn" onClick={(e) => { e.preventDefault(); toggleFullScreen(); }} title="Toggle Fullscreen">
            <Maximize />
          </button>
        )}
      </div>
    </>
  );
};

const ZoomTracker = ({ onZoomChange, onCenterChange }) => {
  useMapEvents({
    zoomend: (e) => {
      onZoomChange(e.target.getZoom());
    },
    moveend: (e) => {
      onCenterChange([e.target.getCenter().lat, e.target.getCenter().lng]);
    }
  });
  return null;
};

function App() {
  const [nodeId, setNodeId] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    if (d.getFullYear() > 2025) d.setFullYear(2025);
    d.setHours(d.getHours() - 24);
    return format(d, "yyyy-MM-dd'T'HH:mm");
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    if (d.getFullYear() > 2025) d.setFullYear(2025);
    return format(d, "yyyy-MM-dd'T'HH:mm");
  });
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);
  const [mapZoom, setMapZoom] = useState(8);
  const [mapCenter, setMapCenter] = useState([30.8500, 75.8500]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Calculate individual devices
  const allDevices = useMemo(() => {
    const devices = [];
    mapLocations.forEach(loc => {
      // Radius of ~250 meters for spreading devices randomly
      const radius = 0.0025; 
      for (let i = 0; i < loc.deviceCount; i++) {
        // Random placement within the radius
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        const lat = loc.position[0] + r * Math.cos(angle);
        const lng = loc.position[1] + r * Math.sin(angle);
        
        // Professional Device ID formatting
        const deviceId = `CS-${loc.baseId + i + 1}`;
        
        // Mock data for individual sensor details
        const battery = Math.floor(Math.random() * 40) + 60; // 60-100%
        const signal = Math.floor(Math.random() * 30) + 70; // 70-100%
        
        devices.push({
          id: deviceId,
          siteName: loc.name,
          position: [lat, lng],
          battery,
          signal,
          lastSeen: 'Just now'
        });
      }
    });
    return devices;
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (!nodeId || nodeId.length < 1) return [];
    return allDevices.filter(dev => dev.id.toLowerCase().includes(nodeId.toLowerCase())).slice(0, 8);
  }, [nodeId, allDevices]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  const handleShowData = (deviceId) => {
    setNodeId(deviceId);
    setActiveTab('analytics');
    
    let forcedStart = null;
    let forcedEnd = null;
    if (deviceId.startsWith('CS-')) {
      forcedStart = '2023-11-25T00:00';
      forcedEnd = '2023-11-26T23:59';
      setStartDate(forcedStart);
      setEndDate(forcedEnd);
    }

    setTimeout(() => {
      fetchData(deviceId, forcedStart, forcedEnd);
    }, 50);
  };

  const fetchData = async (overrideNodeId = null, overrideStart = null, overrideEnd = null) => {
    setIsLoading(true);

    const currentId = typeof overrideNodeId === 'string' ? overrideNodeId : nodeId;
    const nodeIdToUse = currentId.replace('BF', '').trim();
    
    const startToUse = typeof overrideStart === 'string' ? overrideStart : startDate;
    const endToUse = typeof overrideEnd === 'string' ? overrideEnd : endDate;
    
    const startMs = new Date(startToUse).getTime();
    const endMs = new Date(endToUse).getTime();

    if (startMs > endMs) {
      showToast("Start time cannot be after end time!");
      setIsLoading(false);
      return;
    }

    if (!nodeIdToUse) {
      showToast("Node ID is empty or invalid.");
      setIsLoading(false);
      return;
    }

    const startTimeStamp = Math.floor(startMs / 1000);
    const endTimeStamp = Math.floor(endMs / 1000);

    let apiNodeId = nodeIdToUse;
    let isMockDevice = false;
    let mockSeed = 0;
    
    if (apiNodeId.startsWith('CS-')) {
      isMockDevice = true;
      mockSeed = parseInt(apiNodeId.split('-')[1]) || 0;
      apiNodeId = '120'; // Always use device 120 as requested
    }

    const url = `https://h6q2v0jvn0.execute-api.us-east-1.amazonaws.com/default/Gateway_Predicition_API_Function?nodeId=${encodeURIComponent(apiNodeId)}&startTime=${startTimeStamp}&endTime=${endTimeStamp}`;

    let retries = 1; // 1 retry = 2 total attempts

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const responseData = await response.json();
          
          if (responseData.length === 0) {
            showToast("No activities found in selected range.");
            setData([]);
          } else {
            // Filter out invalid timestamps
            let validData = responseData.filter(activity => {
              const timestampStr = String(activity.TimeStamp);
              const parsed = parse(timestampStr, 'yyyy-MM-dd HH:mm:ss', new Date());
              return !isNaN(parsed.getTime());
            });
            
            if (validData.length > 0) {
              // Sort validData chronologically
              validData.sort((a, b) => {
                return parse(String(a.TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date()).getTime() - 
                       parse(String(b.TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date()).getTime();
              });
              
              // Stretch timestamps proportionally to perfectly fit between selected Start and End Date
              const firstDataTime = parse(String(validData[0].TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date()).getTime();
              const lastDataTime = parse(String(validData[validData.length - 1].TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date()).getTime();
              const dataDuration = lastDataTime - firstDataTime;
              
              const targetStartTime = startMs;
              const targetEndTime = endMs;
              const targetDuration = targetEndTime - targetStartTime;
              
              validData = validData.map(item => {
                const originalTime = parse(String(item.TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date()).getTime();
                
                let newTime;
                if (dataDuration === 0) {
                   newTime = targetEndTime;
                } else {
                   const progress = (originalTime - firstDataTime) / dataDuration;
                   newTime = targetStartTime + (progress * targetDuration);
                }
                
                return {
                  ...item,
                  TimeStamp: format(new Date(newTime), 'yyyy-MM-dd HH:mm:ss')
                };
              });
            }
            
            // Mutate data for map devices to make them look different
            if (isMockDevice) {
              // Generate unique proportion thresholds for this specific device
              let s = mockSeed;
              const nextRand = () => {
                s = (s * 9301 + 49297) % 233280;
                return s / 233280;
              };
              
              // Randomly generate weights for the 4 activities
              const w1 = nextRand() + 0.1; // STN
              const w2 = nextRand() + 0.5; // REL (cows rest a lot)
              const w3 = nextRand() + 0.4; // RUS (cows ruminate a lot)
              const w4 = nextRand() + 0.05; // ETC
              
              const totalW = w1 + w2 + w3 + w4;
              const t1 = w1 / totalW;
              const t2 = t1 + (w2 / totalW);
              const t3 = t2 + (w3 / totalW);
  
              validData = validData.map((item, index) => {
                 // Group data into contiguous time blocks (e.g., 12 records per block)
                 // This prevents the activity log from fragmenting into 1-minute intervals
                 const blockId = Math.floor(index / 12); 
                 
                 let blockSeed = mockSeed + blockId * 37;
                 blockSeed = (blockSeed * 9301 + 49297) % 233280;
                 const rand = blockSeed / 233280;
                 
                 let newLabel;
                 if (rand < t1) newLabel = 'STN';
                 else if (rand < t2) newLabel = 'REL';
                 else if (rand < t3) newLabel = 'RUS';
                 else newLabel = 'ETC';
  
                 return { ...item, ActivityLabel: newLabel };
              });
            }
            
            setData(validData);
            showToast(`Fetched ${validData.length} records successfully.`);
          }
          break; // Success, exit loop
        } else {
          if (response.status >= 500 && attempt < retries) {
            console.log(`API returned ${response.status}, retrying...`);
            await new Promise(r => setTimeout(r, 1500));
            continue;
          }
          throw new Error(`API Error: ${response.status}`);
        }
      } catch (error) {
        if (attempt < retries) {
          console.log("Fetch error, retrying...", error);
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
        console.error(error);
        showToast(`Failed to fetch: ${error.message}`);
        break;
      }
    }
    
    setIsLoading(false);
  };

  // Group Activities
  const groupedActivities = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    let groups = [];
    let currentGroup = [];

    for (let i = 0; i < data.length; i++) {
      const activity = data[i];
      const activityLabel = activity.ActivityLabel;
      const timestampStr = String(activity.TimeStamp);
      const parsed = parse(timestampStr, 'yyyy-MM-dd HH:mm:ss', new Date());
      const timestamp = Math.floor(parsed.getTime() / 1000);

      if (currentGroup.length === 0) {
        currentGroup.push(activity);
      } else {
        const lastActivity = currentGroup[currentGroup.length - 1];
        const lastParsed = parse(String(lastActivity.TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date());
        const lastTimestamp = Math.floor(lastParsed.getTime() / 1000);
        
        const timeDiff = timestamp - lastTimestamp;

        if (activityLabel === lastActivity.ActivityLabel && timeDiff <= 10800) {
          currentGroup.push(activity);
        } else {
          groups.push(currentGroup);
          currentGroup = [activity];
        }
      }
    }
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    return groups;
  }, [data]);

  // Calculate Total Times
  const totalActivityTimes = useMemo(() => {
    if (!data || data.length === 0) return {};
    
    let totals = {};
    
    // Sort data by timestamp chronologically
    const sortedData = [...data].sort((a, b) => {
      const timeA = parse(String(a.TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date()).getTime();
      const timeB = parse(String(b.TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date()).getTime();
      return timeA - timeB;
    });

    for (let i = 0; i < sortedData.length - 1; i++) {
      const current = sortedData[i];
      const next = sortedData[i + 1];
      const activityLabel = current.ActivityLabel;
      
      const currentParsed = parse(String(current.TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date());
      const nextParsed = parse(String(next.TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date());
      
      const currentTimestamp = Math.floor(currentParsed.getTime() / 1000);
      const nextTimestamp = Math.floor(nextParsed.getTime() / 1000);
      
      let duration = nextTimestamp - currentTimestamp;
      
      // Cap gap at 3 hours to prevent massive duration spikes if data is missing
      if (duration > 10800) {
        duration = 3600; 
      }
      
      totals[activityLabel] = (totals[activityLabel] || 0) + duration;
    }

    // Add a nominal 5-minute duration for the very last item recorded
    if (sortedData.length > 0) {
      const lastItem = sortedData[sortedData.length - 1];
      totals[lastItem.ActivityLabel] = (totals[lastItem.ActivityLabel] || 0) + 300;
    }

    return totals;
  }, [data]);

  // Chart Data Preparation
  const chartData = useMemo(() => {
    const total = Object.values(totalActivityTimes).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    let sections = [];
    let index = 0;
    let accumulatedPercent = 0;

    const entries = Object.entries(totalActivityTimes);
    
    entries.forEach(([label, totalTime], i) => {
      let percentage = (totalTime / total) * 100;
      percentage = parseFloat(percentage.toFixed(2));
      
      // Adjust last item to ensure total is exactly 100
      if (i === entries.length - 1) {
        percentage = parseFloat((100 - accumulatedPercent).toFixed(2));
      } else {
        accumulatedPercent += percentage;
      }

      sections.push({
        name: label,
        value: percentage,
        totalTime,
        color: FIXED_COLORS[index % FIXED_COLORS.length]
      });
      index++;
    });

    return sections;
  }, [totalActivityTimes]);

  const downloadCSV = () => {
    if (groupedActivities.length === 0) {
      showToast("No data available to download.");
      return;
    }

    const rows = [
      ['TimeStamp Range', 'Activity Label']
    ];

    groupedActivities.forEach((group, idx) => {
      if (group.length > 0) {
        const firstTime = group[0].TimeStamp;
        let lastTime;
        if (idx < groupedActivities.length - 1) {
          lastTime = groupedActivities[idx + 1][0].TimeStamp;
        } else {
          lastTime = format(new Date(endDate), 'yyyy-MM-dd HH:mm:ss');
        }
        const label = group[0].ActivityLabel;
        rows.push([`${firstTime} - ${lastTime}`, label]);
      }
    });

    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const fileName = `GroupedActivities_${timestamp}.csv`;

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloading ${fileName}`);
  };

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h} hr ${m} min ${s} sec`;
  };

  return (
    <>
      <div className="interactive-bg"></div>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      
      <div className="dashboard-container main-wrapper">
        {/* Premium Top Header / Logo Section */}
        <header className="main-header">
          <div className="premium-header brand-section">
             <Activity className="logo-icon brand-icon" />
             <h1 className="gradient-text brand-title">
               MOOSense
             </h1>
             <div className="brand-divider"></div>
             <span className="brand-subtitle">
               Livestock Health Monitoring
             </span>
          </div>
          
          {/* Navigation Tabs */}
          <div className="premium-header nav-tabs-container">
            <button 
              onClick={() => {
                setActiveTab('overview');
                setMapZoom(8);
                setIsMapFullScreen(false);
              }}
              className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            >
              Project Overview
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
            >
              Node Analytics
            </button>
          </div>
        </header>

        <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {activeTab === 'overview' && (
        <div className="overview-container">
          {/* Main Hero Section */}
          <div className="glass-panel hero-panel">
            <div className="hero-content">
              <h2 className="section-title">
                <AlertCircle size={28} color="#3b82f6" />
                Project Overview
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <p className="hero-description" style={{ marginBottom: 0 }}>
                  MOOSense is an AI-powered livestock management Cyber-Physical System (CPS) designed to monitor and analyze the behavior of cattle in real-time. It tracks key activity metrics such as standing/lying duration, feed intake, and rumination duration, enabling data-driven decisions for herd health, productivity, and welfare.
                </p>
                <p className="hero-description" style={{ marginBottom: 0 }}>
                  Developed collaboratively by IIT Ropar (AWaDH), GADVASU, and NABARD, it addresses the critical need for affordable monitoring in the Indian dairy sector. By replacing expensive traditional systems, it makes proactive AI-driven livestock care accessible to small and medium-scale farmers.
                </p>
              </div>
              <div className="badge-group">
                 <div className="badge badge-green">Real-time Monitoring</div>
                 <div className="badge badge-red">AI-Powered Insights</div>
                 <div className="badge badge-purple">Scalable & Cost-Effective</div>
              </div>
            </div>
            <div className="hero-image-wrapper">
              <img src="/cow_collar.png" alt="Cow wearing MOOSense collar" />
            </div>
          </div>

          {/* Details Section Grid */}
          <div className="details-grid">
            {/* Device Section */}
            <div className="glass-panel details-panel">
              <h3 className="section-subtitle">
                <Activity size={24} color="#3b82f6" /> Hardware Components
              </h3>
              <p className="details-text">
                The MOOSense system consists of a low-cost sensor collar (₹3,000 per unit) worn by livestock and a BLE Gateway (₹50,000) capable of handling up to 300 collars simultaneously. The hardware is durable for field conditions and optimized for low power consumption.
              </p>
              <div className="image-grid">
                <div className="image-card">
                  <img src="/smart_collar_strap.png" alt="Smart Collar Strap" />
                </div>
                <div className="image-card">
                  <img src="/gateway_circuit.png" alt="Gateway Circuit" />
                </div>
              </div>
            </div>
            
            {/* Specs / Value Section */}
            <div className="glass-panel details-panel">
               <h3 className="section-subtitle">
                <AlertCircle size={24} color="#22c55e" /> Technology Status & Value
              </h3>
              <ul className="specs-list">
                <li><strong className="text-highlight">TRL Level:</strong> &gt;9 (Commercialized and in large-scale use)</li>
                <li><strong className="text-highlight">Testing:</strong> Field-validated in collaboration with GADVASU and NABARD</li>
                <li><strong className="text-highlight">Adoption:</strong> Commercially deployed, benefiting &gt;150,000 farmers across India</li>
                <li><strong className="text-highlight">Cost-Effective:</strong> Collar at ₹3,000, Gateway at ₹50,000</li>
                <li><strong className="text-highlight">Scalability:</strong> One gateway supports large herds, reducing infrastructure cost.</li>
              </ul>
            </div>
            
            {/* Applications Section */}
            <div className="glass-panel details-panel">
               <h3 className="section-subtitle">
                <Activity size={24} color="#a855f7" /> Key Applications
              </h3>
              <ul className="specs-list">
                <li><strong className="text-highlight">Dairy Farms:</strong> Improve milk yield and reproductive health through behavior-based monitoring.</li>
                <li><strong className="text-highlight">Veterinary Use:</strong> Support early diagnosis of metabolic and digestive disorders.</li>
                <li><strong className="text-highlight">Livestock Research:</strong> Enable data collection for academic and commercial studies.</li>
                <li><strong className="text-highlight">Herd Management:</strong> Monitor hundreds of animals simultaneously with a single BLE Gateway.</li>
              </ul>
            </div>
          </div>

          {/* Map Section */}
          <div className={`glass-panel map-panel ${isMapFullScreen ? 'fullscreen' : ''}`} style={!isMapFullScreen ? { marginTop: '0', padding: '2rem' } : {}}>
            <h3 className="section-subtitle">
              <MapPin size={24} color="#ef4444" /> Deployment Locations
            </h3>
            <p className="details-text">
              Real-time visualization of MOOSense gateways and monitoring nodes deployed across various institutions and commercial dairy farms.
            </p>
            <div className="map-wrapper" style={{ height: '400px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)', zIndex: 1, position: 'relative' }}>
              <MapContainer 
                center={mapCenter} 
                zoom={mapZoom} 
                minZoom={3}
                maxBounds={[[-90, -18000], [90, 18000]]}
                maxBoundsViscosity={1.0}
                scrollWheelZoom={false} 
                zoomControl={false} 
                style={{ height: '100%', width: '100%', zIndex: 1, backgroundColor: '#0f172a' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
                />
                
                <ZoomTracker onZoomChange={setMapZoom} onCenterChange={setMapCenter} />
                
                {mapZoom < 13 ? (
                  mapLocations.map((loc) => (
                    <Marker key={loc.id} position={loc.position}>
                      <Popup>
                        <div style={{ color: '#0f172a', fontWeight: '500' }}>
                          <strong style={{ color: '#3b82f6', fontSize: '1.1rem' }}>{loc.name}</strong><br />
                          <div style={{ marginTop: '8px', padding: '8px', backgroundColor: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', flexShrink: 0 }}>
                              {loc.deviceCount}
                            </div>
                            <div>
                              <strong>Deployed Devices:</strong><br/>
                              <span style={{ fontSize: '0.85rem' }}>
                                CS-{loc.baseId + 1} to CS-{loc.baseId + loc.deviceCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))
                ) : (
                  allDevices.map((dev) => (
                    <Marker key={dev.id} position={dev.position} icon={createDeviceIcon()}>
                      <Popup>
                        <div style={{ color: '#0f172a', fontWeight: '500', minWidth: '160px' }}>
                          <strong style={{ color: '#22c55e', fontSize: '1.1rem', display: 'block', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '8px' }}>
                            {dev.id}
                          </strong>
                          <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <span><strong>Location:</strong> {dev.siteName}</span>
                            <span><strong>Status:</strong> <span style={{color: '#22c55e'}}>Online</span></span>
                            <span><strong>Battery:</strong> {dev.battery}%</span>
                            <span><strong>Signal Strength:</strong> {dev.signal}%</span>
                            <span><strong>Last Sync:</strong> {dev.lastSeen}</span>
                          </div>
                          <button 
                            className="btn-primary" 
                            style={{ marginTop: '12px', width: '100%', padding: '6px 12px', fontSize: '0.85rem', height: 'auto', gap: '6px', justifyContent: 'center' }}
                            onClick={() => handleShowData(dev.id)}
                          >
                            <Activity size={14} /> Show Data
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))
                )}
                <MapController isFullScreen={isMapFullScreen} toggleFullScreen={() => setIsMapFullScreen(!isMapFullScreen)} />
              </MapContainer>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'analytics' && (
        <>
      {/* Top Bar / Controls */}
      <div className="glass-panel top-bar">
        <div className="control-group" style={{ position: 'relative' }}>
          <label>Node ID (Cow ID)</label>
          <input 
            type="text" 
            className="control-input"
            placeholder="e.g. 120 / CS-1004"
            value={nodeId}
            onChange={(e) => {
              setNodeId(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {filteredSuggestions.map(dev => (
                <li 
                  key={dev.id} 
                  className="suggestion-item"
                  onClick={() => {
                    setShowSuggestions(false);
                    handleShowData(dev.id);
                  }}
                >
                  <span className="suggestion-item-id">{dev.id}</span>
                  <span className="suggestion-item-loc">{dev.siteName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="control-group">
          <label>Start Date & Time</label>
          <input 
            type="datetime-local" 
            className="control-input"
            value={startDate}
            max="2025-12-31T23:59"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>End Date & Time</label>
          <input 
            type="datetime-local" 
            className="control-input"
            value={endDate}
            max="2025-12-31T23:59"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={() => fetchData()} disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : <Search size={20} />}
            {isLoading ? 'Fetching...' : 'Fetch Data'}
          </button>
          
          <button 
            className="btn-primary" 
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }}
            onClick={() => {
              setData([]);
              setNodeId('');
            }}
            title="Reset Dashboard"
          >
            <RefreshCw size={20} />
            Reset
          </button>
          
          <button 
            className="btn-primary" 
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)', border: '1px solid var(--primary)' }}
            onClick={() => {
              setActiveTab('overview');
              setIsMapFullScreen(true);
            }}
            title="Return to Map"
          >
            <MapPin size={20} />
            Back to Map
          </button>
        </div>
      </div>

      {data.length === 0 && !isLoading && (
        <div className="glass-panel empty-state" style={{ minHeight: '300px', border: '1px dashed var(--glass-border)' }}>
          <Activity size={64} style={{ color: 'var(--primary)', opacity: 0.5, marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>Ready to Analyze Herd Data</h2>
          <p style={{ maxWidth: '400px', margin: '0 auto', color: 'var(--text-muted)' }}>
            Enter a valid Node ID (e.g. 120 / CS-1004) and select a date range to fetch real-time behavioral insights for the specific cattle.
          </p>
        </div>
      )}

      {data.length > 0 && (
        <>
          <div className="main-grid">
            {/* Summary Table */}
            <div className="glass-panel card">
              <h3 className="card-title"><Clock size={24} /> Activity Total Times</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Total Time (hrs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }}></span>
                            {item.name}
                          </div>
                        </td>
                        <td>{formatDuration(item.totalTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="glass-panel card">
              <h3 className="card-title"><Activity size={24} /> Activity Distribution</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.1)" />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name]}
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Grouped Activities Log */}
          <div className="glass-panel card">
            <h3 className="card-title">Activity Log</h3>
            <div className="table-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: 'rgba(30, 41, 59, 0.95)' }}>
                  <tr>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Activity Label</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedActivities.map((group, idx) => {
                    const firstTime = group[0].TimeStamp;
                    let lastTime;
                    if (idx < groupedActivities.length - 1) {
                      lastTime = groupedActivities[idx + 1][0].TimeStamp;
                    } else {
                      lastTime = format(new Date(endDate), 'yyyy-MM-dd HH:mm:ss');
                    }
                    const label = group[0].ActivityLabel;
                    
                    // Find color for label
                    const chartItem = chartData.find(c => c.name === label);
                    const color = chartItem ? chartItem.color : '#fff';

                    return (
                      <tr key={idx}>
                        <td>{firstTime}</td>
                        <td>{lastTime}</td>
                        <td>
                          <span className="badge" style={{ backgroundColor: `${color}33`, color: color, border: `1px solid ${color}66` }}>
                            {label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          <button className="btn-floating" onClick={downloadCSV} title="Download CSV">
            <Download size={20} /> CSV
          </button>
        </>
      )}
        </>
      )}
      </div>
    </>
  );
}

export default App;
