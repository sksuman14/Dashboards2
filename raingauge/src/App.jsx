import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

import { 
  CloudRain, 
  Settings, 
  ShieldCheck, 
  Mail, 
  CheckCircle,
  Activity,
  TrendingUp,
  Sparkles,
  Battery,
  Wifi,
  MapPin,
  Calendar,
  Download,
  ChevronRight,
  Loader2,
  RefreshCw,
  BarChart3,
  LineChart,
  Table,
  ArrowUpDown,
  Search,
  ExternalLink,
  Info,
  ChevronLeft,
  Filter,
  Menu,
  X
} from 'lucide-react';

function App() {
  const email = "";

  // Devices States
  const [devices, setDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [errorDevices, setErrorDevices] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  
  // Mobile Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // View More Devices State
  const [showAllDevices, setShowAllDevices] = useState(false);
  
  // Historical Analytics States
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState(null);
  const [datePreset, setDatePreset] = useState('24h'); // '24h', '7d', '30d', 'custom'
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [chartType, setChartType] = useState('line'); // 'line', 'bar'
  
  // Tooltip & Hover States
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Helper: Format Date for API
  const formatDateForAPI = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    return `${dd}-${MM}-${yyyy}`;
  };

  // Helper: Format ISO string to browser datetime input format (YYYY-MM-DDTHH:mm)
  const formatForDateTimeInput = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  };

  // Fetch Device list from WS_Device_Activity
  const fetchDevices = async () => {
    setLoadingDevices(true);
    setErrorDevices(null);
    try {
      const response = await fetch(import.meta.env.VITE_DEVICE_ACTIVITY_API);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      const devicesList = data.devices || [];
      
      const ssmetDevices = devicesList
        .filter(device => {
          const deviceIdTopic = device['deviceid#topic'] || device['deviceId#topic'] || '';
          return deviceIdTopic.toLowerCase().includes('ssmet_0126');
        })
        .map(device => {
          const deviceIdTopic = device['deviceid#topic'] || device['deviceId#topic'] || '';
          const parts = deviceIdTopic.split('#');
          const deviceId = parts[0] || device.DeviceId || 'Unknown';
          const topic = parts.slice(1).join('#') || device.Topic || '';
          
          const timeStr = device.TimeStamp_IST || '';
          let isActive = false;
          if (timeStr) {
            try {
              // Parse date correctly under cross-browser formats
              const formattedTimeStr = timeStr.replace(/-/g, '/');
              const lastTime = new Date(formattedTimeStr);
              const diffMs = new Date() - lastTime;
              const diffHours = diffMs / (1000 * 60 * 60);
              // Active if timestamp is within 1 hour
              isActive = diffHours <= 1 && diffHours >= 0;
            } catch (e) {
              console.error("Error parsing date:", e);
            }
          }
          
          return {
            deviceId,
            topic,
            originalTopic: deviceIdTopic,
            timeStamp: timeStr || 'N/A',
            isActive,
            longitude: device.Longitude || device.LastKnownLongitude || '0',
            latitude: device.Latitude || device.LastKnownLatitude || '0',
            city: device.City || 'Unknown Location',
            district: device.District || '',
            state: device.State || '',
            rainfallHourly: device.RainfallHourly !== undefined ? Number(device.RainfallHourly) : 0,
            rainfallDaily: device.RainfallDaily !== undefined ? Number(device.RainfallDaily) : 0,
            rainfallWeekly: device.RainfallWeekly !== undefined ? Number(device.RainfallWeekly) : 0,
            batteryVoltage: device.BatteryVoltage !== undefined ? Number(device.BatteryVoltage) : null,
            signalStrength: device.SignalStrength !== undefined ? Number(device.SignalStrength) : null,
            sdCardStatus: device.SDcardStatus || 'Unknown',
            firmwareVersion: device.FirmwareVersion || 'Unknown',
            imei: device.IMEINumber || 'N/A',
            rawDevice: device
          };
        });
        
      // Sort: Active first, then by deviceId numeric order
      ssmetDevices.sort((a, b) => {
        if (a.isActive && !b.isActive) return -1;
        if (!a.isActive && b.isActive) return 1;
        return a.deviceId.localeCompare(b.deviceId, undefined, { numeric: true, sensitivity: 'base' });
      });
      
      setDevices(ssmetDevices);
    } catch (err) {
      console.error("Failed to load device activities:", err);
      setErrorDevices(err.message || 'Could not fetch device status.');
    } finally {
      setLoadingDevices(false);
    }
  };

  // Fetch Time-Series Historical Rainfall Data
  const fetchHistoricalData = async (device, preset = datePreset, customS = customStart, customE = customEnd) => {
    if (!device) return;
    setLoadingHistory(true);
    setErrorHistory(null);
    setHoveredPoint(null);
    setCurrentPage(1);
    
    let start, end;
    const now = new Date();
    
    if (preset === '24h') {
      end = now;
      start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (preset === '7d') {
      end = now;
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (preset === '30d') {
      end = now;
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      start = customS ? new Date(customS) : new Date(now.getTime() - 24 * 60 * 60 * 1000);
      end = customE ? new Date(customE) : now;
    }
    
    const startDateStr = formatDateForAPI(start);
    const endDateStr = formatDateForAPI(end);
    
    try {
      const baseUrl = import.meta.env.VITE_HISTORICAL_DATA_API;
      const url = `${baseUrl}?deviceid=${device.deviceId}&startdate=${encodeURIComponent(startDateStr)}&enddate=${encodeURIComponent(endDateStr)}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      
      // Determine array structure in API response
      let readings = [];
      if (Array.isArray(data)) {
        readings = data;
      } else if (data && data.body) {
        try {
          const parsedBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
          if (Array.isArray(parsedBody)) readings = parsedBody;
          else if (parsedBody && Array.isArray(parsedBody.data)) readings = parsedBody.data;
          else if (parsedBody && Array.isArray(parsedBody.devices)) readings = parsedBody.devices;
        } catch(e) {
          console.error("Failed to parse data.body", e);
        }
      } else if (data && Array.isArray(data.devices)) {
        readings = data.devices;
      } else if (data && Array.isArray(data.data)) {
        readings = data.data;
      } else if (data && typeof data === 'object') {
        const arrayKey = Object.keys(data).find(k => Array.isArray(data[k]));
        if (arrayKey) readings = data[arrayKey];
      }
      
      const formattedReadings = readings.map(r => ({
        timestamp: r.TimeStamp_IST || r.TimeStamp || r.timestamp || 'N/A',
        rainfall: r.RainfallHourly !== undefined ? Number(r.RainfallHourly) : 0,
        battery: r.BatteryVoltage !== undefined ? Number(r.BatteryVoltage) : null,
        signal: r.SignalStrength !== undefined ? Number(r.SignalStrength) : null,
        temp: r.CurrentTemperature !== undefined ? Number(r.CurrentTemperature) : null,
        humidity: r.CurrentHumidity !== undefined ? Number(r.CurrentHumidity) : null,
      }));
      
      // Chronological sort
      formattedReadings.sort((a, b) => new Date(a.timestamp.replace(/-/g, '/')) - new Date(b.timestamp.replace(/-/g, '/')));
      
      setHistoricalData(formattedReadings);
    } catch (err) {
      console.error("Failed to load historical analytics:", err);
      setErrorHistory(err.message || 'Could not fetch time-series data.');
      setHistoricalData([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Run Initial Device Fetch
  useEffect(() => {
    fetchDevices();
    
    // Set custom date fields to default 24h range initially
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    setCustomStart(formatForDateTimeInput(yesterday));
    setCustomEnd(formatForDateTimeInput(now));
  }, []);

  // Fetch history when selected device or date preset changes
  useEffect(() => {
    if (selectedDevice) {
      fetchHistoricalData(selectedDevice, datePreset);
    }
  }, [selectedDevice, datePreset]);

  // Handle Device Selection
  const selectDevice = (device) => {
    setSelectedDevice(device);
    // Reset preset to default 24h
    setDatePreset('24h');
  };

  // CSV Export Utility
  const downloadCSV = () => {
    if (!historicalData || historicalData.length === 0 || !selectedDevice) return;
    const headers = ['Timestamp', 'Rainfall (mm)'];
    const csvRows = [
      headers.join(','),
      ...historicalData.map(r => [
        `"${r.timestamp}"`,
        r.rainfall
      ].join(','))
    ];
    
    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `SSMet0126_${selectedDevice.deviceId}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Device List Filtering
  const filteredDevices = useMemo(() => {
    return devices.filter(d => {
      const matchQuery = 
        d.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.state.toLowerCase().includes(searchQuery.toLowerCase());
        
      if (statusFilter === 'active') return matchQuery && d.isActive;
      if (statusFilter === 'inactive') return matchQuery && !d.isActive;
      return matchQuery;
    });
  }, [devices, searchQuery, statusFilter]);

  // SVG Chart Computations
  const chartHeight = 260;
  const chartWidth = 720;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  const maxRainfallVal = useMemo(() => {
    if (historicalData.length === 0) return 1.0;
    const maxVal = Math.max(...historicalData.map(d => d.rainfall));
    return maxVal > 0 ? maxVal * 1.1 : 1.0; // add 10% breathing room
  }, [historicalData]);

  const chartPoints = useMemo(() => {
    if (historicalData.length === 0) return [];
    const total = historicalData.length;
    return historicalData.map((d, i) => {
      const x = paddingLeft + (i * (innerWidth / Math.max(1, total - 1)));
      const y = (paddingTop + innerHeight) - (d.rainfall / maxRainfallVal) * innerHeight;
      return { x, y, data: d, index: i };
    });
  }, [historicalData, innerWidth, innerHeight, maxRainfallVal]);

  const svgPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    return chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }, [chartPoints]);

  const svgAreaPath = useMemo(() => {
    if (chartPoints.length === 0) return '';
    const startX = chartPoints[0].x;
    const endX = chartPoints[chartPoints.length - 1].x;
    const bottomY = paddingTop + innerHeight;
    return `${svgPath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  }, [chartPoints, svgPath, innerHeight]);

  const yAxisTicks = useMemo(() => {
    const ticks = [];
    const tickCount = 4;
    for (let i = 0; i <= tickCount; i++) {
      ticks.push((maxRainfallVal / tickCount) * i);
    }
    return ticks;
  }, [maxRainfallVal]);

  const xAxisLabels = useMemo(() => {
    if (historicalData.length === 0) return [];
    const total = historicalData.length;
    if (total <= 5) return historicalData.map((d, i) => ({ label: d.timestamp, index: i }));
    const step = Math.floor(total / 4);
    const labels = [];
    for (let i = 0; i < 4; i++) {
      labels.push({ label: historicalData[i * step].timestamp, index: i * step });
    }
    labels.push({ label: historicalData[total - 1].timestamp, index: total - 1 });
    return labels;
  }, [historicalData]);

  const formatTimeLabel = (timestamp) => {
    if (!timestamp || timestamp === 'N/A') return '';
    try {
      const parts = timestamp.split(' ');
      if (parts.length >= 2) {
        const dateParts = parts[0].split('-'); // yyyy-mm-dd
        const timeParts = parts[1].split(':'); // hh:mm:ss
        return `${dateParts[1]}-${dateParts[2]} ${timeParts[0]}:${timeParts[1]}`;
      }
    } catch(e) {}
    return timestamp;
  };

  const handleChartMouseMove = (e) => {
    if (chartPoints.length === 0) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const scaleX = chartWidth / rect.width;
    const svgX = clientX * scaleX;
    
    let closest = chartPoints[0];
    let minDist = Math.abs(chartPoints[0].x - svgX);
    
    for (let i = 1; i < chartPoints.length; i++) {
      const dist = Math.abs(chartPoints[i].x - svgX);
      if (dist < minDist) {
        minDist = dist;
        closest = chartPoints[i];
      }
    }
    setHoveredPoint(closest);
  };

  // Rainfall Stats Summary
  const rainfallStats = useMemo(() => {
    if (historicalData.length === 0) return { total: 0, max: 0, avg: 0 };
    const values = historicalData.map(d => d.rainfall);
    const total = values.reduce((sum, v) => sum + v, 0);
    const max = Math.max(...values);
    const avg = total / values.length;
    return {
      total: Number(total.toFixed(2)),
      max: Number(max.toFixed(2)),
      avg: Number(avg.toFixed(2))
    };
  }, [historicalData]);

  // Paginated raw data table items
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return historicalData.slice(startIndex, startIndex + itemsPerPage);
  }, [historicalData, currentPage]);

  const totalPages = Math.ceil(historicalData.length / itemsPerPage);
  
  const stats = [
    { val: "0.2 mm", lbl: "Resolution", desc: "Per tip volume threshold" },
    { val: "200 cm²", lbl: "Collection Area", desc: "Inlet mouth diameter options" },
    { val: "ABS", lbl: "Material", desc: "UV-stabilized weather shield" }
  ];

  const bannerPoints = [
    "Balanced tipping bucket mechanism ensures high accuracy",
    "Minimal moving parts → long-term reliability with low maintenance",
    "Reed switch / magnetic sensor for precise tip detection",
    "Durable ABS body with weather resistance",
    "Easy integration with data loggers and weather stations"
  ];

  const techHighlights = [
    {
      value: "0.2 mm",
      label: "Precision Resolution",
      description: "Balanced tipping bucket mechanism designed for absolute measurement precision across diverse precipitation intensities."
    },
    {
      value: "ABS+",
      label: "Industrial Build Quality",
      description: "Advanced UV-stabilized ABS construction engineered for 10+ years of maintenance-free operation in extreme UVB environments."
    },
    {
      value: "Reed",
      label: "Inductive Sensing",
      description: "Fully-potted magnetic reed switch providing zero mechanical friction and infinite cycle life for long-term field stability."
    }
  ];

  const specifications = [
    { label: "Material", value: "UV-resistant high-impact ABS" },
    { label: "Diameter options", value: "159.5 mm / 200 mm" },
    { label: "Collection area", value: "200 cm² / 314 cm²" },
    { label: "Measurement res.", value: "0.2 mm / 0.5 mm" },
    { label: "Sensor type", value: "Magnetic reed switch" },
    { label: "Digital output", value: "Pulse output (Tips × Res)" },
    { label: "Calibration", value: "Individually factory verified" }
  ];

  const detailedFeatures = [
    {
      title: "Precision Tipping Mechanism",
      description: "Precisely balanced dual-compartment tipping bucket design with high-sensitivity magnetic reed switch for millimeter-precise rainfall detection.",
      icon: <TrendingUp size={24} />
    },
    {
      title: "Low-Maintenance Architecture",
      description: "Zero calibration drift and minimal moving parts ensure years of reliable operation with basic periodic cleaning and no electronic wear.",
      icon: <Settings size={24} />
    },
    {
      title: "All-Weather UV Shielding",
      description: "High-grade ABS construction with custom UV protection coating. Engineered to withstand high surface temperatures and persistent humidity.",
      icon: <ShieldCheck size={24} />
    },
    {
      title: "Universal Logger Output",
      description: "Simple digital pulse output compatible with all industrial data loggers, telemetries, and IoT telemetry gateways.",
      icon: <Activity size={24} />
    }
  ];

  const detailedApplications = [
    {
      title: "Meteorological Networks",
      description: "Nationwide rainfall monitoring networks for weather forecasting, climate modeling, and hydrology research.",
      tag: "Meteorology"
    },
    {
      title: "Smart Agricultural Systems",
      description: "Precise rainfall telemetry data for planting schedules, automated irrigation management, and crop health diagnostics.",
      tag: "AgriTech"
    },
    {
      title: "Urban Stormwater Infrastructure",
      description: "Urban drainage system monitoring and real-time flood risk assessment for city planners and civil engineering.",
      tag: "Infrastructure"
    },
    {
      title: "Environmental Research",
      description: "Long-term data collection in forest, mountain, and river basin areas to study environmental changes and water cycles.",
      tag: "Research"
    }
  ];

  return (
    <div className="raingauge-app">
      {/* Background Visual Effects */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Navigation Header */}
      <header className="site-header">
        <div className="header-container">
          <div className="logo">
            <CloudRain className="logo-icon" />
            <span className="brand-text">Rain<span className="cyan-dot">Gauge</span></span>
          </div>
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#deployment" onClick={() => setIsMenuOpen(false)}>Deployment</a>
            <a href="#devices" onClick={() => setIsMenuOpen(false)}>Live Stations</a>
            <a href="#specs" onClick={() => setIsMenuOpen(false)}>Specifications</a>
            <a href="#applications" onClick={() => setIsMenuOpen(false)}>Applications</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section main-layout">
        <div className="hero-content animate-fade-in">
          <div className="eyebrow-container">
            <span className="pulse-dot"></span>
            <span className="eyebrow">Professional Meteorology Grade</span>
          </div>
          <h1 className="hero-title">
            Precision <br />
            <span className="text-gradient">Rain Gauge</span>
          </h1>
          <p className="hero-subtitle">
            An industrial tipping bucket rain gauge engineered for absolute reliability, precision detection, and maintenance-free longevity in extreme climates.
          </p>
          
          <div className="banner-points">
            {bannerPoints.map((point, i) => (
              <div className="banner-point" key={i}>
                <CheckCircle size={18} className="point-icon" />
                <span>{point}</span>
              </div>
            ))}
          </div>


        </div>

        <div className="hero-visual animate-fade-in">
          <div className="product-card-3d">
            <div className="product-card-glow"></div>
            <div className="product-image-frame">
              <img src="/gauge.png" alt="Rain Gauge" className="product-image" />
            </div>
            <div className="card-badge">
              <Sparkles size={16} className="badge-icon" />
              <span>Calibrated Bucket Sensor</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Overview Badges */}
      <section className="stats-section main-layout">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-glow"></div>
            <div className="stat-val">{stat.val}</div>
            <div className="stat-lbl">{stat.lbl}</div>
            <div className="stat-desc">{stat.desc}</div>
          </div>
        ))}
      </section>

      {/* Deployment Map Section */}
      <section id="deployment" className="deployment-section main-layout" style={{ marginBottom: '4rem' }}>
        <div className="section-header">
          <span className="section-subtitle">Live Network</span>
          <h2 className="section-title">Deployment Map</h2>
          <p className="section-desc">
            Geospatial visualization of SSMet0126 weather station nodes.
          </p>
        </div>
        <div className="map-wrapper" style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          <MapContainer center={[31.1, 75.6]} zoom={7} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {devices.map(d => {
              const lat = parseFloat(d.latitude);
              const lng = parseFloat(d.longitude);
              if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null;
              return (
                <Marker key={d.deviceId} position={[lat, lng]}>
                  <Popup>
                    <div style={{ padding: '4px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--text-dark)' }}>ID: {d.deviceId}</strong><br />
                      <span style={{ color: '#4b5563' }}>{d.city}, {d.state}</span><br />
                      <span style={{ 
                        color: d.isActive ? '#10b981' : '#f43f5e', 
                        fontWeight: '600',
                        fontSize: '12px'
                      }}>
                        {d.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </section>

      {/* Real-Time Devices Dashboard Section */}
      <section id="devices" className="devices-section main-layout">
        <div className="section-header">
          <h2 className="section-title">Real-Time Data</h2>
        </div>

        {!selectedDevice ? (
          /* Overview Panel showing all device cards */
          <div className="dashboard-wrapper">
            <div className="dashboard-toolbar">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search by Station ID or Location..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filters-group">
                <div className="filter-buttons">
                  <button 
                    className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('all')}
                  >
                    All ({devices.length})
                  </button>
                  <button 
                    className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('active')}
                  >
                    Active ({devices.filter(d => d.isActive).length})
                  </button>
                  <button 
                    className={`filter-btn ${statusFilter === 'inactive' ? 'active' : ''}`}
                    onClick={() => setStatusFilter('inactive')}
                  >
                    Inactive ({devices.filter(d => !d.isActive).length})
                  </button>
                </div>
                <button className="btn-refresh" onClick={fetchDevices} disabled={loadingDevices}>
                  <RefreshCw size={16} className={loadingDevices ? 'spin' : ''} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {loadingDevices ? (
              /* Loading Skeleton List */
              <div className="devices-list">
                {[1, 2, 3, 4, 5].map(idx => (
                  <div className="device-list-item skeleton-item" key={idx}>
                    <div className="skeleton-dot"></div>
                    <div className="skeleton-info">
                      <div className="skeleton-line skeleton-title"></div>
                      <div className="skeleton-line skeleton-subtitle"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : errorDevices ? (
              /* Error State */
              <div className="error-card">
                <Info size={32} className="error-icon" />
                <h3>Failed to load devices</h3>
                <p>{errorDevices}</p>
                <button className="btn-primary" onClick={fetchDevices}>
                  <RefreshCw size={16} /> Retry Fetch
                </button>
              </div>
            ) : filteredDevices.length === 0 ? (
              /* Empty State */
              <div className="empty-card">
                <Info size={32} className="empty-icon" />
                <h3>No stations found</h3>
                <p>Try adjusting your search query or filter.</p>
              </div>
            ) : (
              /* Device List */
              <div className="devices-list-container">
                <div className="devices-list-header">
                  <span>{filteredDevices.length} devices found</span>
                </div>
                <div className="devices-list">
                  {(showAllDevices ? filteredDevices : filteredDevices.slice(0, 5)).map(d => (
                    <div className="device-list-item" key={d.deviceId} onClick={() => selectDevice(d)}>
                      <div className={`status-dot-indicator ${d.isActive ? 'active' : 'inactive'}`}></div>
                      <div className="device-list-info">
                        <h3>{d.deviceId.includes('SSMet') || d.deviceId.includes('ANNAM') ? 'ID: ' : ''}{d.deviceId}</h3>
                        <p>{d.district ? `${d.district}, ` : ''}{d.city ? `${d.city}, ` : ''}{d.state || 'India'}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredDevices.length > 5 && !showAllDevices && (
                  <div style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: '1rem' }}>
                    <button className="btn-secondary" style={{ margin: '0 auto' }} onClick={() => setShowAllDevices(true)}>
                      View More Stations
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Detail dashboard view (replacing grid) */
          <div className="detail-dashboard">
            <button className="btn-back" onClick={() => setSelectedDevice(null)}>
              <ChevronLeft size={18} />
              <span>Back to Stations</span>
            </button>

            <div className="dashboard-grid">
              {/* Left Column: Metadata & Current telemetries */}
              <div className="dashboard-panel panel-left">
                <div className="panel-header">
                  <h3 className="panel-title">Station #{selectedDevice.deviceId} Details</h3>
                  <span className={`status-badge ${selectedDevice.isActive ? 'active' : 'inactive'}`}>
                    <span className="status-dot"></span>
                    {selectedDevice.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="station-location-block">
                  <div className="loc-header">
                    <MapPin size={18} className="loc-icon" />
                    <h4>{selectedDevice.city || 'Unknown Location'}</h4>
                  </div>
                  <p className="loc-sub">{selectedDevice.district}, {selectedDevice.state}</p>
                  
                  <div className="coordinates-badge">
                    <span>Lat: {Number(selectedDevice.latitude).toFixed(4)}</span>
                    <span className="separator">|</span>
                    <span>Lng: {Number(selectedDevice.longitude).toFixed(4)}</span>
                  </div>
                </div>

                <div className="live-telemetries-list">
                  <h4 className="list-title">Live Sensor Parameters</h4>
                  
                  <div className="telemetry-row">
                    <span className="telemetry-label">Rainfall</span>
                    <span className="telemetry-value highlight">{selectedDevice.rainfallHourly} mm</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Historical analytics charts and tables */}
              <div className="dashboard-panel panel-right">
                {/* Date Selection Panel */}
                <div className="control-bar" style={{ marginBottom: '1.5rem' }}>
                  <div className="date-preset-selectors">
                    <button 
                      className={`preset-btn ${datePreset === '24h' ? 'active' : ''}`}
                      onClick={() => setDatePreset('24h')}
                    >
                      1 Day
                    </button>
                    <button 
                      className={`preset-btn ${datePreset === '7d' ? 'active' : ''}`}
                      onClick={() => setDatePreset('7d')}
                    >
                      7 Days
                    </button>
                    <button 
                      className={`preset-btn ${datePreset === 'custom' ? 'active' : ''}`}
                      onClick={() => setDatePreset('custom')}
                    >
                      Custom Date
                    </button>
                  </div>
                  
                  {datePreset === 'custom' && (
                    <form className="custom-date-form" onSubmit={(e) => {
                      e.preventDefault();
                      fetchHistoricalData(selectedDevice, 'custom', customStart, customEnd);
                    }}>
                      <div className="date-field">
                        <label>Start</label>
                        <input 
                          type="datetime-local" 
                          value={customStart}
                          onChange={e => setCustomStart(e.target.value)}
                        />
                      </div>
                      <div className="date-field">
                        <label>End</label>
                        <input 
                          type="datetime-local" 
                          value={customEnd}
                          onChange={e => setCustomEnd(e.target.value)}
                        />
                      </div>
                      <button type="submit" className="btn-apply-custom">
                        Apply
                      </button>
                    </form>
                  )}
                </div>
                <div className="rainfall-summary-card">
                  <div className="rsc-header">
                    <CloudRain size={16} className="rsc-icon" />
                    <span className="rsc-title">RAINFALL</span>
                  </div>
                  <div className="rsc-main-value">
                    <span className="rsc-val">{Number(selectedDevice.rainfallHourly || 0).toFixed(2)}</span>
                    <span className="rsc-unit">mm</span>
                  </div>
                  <div className="rsc-sub-value">
                    Total rain: {rainfallStats.total} mm
                  </div>
                </div>

                {/* Chart Block */}
                <div className="chart-wrapper">
                  <div className="chart-header" style={{ justifyContent: 'center', position: 'relative' }}>
                    <div className="chart-title-block" style={{ margin: '0 auto' }}>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Rainfall (mm)</h4>
                    </div>
                    {historicalData.length > 0 && (
                      <button 
                        onClick={downloadCSV} 
                        style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', color: 'var(--text-slate)', cursor: 'pointer' }}
                        title="Download CSV"
                      >
                        <Download size={18} />
                      </button>
                    )}
                  </div>

                  {loadingHistory ? (
                    <div className="chart-placeholder loading">
                      <Loader2 size={36} className="spin loader-icon" />
                      <span>Fetching time-series records...</span>
                    </div>
                  ) : errorHistory ? (
                    <div className="chart-placeholder error">
                      <Info size={32} className="error-icon" />
                      <span>{errorHistory}</span>
                      <button className="btn-refresh" onClick={() => fetchHistoricalData(selectedDevice)}>
                        <RefreshCw size={14} /> Retry
                      </button>
                    </div>
                  ) : historicalData.length === 0 ? (
                    <div className="chart-placeholder empty">
                      <Info size={32} className="empty-icon" />
                      <span>No precipitation readings in selected range.</span>
                    </div>
                  ) : (
                    <div className="svg-chart-container">
                      <svg 
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                        className="svg-chart"
                        onMouseMove={handleChartMouseMove}
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        {/* Background Grids */}
                        {yAxisTicks.map((tick, i) => {
                          const y = (paddingTop + innerHeight) - (tick / maxRainfallVal) * innerHeight;
                          return (
                            <g key={i} className="grid-group">
                              <line 
                                x1={paddingLeft} 
                                y1={y} 
                                x2={chartWidth - paddingRight} 
                                y2={y} 
                                className="grid-line"
                              />
                              <text 
                                x={paddingLeft - 8} 
                                y={y + 4} 
                                className="y-axis-label"
                              >
                                {tick.toFixed(1)}
                              </text>
                            </g>
                          );
                        })}

                        {/* Line Chart */}
                        {chartType === 'line' && (
                          <g>
                            <path d={svgPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                          </g>
                        )}

                        {/* Bar Chart */}
                        {chartType === 'bar' && (
                          <g className="bars-group">
                            {chartPoints.map((pt, i) => {
                              const barW = Math.max(3, Math.min(25, (innerWidth / chartPoints.length) * 0.7));
                              const barH = (pt.data.rainfall / maxRainfallVal) * innerHeight;
                              const x = pt.x - barW / 2;
                              const y = pt.y;
                              return (
                                <rect 
                                  key={i} 
                                  x={x} 
                                  y={y} 
                                  width={barW} 
                                  height={Math.max(1.5, barH)} 
                                  rx={Math.min(3, barW / 2)}
                                  fill={hoveredPoint && hoveredPoint.index === i ? 'var(--neon-teal)' : 'rgba(6, 182, 212, 0.7)'}
                                  className="chart-bar"
                                />
                              );
                            })}
                          </g>
                        )}

                        {/* Hover reference Line and tooltip indicator */}
                        {hoveredPoint && (
                          <g>
                            <line 
                              x1={hoveredPoint.x} 
                              y1={paddingTop} 
                              x2={hoveredPoint.x} 
                              y2={paddingTop + innerHeight} 
                              className="hover-ref-line"
                            />
                            <circle 
                              cx={hoveredPoint.x} 
                              cy={hoveredPoint.y} 
                              r="5" 
                              fill="var(--neon-teal)" 
                              stroke="#030712"
                              strokeWidth="2"
                            />
                          </g>
                        )}

                        {/* X Axis labels */}
                        {xAxisLabels.map((lbl, i) => {
                          const pt = chartPoints[lbl.index];
                          if (!pt) return null;
                          return (
                            <text 
                              key={i} 
                              x={pt.x} 
                              y={paddingTop + innerHeight + 15} 
                              className="x-axis-label"
                              transform={`rotate(-45 ${pt.x} ${paddingTop + innerHeight + 15})`}
                              style={{ textAnchor: 'end', fontSize: '10px', fill: 'var(--text-muted)' }}
                            >
                              {formatTimeLabel(lbl.label)}
                            </text>
                          );
                        })}
                      </svg>

                      {/* Floating Tooltip inside container */}
                      {hoveredPoint && (
                        <div 
                          className="chart-tooltip"
                          style={{
                            left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                            top: `${(hoveredPoint.y / chartHeight) * 100 - 10}%`,
                            transform: 'translate(-50%, -100%)'
                          }}
                        >
                          <div className="tooltip-time">{hoveredPoint.data.timestamp}</div>
                          <div className="tooltip-value">
                            <span className="lbl">Rain:</span>
                            <span className="val">{hoveredPoint.data.rainfall} mm</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>


              </div>
            </div>
          </div>
        )}
      </section>


      {/* Features Showcase Section */}
      <section id="features" className="features-section main-layout">
        <div className="section-header">
          <span className="section-subtitle">Engineering Design</span>
          <h2 className="section-title">Designed for Extreme Environments</h2>
        </div>
        <div className="features-grid">
          {detailedFeatures.map((feat, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-glow"></div>
              <div className="feature-header">
                <div className="feature-icon">{feat.icon}</div>
                <h3>{feat.title}</h3>
              </div>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Highlights Panel */}
      <section className="highlights-section main-layout">
        <div className="section-header">
          <span className="section-subtitle">Technology Pillars</span>
          <h2 className="section-title">Core Technology Highlights</h2>
        </div>
        <div className="highlights-grid">
          {techHighlights.map((highlight, i) => (
            <div className="highlight-card" key={i}>
              <span className="highlight-tag">{highlight.value}</span>
              <h3>{highlight.label}</h3>
              <p>{highlight.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Specifications Details Section */}
      <section id="specs" className="specs-section main-layout">
        <div className="section-header">
          <span className="section-subtitle">Product Datasheet</span>
          <h2 className="section-title">Technical Specifications</h2>
        </div>
        <div className="specs-card">
          <div className="specs-table">
            {specifications.map((spec, i) => (
              <div className="spec-row" key={i}>
                <span className="spec-label">{spec.label}</span>
                <span className="spec-value">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Domains Grid */}
      <section id="applications" className="apps-section main-layout">
        <div className="section-header">
          <span className="section-subtitle">Use Cases</span>
          <h2 className="section-title">Field Deployments</h2>
        </div>
        <div className="apps-grid">
          {detailedApplications.map((app, i) => (
            <div className="app-card" key={i}>
              <div className="app-card-glow"></div>
              <span className="app-tag">{app.tag}</span>
              <h3>{app.title}</h3>
              <p>{app.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-copyright">
             <p>&copy; Rain Gauge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
