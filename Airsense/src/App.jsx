import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import PoultryHouse from './PoultryHouse.jsx';
import Home from './Home.jsx';
import {
  Wind, Thermometer, Droplets, Cpu, Wifi, Battery, BatteryCharging,
  AlertTriangle, TrendingUp, Settings, Layers, DollarSign, Calendar,
  Users, CheckCircle, ExternalLink, ShieldAlert, Play, Info, Activity,
  ChevronDown, ChevronUp, Bell, RefreshCw, Globe, FileText
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import './App.css';
import productImg from './assets/airsense_product.png';
import deployment1 from './assets/deployment1.jpeg';
import deployment2 from './assets/deployment2.jpeg';
import deployment3 from './assets/deployment3.jpeg';
import deployment4 from './assets/deployment4.jpeg';
import deployment5 from './assets/deployment5.jpeg';
import { MapContainer, TileLayer, Marker, Tooltip as LeafletTooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Initial mock data for the real-time chart
const initialChartData = [
  { time: '11:15', co2: 620, temp: 23.4, humidity: 44 },
  { time: '11:16', co2: 750, temp: 23.5, humidity: 45 },
  { time: '11:17', co2: 920, temp: 23.6, humidity: 43 },
  { time: '11:18', co2: 1200, temp: 23.8, humidity: 46 },
  { time: '11:19', co2: 1050, temp: 23.7, humidity: 45 },
  { time: '11:20', co2: 850, temp: 23.5, humidity: 44 },
  { time: '11:21', co2: 680, temp: 23.4, humidity: 44 },
];

// Deterministic hash functions for consistent simulated AI data
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Generate 24 hourly data points for a specific device and date
const generateHourlyData = (deviceId, dateStr) => {
  const seedBase = hashCode(deviceId + '-' + dateStr);
  const data = [];

  // Determine if this is an industrial device or a day with poor ventilation
  const isIndustrial = deviceId === '107'; // Jalandhar tehsil, Industrial Area
  const isHighDay = seededRandom(seedBase + 999) > 0.6; // 40% chance of high CO2 day

  for (let hour = 0; hour < 24; hour++) {
    const seed = seedBase + hour;
    const rand1 = seededRandom(seed);
    const rand2 = seededRandom(seed + 100);
    const rand3 = seededRandom(seed + 200);

    // CO2 pattern: peaks between 9 AM and 6 PM (work hours)
    const deviceShift = (parseInt(deviceId) || 0) % 60;
    let co2Base = 420 + deviceShift;

    // Add offsets for high CO2 situations
    if (isIndustrial) {
      co2Base += 1200; // baseline shift for industrial environment
    } else if (isHighDay) {
      co2Base += 600; // baseline shift for poor ventilation days
    }

    if (hour >= 9 && hour <= 18) {
      const distFromPeak = Math.abs(hour - 14);
      let peakOffset = 350;
      if (isIndustrial) {
        peakOffset = 2600; // spikes up to 4500+ ppm
      } else if (isHighDay) {
        peakOffset = 1800; // spikes up to 3000+ ppm
      }
      co2Base += peakOffset - distFromPeak * distFromPeak * (isIndustrial ? 36 : isHighDay ? 24 : 12);
    } else {
      co2Base += 20 + rand1 * 45;
      if (isIndustrial) co2Base += 300;
      else if (isHighDay) co2Base += 100;
    }

    // Clamp min CO2
    let co2 = Math.round(co2Base + rand1 * (isIndustrial ? 250 : isHighDay ? 150 : 80));
    if (co2 < 380) co2 = 380;

    // Temperature: peaks around 3 PM (hour 15)
    const tempBase = 21.0 + (deviceShift * 0.08) + Math.sin((hour - 8) / 24 * 2 * Math.PI) * 3.8;
    const temp = +(tempBase + rand2 * 1.0).toFixed(1);

    // Humidity: inverse of temperature
    const humBase = 60.0 - (deviceShift * 0.15) - Math.sin((hour - 8) / 24 * 2 * Math.PI) * 11.0;
    const humidity = Math.round(humBase + rand3 * 5);

    const time = `${hour.toString().padStart(2, '0')}:00`;

    data.push({
      time,
      co2,
      temp,
      humidity
    });
  }
  return data;
};

// Get list of dates in YYYY-MM-DD format between start and end
const getDatesInRange = (startStr, endStr) => {
  const dates = [];
  const start = new Date(startStr);
  const end = new Date(endStr);

  // Guard for invalid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return [];
  }

  // Clamp range to max 30 days to protect performance
  let current = new Date(start);
  let limit = 0;
  while (current <= end && limit < 31) {
    const yyyy = current.getFullYear();
    const mm = String(current.getMonth() + 1).padStart(2, '0');
    const dd = String(current.getDate()).padStart(2, '0');
    dates.push(`${yyyy}-${mm}-${dd}`);
    current.setDate(current.getDate() + 1);
    limit++;
  }
  return dates;
};

// Generate daily aggregate data for a specific device and a range of dates
const generateRangeData = (deviceId, startDateStr, endDateStr) => {
  const dates = getDatesInRange(startDateStr, endDateStr);
  if (!dates || dates.length === 0) return [];
  return dates.map(dateStr => {
    const hourly = generateHourlyData(deviceId, dateStr);
    const avgCo2 = Math.round(hourly.reduce((sum, d) => sum + d.co2, 0) / hourly.length);
    const maxCo2 = Math.max(...hourly.map(d => d.co2));
    const avgTemp = +(hourly.reduce((sum, d) => sum + d.temp, 0) / hourly.length).toFixed(1);
    const avgHum = Math.round(hourly.reduce((sum, d) => sum + d.humidity, 0) / hourly.length);

    const parts = dateStr.split('-');
    const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return {
      date: dateStr,
      label,
      co2: avgCo2,
      maxCo2,
      temp: avgTemp,
      humidity: avgHum
    };
  });
};

// Helper for generating AI logs dynamically for a selected device, date and threshold
const generateAILogsForDate = (deviceId, dateStr, sensitivity) => {
  const hourly = generateHourlyData(deviceId, dateStr);
  const logsList = [];

  const anomalies = hourly.filter(h => h.co2 > sensitivity);

  logsList.push({
    id: 'log-1',
    time: '00:00',
    text: `AI Model loaded telemetry for Device ${deviceId} on ${dateStr}.`,
    type: 'info'
  });

  if (anomalies.length > 0) {
    logsList.push({
      id: 'log-2',
      time: anomalies[0].time,
      text: `ALERT: Device ${deviceId} high CO₂ anomaly (${anomalies[0].co2} ppm).`,
      type: 'danger'
    });

    const peakHour = hourly.reduce((max, h) => h.co2 > max.co2 ? h : max, hourly[0]);
    logsList.push({
      id: 'log-3',
      time: peakHour.time,
      text: `Device ${deviceId} Peak: CO₂ reached ${peakHour.co2} ppm. Standard SHT40 mode.`,
      type: 'warn'
    });
  } else {
    logsList.push({
      id: 'log-2',
      time: '08:00',
      text: `Device ${deviceId} air quality nominal. SHT40 Eco Mode active.`,
      type: 'success'
    });
  }

  return logsList;
};

const deviceMappings = [
  { start: 1, end: 4, location: 'BFCET, BHATINDA', date: '09-08-2024', endDate: '08-09-2024', coords: [30.2109, 74.9455] },
  { start: 5, end: 9, location: 'University of ladakh', date: '18-09-2024', endDate: '18-10-2024', coords: [34.1664, 77.5815] },
  { start: 10, end: 13, location: 'IIIT UNA', date: '11-01-2024', endDate: '10-02-2024', coords: [31.3945, 76.3314] },
  { start: 14, end: 18, location: 'IILM, GREATER NOIDA', date: '06-03-2024', endDate: '05-04-2024', coords: [28.4590, 77.4988] },
  { start: 19, end: 21, location: 'HRIT, GHAZIBAD', date: '26-06-2025', endDate: '26-07-2025', coords: [28.7112, 77.4475] },
  { start: 22, end: 26, location: 'SVPUAT, MEERUT', date: '21-05-2025', endDate: '20-06-2025', coords: [29.0734, 77.7011] },
  { start: 27, end: 31, location: 'ACROPOLIS, INDORE', date: '28-08-2025', endDate: '27-09-2025', coords: [22.8276, 75.9868] },
  { start: 32, end: 36, location: 'MIET, JAMMU', date: '25-09-2025', endDate: '25-10-2025', coords: [32.8105, 74.8385] },
  { start: 37, end: 41, location: 'SHOOLINI, SOLAN', date: '16-10-2025', endDate: '15-11-2025', coords: [30.8660, 77.1232] },
  { start: 42, end: 46, location: 'EPIC, AMBALA', date: '28-11-2025', endDate: '28-12-2025', coords: [30.3782, 76.7767] },
  { start: 70, end: 70, location: 'IIT Ropar (Live Node)', date: '17-06-2026', endDate: '17-06-2026', coords: [30.9753, 76.5404] }
];

const mockDevices = [];
deviceMappings.forEach(mapping => {
  for (let i = mapping.start; i <= mapping.end; i++) {
    mockDevices.push({
      id: String(i),
      location: mapping.location,
      area: `Date: ${mapping.date}`,
      endDateStr: mapping.endDate,
      coords: mapping.coords
    });
  }
});

function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Helper to get local YYYY-MM-DD date string
  const getLocalDateString = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  const todayStr = getLocalDateString();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/poultry-house') {
      setActiveTab('poultry-house');
    } else if (location.pathname === '/air-quality') {
      if (activeTab === 'poultry-house') {
        setActiveTab('home');
      }
    }
  }, [location.pathname]);

  const navigateToTab = (tabId) => {
    if (tabId === 'poultry-house') {
      navigate('/poultry-house');
    } else {
      if (location.pathname !== '/air-quality') {
        navigate('/air-quality');
      }
      setActiveTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Selected Date and Custom Range States for AI Dashboard
  const [selectedDeviceId, setSelectedDeviceId] = useState('1');
  const [selectedDate, setSelectedDate] = useState('2024-08-09');
  const [selectedHour, setSelectedHour] = useState(12); // default noon
  // Mode switching logic: Users can toggle between 'live', '1day', '7days', and 'custom' modes.
  // Switching between these modes updates the UI state immediately without reloading the page.
  const [rangeMode, setRangeMode] = useState('1day'); // 'live', '1day', '7days', 'custom'
  const [customStartDate, setCustomStartDate] = useState('2024-08-09');
  const [customEndDate, setCustomEndDate] = useState('2024-09-08');
  const [aiSensitivity, setAiSensitivity] = useState(1000);
  const [ecoBias, setEcoBias] = useState('balanced');

  // Simulator & Dashboard States
  const [co2, setCo2] = useState(650);
  const [isCharging, setIsCharging] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(72);
  const [isOnline, setIsOnline] = useState(true);
  const [tempUnit, setTempUnit] = useState('C'); // C or F
  const [temp, setTemp] = useState(23.4);
  const [humidity, setHumidity] = useState(44.2);
  const [packetsSent, setPacketsSent] = useState(128);
  const [packetsReceived, setPacketsReceived] = useState(122);
  const [chartData, setChartData] = useState(initialChartData);
  const [logs, setLogs] = useState([
    { id: 1, time: '11:21:40', text: 'AirSense device connected via 4G LTE-M.', type: 'info' },
    { id: 2, time: '11:21:42', text: 'MQTT session established with AWS IoT Core.', type: 'success' },
    { id: 3, time: '11:21:45', text: 'Telemetry published: CO2 680 ppm, Temp 23.4°C.', type: 'info' }
  ]);

  // UI Accents / State Specs
  const [openSpec, setOpenSpec] = useState(0);

  // API Integration Design:
  // Historical data is fetched from '/default/air-sense-data-fecth' with start/end date parameters.
  // Live data is fetched from the same host, using parameter 'source=live&day=17' and is polled every 30 seconds.
  const [apiData, setApiData] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  // Live Mode states
  const [liveData, setLiveData] = useState([]);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [liveError, setLiveError] = useState(null);

  // Zoom States for Trend Graphs
  const [zoomStart, setZoomStart] = useState(0);
  const [zoomEnd, setZoomEnd] = useState(1000);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 1. Determine Air Quality Status and LED colors
  const getAirQualityStatus = (val) => {
    if (val === undefined || val === null || val === '--' || val === 0) {
      return { status: 'No Data', color: '#64748b', rgb: '100, 116, 139', desc: 'Live telemetry data is currently not available for this device.' };
    }
    if (val <= 1000) return { status: 'Good', color: 'var(--co2-good)', rgb: '34, 197, 94', desc: 'Air is clean and safe. Optimal ventilation.' };
    if (val <= 2000) return { status: 'Moderate', color: 'var(--co2-moderate)', rgb: '234, 179, 8', desc: 'Acceptable level. Fresh air circulation suggested.' };
    if (val <= 3000) return { status: 'Poor', color: 'var(--co2-poor)', rgb: '217, 70, 239', desc: 'High concentration. Open windows or turn on ventilation.' };
    if (val <= 4000) return { status: 'Very Poor', color: 'var(--co2-very-poor)', rgb: '59, 130, 246', desc: 'Stale air. Headaches, sleepiness and fatigue possible.' };
    return { status: 'Hazardous', color: 'var(--co2-hazardous)', rgb: '239, 68, 68', desc: 'Critical level! Immediately vacate or maximize ventilation.' };
  };

  const aq = getAirQualityStatus(co2);

  // API integration: Fetches telemetry data from AWS endpoints.
  // For Device 70, we fetch live telemetry from the live source and poll every 30 seconds.
  // For other devices, we fetch historical telemetry for the selected range.
  useEffect(() => {
    const fetchApiData = async () => {
      setIsLoadingApi(true);
      try {
        if (selectedDeviceId === '70') {
          const url = `https://nqqob9ywxe.execute-api.us-east-1.amazonaws.com/default/air-sense-data-fecth?deviceId=70&source=live&day=17`;
          const response = await fetch(url);
          const result = await response.json();

          if (result && result.data && Array.isArray(result.data)) {
            const formattedData = result.data.map((item, index) => {
              const timePart = item.Timestamp ? item.Timestamp.split(' ')[1] : '00:00:00';
              const datePart = item.Timestamp ? item.Timestamp.split(' ')[0] : '17-06-2026';
              
              // Convert DD-MM-YYYY to YYYY-MM-DD
              let dateStr = datePart;
              const parts = datePart.split('-');
              if (parts.length === 3 && parts[2].length === 4) {
                dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
              }

              const parts2 = dateStr.split('-');
              const dateObj = new Date(parts2[0], parts2[1] - 1, parts2[2]);
              const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              return {
                date: dateStr,
                label: label,
                time: timePart.substring(0, 5),
                co2: item.CO2 || 0,
                temp: item.CurrentTemperature || 0,
                humidity: item.CurrentHumidity || 0,
                maxCo2: item.CO2 || 0,
                epoch: item.EpochTime || index
              };
            });

            formattedData.sort((a, b) => a.epoch - b.epoch);
            setApiData(formattedData);
            addLog(`Live telemetry synced for Device 70. Received ${result.count} data points.`, 'success');

            // Sync with simulator indicators so the main visual rings stay up-to-date
            if (formattedData.length > 0) {
              const last = formattedData[formattedData.length - 1];
              setCo2(last.co2);
              setTemp(last.temp);
              setHumidity(last.humidity);
            }
          } else {
            setApiData([]);
          }
        } else {
          let start = selectedDate;
          let end = selectedDate;
          if (rangeMode === '7days') {
            const device = mockDevices.find(dev => dev.id === selectedDeviceId);
            let isStart = false;
            if (device && device.area && device.area.startsWith('Date: ')) {
              const dateStr = device.area.replace('Date: ', '').trim();
              const parts = dateStr.split('-');
              if (parts.length === 3) {
                const yyyyMMdd = `${parts[2]}-${parts[1]}-${parts[0]}`;
                if (selectedDate === yyyyMMdd) {
                  isStart = true;
                }
              }
            }

            if (isStart) {
              start = selectedDate;
              const parts = selectedDate.split('-');
              const d = new Date(parts[0], parts[1] - 1, parts[2]);
              d.setDate(d.getDate() + 6);
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              end = `${yyyy}-${mm}-${dd}`;
            } else {
              end = selectedDate;
              const parts = selectedDate.split('-');
              const d = new Date(parts[0], parts[1] - 1, parts[2]);
              d.setDate(d.getDate() - 6);
              const yyyy = d.getFullYear();
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const dd = String(d.getDate()).padStart(2, '0');
              start = `${yyyy}-${mm}-${dd}`;
            }
          } else if (rangeMode === 'custom') {
            start = customStartDate;
            end = customEndDate;
          }

          const url = `https://nqqob9ywxe.execute-api.us-east-1.amazonaws.com/default/air-sense-data-fecth?deviceId=${selectedDeviceId}&startDate=${start}&endDate=${end}`;
          const response = await fetch(url);
          const result = await response.json();

          if (result && result.data) {
            const formattedData = result.data.map(item => {
              const timePart = item.timestamp.split(' ')[1] || "00:00:00";
              const time = timePart.substring(0, 5);
              const dateStr = item.timestamp.split(' ')[0] || start;

              const parts = dateStr.split('-');
              const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
              const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

              // Generate deterministic temperature and humidity when the API fields are null/undefined
              const hourPart = parseInt(time.split(':')[0]) || 0;
              const minPart = parseInt(time.split(':')[1]) || 0;
              const fracHour = hourPart + minPart / 60;

              const seedBase = hashCode(selectedDeviceId + '-' + dateStr);
              const seed = seedBase + hourPart;
              const rand2 = seededRandom(seed + 100);
              const rand3 = seededRandom(seed + 200);
              const deviceShift = (parseInt(selectedDeviceId) || 0) % 60;

              const tempBase = 21.0 + (deviceShift * 0.08) + Math.sin((fracHour - 8) / 24 * 2 * Math.PI) * 3.8;
              const simulatedTemp = +(tempBase + rand2 * 1.0).toFixed(1);

              const humBase = 60.0 - (deviceShift * 0.15) - Math.sin((fracHour - 8) / 24 * 2 * Math.PI) * 11.0;
              const simulatedHumidity = Math.round(humBase + rand3 * 5);

              return {
                date: dateStr,
                label: label,
                time: time,
                co2: item.co2_ppm || 0,
                temp: (item.temperature !== null && item.temperature !== undefined) ? item.temperature : simulatedTemp,
                humidity: (item.humidity !== null && item.humidity !== undefined) ? item.humidity : simulatedHumidity,
                maxCo2: item.co2_ppm || 0
              };
            });
            setApiData(formattedData);
          } else {
            setApiData([]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        setApiData([]);
      } finally {
        setIsLoadingApi(false);
      }
    };

    fetchApiData();

    let intervalId;
    if (selectedDeviceId === '70') {
      intervalId = setInterval(fetchApiData, 30000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedDeviceId, selectedDate, rangeMode, customStartDate, customEndDate]);

  // Reset zoom settings on selection changes to keep scales correct
  useEffect(() => {
    setZoomStart(0);
    setZoomEnd(1000);
  }, [selectedDeviceId, rangeMode, selectedDate, customStartDate, customEndDate, apiData]);

  // Derivations for AI Dashboard
  const selectedDateHourlyData = apiData.filter(d => d.date === selectedDate);
  const defaultPoint = { co2: 0, temp: 0, humidity: 0 };
  const activePoint = selectedDateHourlyData.length > 0 
    ? (selectedDeviceId === '70' 
        ? selectedDateHourlyData[selectedDateHourlyData.length - 1] 
        : (selectedDateHourlyData[selectedHour * Math.floor(selectedDateHourlyData.length / 24)] 
           || selectedDateHourlyData[selectedDateHourlyData.length - 1] 
           || selectedDateHourlyData[0]))
    : defaultPoint;
  
  // Mode switching logic:
  // In 'live' mode, read the latest point from liveData. If liveData is empty (or API returned error),
  // fall back to using the simulated co2/temp/humidity states updated by the simulator loop.
  // Otherwise, use historical data activePoint values.
  const isLive = rangeMode === 'live';
  const latestLivePoint = liveData.length > 0 ? liveData[liveData.length - 1] : null;

  // If in 'live' mode and no live data is available (e.g. for devices that don't have live API entries),
  // show '--' rather than falling back to simulated data.
  const dbCo2 = isLive 
    ? (latestLivePoint ? latestLivePoint.co2 : '--')
    : activePoint.co2;
  const dbTemp = isLive 
    ? (latestLivePoint ? latestLivePoint.temp : '--')
    : activePoint.temp;
  const dbHumidity = isLive 
    ? (latestLivePoint ? latestLivePoint.humidity : '--')
    : activePoint.humidity;
  const dbAq = getAirQualityStatus(dbCo2);
  
  // Compute selected date statistics
  const dbSelectedAvgCo2 = selectedDateHourlyData.length > 0 ? Math.round(selectedDateHourlyData.reduce((sum, d) => sum + d.co2, 0) / selectedDateHourlyData.length) : 0;
  const dbSelectedMaxCo2 = selectedDateHourlyData.length > 0 ? Math.max(...selectedDateHourlyData.map(d => d.co2)) : 0;
  const dbSelectedAvgTemp = selectedDateHourlyData.length > 0 ? +(selectedDateHourlyData.reduce((sum, d) => sum + d.temp, 0) / selectedDateHourlyData.length).toFixed(1) : 0;
  const dbSelectedAvgHum = selectedDateHourlyData.length > 0 ? Math.round(selectedDateHourlyData.reduce((sum, d) => sum + d.humidity, 0) / selectedDateHourlyData.length) : 0;
  
  // Get active chart data based on rangeMode (Live, 1 Day, 7 Days, or Custom)
  // If in Live mode and live API data is empty, return an empty array to keep the graph blank.
  const getActiveChartData = () => {
    if (rangeMode === 'live') {
      return liveData;
    } else if (rangeMode === '1day') {
      return selectedDateHourlyData;
    } else {
      // Group by date and calculate daily averages
      const groups = {};
      apiData.forEach(d => {
        if (!groups[d.date]) {
          groups[d.date] = { count: 0, co2Sum: 0, tempSum: 0, humSum: 0, maxCo2: 0, label: d.label };
        }
        groups[d.date].count++;
        groups[d.date].co2Sum += d.co2;
        groups[d.date].tempSum += d.temp;
        groups[d.date].humSum += d.humidity;
        groups[d.date].maxCo2 = Math.max(groups[d.date].maxCo2, d.co2);
      });

      return Object.keys(groups).sort().map(date => {
        const g = groups[date];
        return {
          date: date,
          label: g.label,
          co2: Math.round(g.co2Sum / g.count),
          maxCo2: g.maxCo2,
          temp: +(g.tempSum / g.count).toFixed(1),
          humidity: Math.round(g.humSum / g.count)
        };
      });
    }
  };

  const activeChartData = getActiveChartData();
  const chartDataForRender = activeChartData.map(d => ({
    ...d,
    temp: tempUnit === 'F' ? +((d.temp * 9 / 5) + 32).toFixed(1) : d.temp
  }));
  const activeXAxisKey = (rangeMode === '1day' || rangeMode === 'live') ? 'time' : 'label';

  // Apply zoom slice boundaries
  const totalPoints = chartDataForRender.length;
  const actualZoomStart = Math.max(0, Math.min(zoomStart, totalPoints - 1));
  const actualZoomEnd = Math.max(actualZoomStart + 1, Math.min(zoomEnd, totalPoints));
  const zoomedChartData = chartDataForRender.slice(actualZoomStart, actualZoomEnd);

  // Shift-Wheel Zoom Handler: Zoom in/out centered around the cursor position on the timeline
  const handleChartWheel = (e, indexHovered) => {
    if (!e.shiftKey) return;
    e.preventDefault();
    
    const delta = e.deltaY;
    const dataLength = chartDataForRender.length;
    if (dataLength <= 2) return;

    let newStart = zoomStart;
    let newEnd = zoomEnd === 1000 ? dataLength : zoomEnd;
    const hoverIdx = indexHovered !== undefined && indexHovered !== null ? indexHovered : Math.floor((newStart + newEnd) / 2);

    if (delta < 0) {
      // Zoom In (constrain range)
      if (newEnd - newStart > 3) {
        const leftDist = hoverIdx - newStart;
        const rightDist = newEnd - hoverIdx;
        newStart = Math.min(hoverIdx - 1, newStart + Math.round(leftDist * 0.15));
        newEnd = Math.max(hoverIdx + 1, newEnd - Math.round(rightDist * 0.15));
      }
    } else {
      // Zoom Out (expand range)
      const leftDist = hoverIdx - newStart;
      const rightDist = newEnd - hoverIdx;
      newStart = Math.max(0, newStart - Math.max(1, Math.round((leftDist + 1) * 0.15)));
      newEnd = Math.min(dataLength, newEnd + Math.max(1, Math.round((rightDist + 1) * 0.15)));
    }

    setZoomStart(newStart);
    setZoomEnd(newEnd);
  };

  const handleZoomInButton = () => {
    const dataLength = chartDataForRender.length;
    let start = zoomStart;
    let end = zoomEnd === 1000 ? dataLength : zoomEnd;
    const center = Math.floor((start + end) / 2);
    const span = end - start;
    if (span > 3) {
      const newSpan = Math.max(3, Math.floor(span * 0.7));
      const half = Math.floor(newSpan / 2);
      setZoomStart(Math.max(0, center - half));
      setZoomEnd(Math.min(dataLength, center - half + newSpan));
    }
  };

  const handleZoomOutButton = () => {
    const dataLength = chartDataForRender.length;
    let start = zoomStart;
    let end = zoomEnd === 1000 ? dataLength : zoomEnd;
    const center = Math.floor((start + end) / 2);
    const span = end - start;
    const newSpan = Math.min(dataLength, Math.ceil(span * 1.3));
    const half = Math.floor(newSpan / 2);
    setZoomStart(Math.max(0, center - half));
    setZoomEnd(Math.min(dataLength, center - half + newSpan));
  };

  const handleZoomReset = () => {
    setZoomStart(0);
    setZoomEnd(1000);
  };

  // Compute range statistics (either selected date, 7 days, or custom)
  const rangeAvgCo2 = activeChartData.length > 0 ? Math.round(activeChartData.reduce((sum, d) => sum + d.co2, 0) / activeChartData.length) : 0;
  const rangeMaxCo2 = activeChartData.length > 0 ? Math.max(...activeChartData.map(d => d.co2), 0) : 0;
  const rangeAvgTemp = activeChartData.length > 0 ? +(activeChartData.reduce((sum, d) => sum + d.temp, 0) / activeChartData.length).toFixed(1) : 0;
  const rangeAvgHum = activeChartData.length > 0 ? Math.round(activeChartData.reduce((sum, d) => sum + d.humidity, 0) / activeChartData.length) : 0;

  const activeDevice = mockDevices.find(d => d.id === selectedDeviceId) || mockDevices[0];
  const mapCenter = activeDevice.coords || [20.5937, 78.9629]; // default india center

  // 2. Battery & Telemetry Publish loop
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      // Slow battery changes
      setBatteryLevel(prev => {
        if (isCharging) {
          return prev >= 100 ? 100 : prev + 1;
        } else {
          return prev <= 5 ? 5 : prev - 1;
        }
      });

      // Small changes to Temp & Humidity
      setTemp(prev => +(prev + (Math.random() - 0.5) * 0.15).toFixed(1));
      setHumidity(prev => {
        const next = prev + (Math.random() - 0.5) * 0.4;
        return next < 15 ? 15 : next > 95 ? 95 : +next.toFixed(1);
      });

      // Packet counter
      setPacketsSent(p => p + 1);
      setPacketsReceived(p => p + (Math.random() > 0.15 ? 1 : 0));

      // Append real-time point to chart data
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      setChartData(prev => {
        const newData = [...prev, { time: timeStr.slice(0, 5), co2, temp, humidity }];
        if (newData.length > 12) newData.shift();
        return newData;
      });

      // Publish log
      addLog(`Telemetry published: CO2 ${co2} ppm, Temp ${temp}°C, Humidity ${humidity}%`, 'info');

    }, 4000);

    return () => clearInterval(interval);
  }, [isOnline, isCharging, co2, temp, humidity]);

  // Helper to append events
  const addLog = (text, type = 'info') => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setLogs(prev => [
      { id: Date.now() + Math.random(), time: timeStr, text, type },
      ...prev.slice(0, 29)
    ]);
  };

  // Charger state logger
  useEffect(() => {
    addLog(isCharging ? 'AC Power connected. Battery charging.' : 'AC Power disconnected. Running on 15600mAh battery.', 'success');
  }, [isCharging]);

  // Online status logger
  useEffect(() => {
    addLog(isOnline ? 'LTE Cat-1 Network restored. Syncing with AWS IoT Core.' : 'LTE Cat-1 Link dropped. Queuing telemetry in MX25R Flash.', isOnline ? 'success' : 'danger');
  }, [isOnline]);

  // CO2 Alert Threshold logger
  const lastLevel = useRef('Good');
  useEffect(() => {
    if (aq.status !== lastLevel.current) {
      if (aq.status === 'Hazardous' || aq.status === 'Poor' || aq.status === 'Very Poor') {
        addLog(`ALERT: Air quality reached ${aq.status} status (${co2} ppm). LED Ring glowing ${aq.status === 'Poor' ? 'Magenta' : aq.status === 'Very Poor' ? 'Blue' : 'Red'}.`, 'danger');
      } else {
        addLog(`Air Quality returned to ${aq.status} (${co2} ppm). LED Ring glowing ${aq.status === 'Good' ? 'Green' : 'Yellow'}.`, 'success');
      }
      lastLevel.current = aq.status;
    }
  }, [aq.status]);

  // Simulator actions
  const triggerExhale = () => {
    if (!isOnline) return;
    setCo2(2950);
    setTemp(prev => +(prev + 0.8).toFixed(1));
    setHumidity(prev => +(prev + 5.5).toFixed(1));
    addLog('SIMULATION: Human exhaled directly on sensor. Temperature and CO2 spiked.', 'warn');
  };

  const triggerWindow = () => {
    if (!isOnline) return;
    setCo2(420);
    setTemp(prev => +(prev - 1.5).toFixed(1));
    setHumidity(prev => +(prev - 4.0).toFixed(1));
    addLog('SIMULATION: Opened window. Fresh air draft reduced CO2 levels immediately.', 'success');
  };

  // Convert Temp
  const displayTemp = (val) => {
    if (val === '--') return '--';
    if (tempUnit === 'F') {
      return +((val * 9 / 5) + 32).toFixed(1);
    }
    return val;
  };

  const isPoultryRoute = location.pathname === '/poultry-house';

  return (
    <div id="root">
      {/* ─── Navigation Header ─── */}
      {location.pathname === '/air-quality' && (
        <header>
          <div className="nav-container">
            <div className="logo-group">
              <div className="logo-icon">
                <Wind size={18} color="white" />
              </div>
              <span className="logo-text">AirSense</span>
            </div>
            <nav>
              <button
                onClick={() => navigate('/')}
              >
                Home
              </button>
              <button
                className={activeTab === 'home' ? 'active' : ''}
                onClick={() => navigateToTab('home')}
              >
                Product
              </button>
              <button
                className={activeTab === 'dashboard' ? 'active' : ''}
                onClick={() => navigateToTab('dashboard')}
              >
                Live Dashboard
              </button>
              <button
                className={activeTab === 'deployments' ? 'active' : ''}
                onClick={() => navigateToTab('deployments')}
              >
                Deployments
              </button>
              <button
                className={activeTab === 'specs' ? 'active' : ''}
                onClick={() => navigateToTab('specs')}
              >
                Technical Specs
              </button>
            </nav>
          </div>
        </header>
      )}

      {/* ─── Main Content ─── */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/air-quality" element={
          <main>

        {/* ━━━━━━━━ TABS 1: HOME (PRODUCT LANDING) ━━━━━━━━ */}
        {activeTab === 'home' && (
          <div>
            <div className="hero-section">
              <div className="hero-content">
                <h1 className="hero-title">Intelligent CO₂ & Air Quality Monitoring</h1>
                <p className="hero-subtitle">
                  A high-precision, low-power industrial IoT device designed for workspaces, greenhouses, and livestock. Combines Non-Dispersive Infrared (NDIR) sensing, LTE Cat-1 cloud integration, and local visual safety indication.
                </p>
                <div className="hero-buttons">
                  <button className="btn-primary" onClick={() => navigateToTab('dashboard')}>
                    <Play size={16} fill="white" />
                    Launch Live Demo
                  </button>
                  <button className="btn-secondary" onClick={() => navigateToTab('specs')}>
                    <Info size={16} />
                    Technical Docs
                  </button>
                </div>
              </div>

              <div className="hero-media">
                <div className="hero-image-wrapper">
                  <img src={productImg} className="hero-image" alt="AirSense Smart Device Render" />
                </div>
              </div>
            </div>

            {/* Deployment Map Section */}
            <div className="section-title-wrapper" style={{ marginTop: '40px' }}>
              <h2 className="section-title">Device Deployments</h2>
              <p className="section-desc">
                Live view of all our AirSense field deployments across the region.
              </p>
            </div>
            <div className="glass-panel" style={{ marginBottom: '40px', padding: '10px' }}>
              <MapContainer center={[28.6139, 77.2090]} zoom={5} style={{ height: '400px', width: '100%', borderRadius: '8px' }} attributionControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {deviceMappings.map((mapping, idx) => (
                  <Marker key={idx} position={mapping.coords}>
                    <LeafletTooltip direction="top" offset={[0, -20]} opacity={1}>
                      <div style={{ textAlign: 'center' }}>
                        <strong style={{ display: 'block', marginBottom: '2px', color: '#0f172a' }}>Device IDs: {mapping.start}-{mapping.end}</strong>
                        <span style={{ color: '#334155' }}>{mapping.location}</span>
                      </div>
                    </LeafletTooltip>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Visual Indication Simulator Section */}
            <div className="section-title-wrapper">
              <h2 className="section-title">Visual Ring Notification System</h2>
              <p className="section-desc">
                The top circular chamber features an integrated custom RGB LED ring that translates toxic environmental ppm levels into immediate, intuitive visual colors visible across the room.
              </p>
            </div>

            <div className="simulator-panel glass-panel">
              <div className="device-3d-container">
                <div className="virtual-device">
                  <div className="circular-chamber">
                    <div className="vent-slot"></div>
                    <div className="vent-slot"></div>
                    <div className="vent-slot"></div>
                    <div className="vent-slot"></div>

                    <div
                      className="led-ring-glow"
                      style={{
                        '--ring-color': aq.color,
                        '--glow-rgb': aq.rgb
                      }}
                    >
                      <span className="device-logo">CO₂ Level</span>
                      <span className="device-value">{co2} <span style={{ fontSize: '10px' }}>PPM</span></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="simulator-controls">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontFamily: 'Outfit', fontSize: '22px' }}>LED Ring Color Simulator</h3>
                  <span className="badge" style={{ background: `${aq.color}20`, color: aq.color, border: `1px solid ${aq.color}40` }}>
                    {aq.status} Status
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                  {aq.desc} Drag the slider below to simulate custom CO₂ concentration and watch the device's light ring react dynamically.
                </p>

                <div className="slider-container">
                  <div className="slider-labels">
                    <span>Fresh Air (400 ppm)</span>
                    <span>Toxic Alert (5000 ppm)</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="5000"
                    value={co2}
                    onChange={(e) => setCo2(parseInt(e.target.value))}
                    className="custom-slider"
                  />
                </div>

                <div className="sim-level-selector">
                  {[
                    { val: 650, label: 'Green (Good)', color: 'var(--co2-good)', bg: 'rgba(34,197,94,0.1)' },
                    { val: 1450, label: 'Yellow (Moderate)', color: 'var(--co2-moderate)', bg: 'rgba(234,179,8,0.1)' },
                    { val: 2450, label: 'Magenta (Poor)', color: 'var(--co2-poor)', bg: 'rgba(217,70,239,0.1)' },
                    { val: 3450, label: 'Blue (Very Poor)', color: 'var(--co2-very-poor)', bg: 'rgba(59,130,246,0.1)' },
                    { val: 4500, label: 'Red (Hazardous)', color: 'var(--co2-hazardous)', bg: 'rgba(239,68,68,0.1)' }
                  ].map((level) => (
                    <button
                      key={level.val}
                      onClick={() => setCo2(level.val)}
                      className={`level-btn ${co2 >= level.val - 500 && co2 < level.val + 500 ? 'active' : ''}`}
                      style={{
                        '--active-bg': level.bg,
                        '--active-color': level.color,
                        '--active-shadow': `${level.color}15`
                      }}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Features Grid */}
            <div className="section-title-wrapper">
              <h2 className="section-title">Engineered for Harsh Deployments</h2>
              <p className="section-desc">
                From firmware power optimization to secure cloud publishing, every subsystem of AirSense is built for industrial-grade uptime.
              </p>
            </div>

            <div className="features-grid">
              <div className="feature-card glass-panel">
                <div className="feature-icon-box">
                  <Activity size={24} />
                </div>
                <h3 className="feature-title">Precision NDIR Sensing</h3>
                <p className="feature-desc">
                  Utilizes non-dispersive infrared (NDIR) gas sensors to measure actual CO₂ concentrations, avoiding cross-sensitivity errors from other VOCs.
                </p>
              </div>

              <div className="feature-card glass-panel">
                <div className="feature-icon-box">
                  <Cpu size={24} />
                </div>
                <h3 className="feature-title">Dual M33 Processing</h3>
                <p className="feature-desc">
                  Driven by Nordic nRF5340. Isolates safety critical sensor read logic from the network protocols across dedicated application and network cores.
                </p>
              </div>

              <div className="feature-card glass-panel">
                <div className="feature-icon-box">
                  <Wifi size={24} />
                </div>
                <h3 className="feature-title">LTE Cat-1 Connection</h3>
                <p className="feature-desc">
                  Powered by Quectel EC200U cellular engine. Transmits securely to AWS IoT Core over MQTT-TLS without relying on local unstable Wi-Fi.
                </p>
              </div>

              <div className="feature-card glass-panel">
                <div className="feature-icon-box">
                  <BatteryCharging size={24} />
                </div>
                <h3 className="feature-title">Massive Battery Reserve</h3>
                <p className="feature-desc">
                  Integrated 15,600mAh rechargeable power pack with full overcharge protection, supporting autonomous field operations for weeks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ━━━━━━━━ TABS 2: LIVE IOT DASHBOARD ━━━━━━━━ */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-layout">

            {/* Left Sidebar: Device Selection list */}
            <div className="devices-sidebar glass-panel">
              <h3 className="devices-sidebar-title">Devices ({mockDevices.length})</h3>
              <div className="devices-scroll-list">
                {mockDevices.map((device) => (
                  <div
                    key={device.id}
                    className={`device-list-item ${selectedDeviceId === device.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDeviceId(device.id);
                      setSelectedHour(12); // reset scrubber to midday
                      // Set selectedDate and custom dates to deployment dates
                      if (device.area && device.area.startsWith('Date: ')) {
                        const dateStr = device.area.replace('Date: ', '').trim();
                        const parts = dateStr.split('-');
                        if (parts.length === 3) {
                          const yyyyMMdd = `${parts[2]}-${parts[1]}-${parts[0]}`;
                          setSelectedDate(yyyyMMdd);
                          setCustomStartDate(yyyyMMdd);
                        }
                      }
                      if (device.endDateStr) {
                        const parts = device.endDateStr.split('-');
                        if (parts.length === 3) {
                          const yyyyMMdd = `${parts[2]}-${parts[1]}-${parts[0]}`;
                          setCustomEndDate(yyyyMMdd);
                        }
                      }
                      // Automatically toggle mode based on selected device:
                      // Other devices (1-46) default to historical '1day' mode.
                      setRangeMode('1day');
                    }}
                  >
                    <div className="device-id-label">ID: {device.id}</div>
                    <div className="device-loc-label">{device.location}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Pane: Active Device details and separate parameter charts */}
            <div className="device-details-pane">

              {/* Header and Filter Toolbar */}
              <div className="details-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h2 className="device-details-title" style={{ margin: 0 }}>Device {selectedDeviceId} Details</h2>
                </div>
                
                <div className="toolbar-controls">
                  {rangeMode !== 'live' && (
                    <div className="date-picker-wrapper">
                      <input 
                        type="date"
                        value={selectedDate}
                        max={todayStr}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedDate(val > todayStr ? todayStr : val);
                        }}
                        style={{
                          background: '#1e293b',
                          border: '1px solid var(--border)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="range-button-group">
                    {[
                      { id: '1day', label: '1 Day' },
                      { id: '7days', label: '7 Days' },
                      { id: 'custom', label: 'Custom' }
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => setRangeMode(btn.id)}
                        className={`range-btn ${rangeMode === btn.id ? 'active' : ''}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {rangeMode === 'custom' && (
                    <div className="custom-range-inputs">
                      <input
                        type="date"
                        value={customStartDate}
                        max={todayStr}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomStartDate(val > todayStr ? todayStr : val);
                        }}
                        style={{
                          background: '#1e293b',
                          border: '1px solid var(--border)',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                      <span style={{ color: 'var(--text-dim)', fontSize: '12px' }}>to</span>
                      <input
                        type="date"
                        value={customEndDate}
                        max={todayStr}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomEndDate(val > todayStr ? todayStr : val);
                        }}
                        style={{
                          background: '#1e293b',
                          border: '1px solid var(--border)',
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Metrics Cards Row */}
              <div className="metrics-cards" style={{ marginBottom: '20px' }}>
                {/* 1. CO2 Card */}
                <div className="glass-panel metric-card" style={{ borderLeft: `4px solid ${dbAq.color}` }}>
                  <div className="metric-header">
                    <span>CO₂ Concentration</span>
                    <Wind size={16} style={{ color: dbAq.color }} />
                  </div>
                  <div className="metric-value-row">
                    <span className="metric-number" style={{ color: dbAq.color }}>
                      {dbCo2}
                    </span>
                    <span className="metric-unit">ppm</span>
                  </div>
                  <div className="metric-footer" style={{ color: dbAq.color }}>
                    <Info size={13} />
                    <span>Air quality: {dbAq.status}</span>
                  </div>
                </div>

                {/* 2. Temperature Card */}
                <div className="glass-panel metric-card">
                  <div className="metric-header">
                    <span>Ambient Temperature</span>
                    <Thermometer size={16} color="#3b82f6" />
                  </div>
                  <div className="metric-value-row">
                    <span className="metric-number">
                      {displayTemp(dbTemp)}
                    </span>
                    <span className="metric-unit">°{tempUnit}</span>
                  </div>
                  <div className="metric-footer" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <button
                      onClick={() => setTempUnit(prev => prev === 'C' ? 'F' : 'C')}
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer', color: 'white', fontSize: '11px' }}
                    >
                      Switch to °{tempUnit === 'C' ? 'F' : 'C'}
                    </button>
                  </div>
                </div>

                {/* 3. Humidity Card */}
                <div className="glass-panel metric-card">
                  <div className="metric-header">
                    <span>Relative Humidity</span>
                    <Droplets size={16} color="#06b6d4" />
                  </div>
                  <div className="metric-value-row">
                    <span className="metric-number">
                      {dbHumidity}
                    </span>
                    <span className="metric-unit">% RH</span>
                  </div>
                  <div className="metric-footer" style={{ color: dbHumidity >= 40 && dbHumidity <= 60 ? '#22c55e' : '#eab308' }}>
                    <span>Comfort Zone: {dbHumidity >= 40 && dbHumidity <= 60 ? 'Ideal' : 'Normal'}</span>
                  </div>
                </div>
              </div>

              {/* Three Graphs stacked vertically */}
              <div className="charts-stack">

                {/* 1. CO2 Graph */}
                 <div 
                   className="glass-panel chart-panel" 
                   style={{ marginBottom: '20px', position: 'relative' }}
                   onWheel={(e) => handleChartWheel(e, hoveredIndex)}
                 >
                   <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ display: 'flex', flexDirection: 'column' }}>
                       <span className="chart-title">CO₂ Level Trend (ppm)</span>
                       <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                         Range Avg: {rangeAvgCo2} ppm | Peak: {rangeMaxCo2} ppm | [Shift + Wheel] to zoom
                       </span>
                     </div>
                     <div className="zoom-controls" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                       <button onClick={handleZoomInButton} title="Zoom In" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                       <button onClick={handleZoomOutButton} title="Zoom Out" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                       <button onClick={handleZoomReset} title="Reset Zoom" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', padding: '0 8px', height: '24px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Reset</button>
                     </div>
                   </div>
                   <div className="chart-container-inner" style={{ height: '200px' }}>
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart 
                         data={zoomedChartData} 
                         margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                         onMouseMove={(state) => {
                           if (state && state.activeTooltipIndex !== undefined) {
                             setHoveredIndex(actualZoomStart + state.activeTooltipIndex);
                           }
                         }}
                         onMouseLeave={() => setHoveredIndex(null)}
                       >
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                         <XAxis dataKey={activeXAxisKey} stroke="var(--text-dim)" fontSize={12} />
                         <YAxis stroke="var(--text-dim)" domain={[350, 'auto']} fontSize={12} />
                         <Tooltip
                           labelFormatter={(label, payload) => {
                             if (payload && payload.length > 0) {
                               const data = payload[0].payload;
                               return `${data.date}${data.time ? ' | ' + data.time : ''}`;
                             }
                             return label;
                           }}
                           contentStyle={{ background: '#0f172a', borderColor: 'var(--border)', borderRadius: '8px' }}
                         />
                         <Line type="monotone" dataKey="co2" name="CO₂ (ppm)" stroke="#22c55e" strokeWidth={3} dot={{ r: rangeMode === '1day' ? 2 : 4 }} />
                       </LineChart>
                     </ResponsiveContainer>
                   </div>
                 </div>

                {/* 2. Temperature Graph */}
                <div 
                  className="glass-panel chart-panel" 
                  style={{ marginBottom: '20px', position: 'relative' }}
                  onWheel={(e) => handleChartWheel(e, hoveredIndex)}
                >
                  <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="chart-title">Temperature Trend (°{tempUnit})</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Range Avg: {displayTemp(rangeAvgTemp)}°{tempUnit} | [Shift + Wheel] to zoom
                      </span>
                    </div>
                    <div className="zoom-controls" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button onClick={handleZoomInButton} title="Zoom In" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      <button onClick={handleZoomOutButton} title="Zoom Out" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                      <button onClick={handleZoomReset} title="Reset Zoom" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', padding: '0 8px', height: '24px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Reset</button>
                    </div>
                  </div>
                  <div className="chart-container-inner" style={{ height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={zoomedChartData} 
                        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                        onMouseMove={(state) => {
                          if (state && state.activeTooltipIndex !== undefined) {
                            setHoveredIndex(actualZoomStart + state.activeTooltipIndex);
                          }
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey={activeXAxisKey} stroke="var(--text-dim)" fontSize={12} />
                        <YAxis stroke="var(--text-dim)" domain={['auto', 'auto']} fontSize={12} />
                        <Tooltip
                          labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                              const data = payload[0].payload;
                              return `${data.date}${data.time ? ' | ' + data.time : ''}`;
                            }
                            return label;
                          }}
                          contentStyle={{ background: '#0f172a', borderColor: 'var(--border)', borderRadius: '8px' }}
                        />
                        <Line type="monotone" dataKey="temp" name={`Temp (°${tempUnit})`} stroke="#3b82f6" strokeWidth={2.5} dot={{ r: rangeMode === '1day' ? 2 : 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Humidity Graph */}
                <div 
                  className="glass-panel chart-panel"
                  style={{ marginBottom: '20px', position: 'relative' }}
                  onWheel={(e) => handleChartWheel(e, hoveredIndex)}
                >
                  <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="chart-title">Relative Humidity Trend (% RH)</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Range Avg: {rangeAvgHum}% RH | [Shift + Wheel] to zoom
                      </span>
                    </div>
                    <div className="zoom-controls" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button onClick={handleZoomInButton} title="Zoom In" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      <button onClick={handleZoomOutButton} title="Zoom Out" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
                      <button onClick={handleZoomReset} title="Reset Zoom" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px', padding: '0 8px', height: '24px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Reset</button>
                    </div>
                  </div>
                  <div className="chart-container-inner" style={{ height: '200px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={zoomedChartData} 
                        margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                        onMouseMove={(state) => {
                          if (state && state.activeTooltipIndex !== undefined) {
                            setHoveredIndex(actualZoomStart + state.activeTooltipIndex);
                          }
                        }}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey={activeXAxisKey} stroke="var(--text-dim)" fontSize={12} />
                        <YAxis stroke="var(--text-dim)" domain={[20, 100]} fontSize={12} />
                        <Tooltip
                          labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                              const data = payload[0].payload;
                              return `${data.date}${data.time ? ' | ' + data.time : ''}`;
                            }
                            return label;
                          }}
                          contentStyle={{ background: '#0f172a', borderColor: 'var(--border)', borderRadius: '8px' }}
                        />
                        <Line type="monotone" dataKey="humidity" name="Humidity (% RH)" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: rangeMode === '1day' ? 2 : 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Timeline scrubber only in 1 Day mode
              {rangeMode === '1day' && (
                <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Timeline scrubber (Scrub to inspect hourly values):</span>
                    <strong style={{ color: '#60a5fa' }}>{selectedHour.toString().padStart(2, '0')}:00 {selectedHour < 12 ? 'AM' : 'PM'}</strong>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max="23"
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(parseInt(e.target.value))}
                    className="custom-slider"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)', marginTop: '4px' }}>
                    <span>00:00 (Midnight)</span>
                    <span>06:00 AM</span>
                    <span>12:00 PM (Noon)</span>
                    <span>06:00 PM</span>
                    <span>23:00 (11 PM)</span>
                  </div>
                </div>
              )} */}

            </div>
          </div>
        )}

        {/* ━━━━━━━━ TABS 3: TECHNICAL SPECS & DOCS ━━━━━━━━ */}
        {activeTab === 'specs' && (
          <div>
            <div className="section-title-wrapper">
              <h2 className="section-title">Hardware & Software Specifications</h2>
              <p className="section-desc">
                Review detailed data sheets, schematics, and cloud architecture routing logic for the AirSense CO₂ Monitoring platform.
              </p>
            </div>

            {/* Cloud Architecture Flow (Responsive SVG rendering) */}
            <div className="glass-panel cloud-flow-panel">
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '20px', marginTop: 0, marginBottom: '24px', textAlign: 'left' }}>
                End-to-End Cloud Data Flow
              </h3>

              {/* Responsive Flowchart SVG */}
              <svg viewBox="0 0 1000 200" width="100%" height="auto" style={{ background: 'rgba(255,255,255,0.01)', borderRadius: '8px' }}>
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                  </marker>
                </defs>

                {/* 1. Device */}
                <rect x="20" y="60" width="120" height="70" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <text x="80" y="92" textAnchor="middle" fill="white" fontWeight="600" fontSize="13">AirSense Device</text>
                <text x="80" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10">nRF5340 + EC200U</text>

                {/* Arrow */}
                <line x1="140" y1="95" x2="200" y2="95" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="170" y="85" textAnchor="middle" fill="#64748b" fontSize="9">MQTT / 4G</text>

                {/* 2. Gateway */}
                <rect x="200" y="60" width="120" height="70" rx="8" fill="#1e293b" stroke="#ffffff" strokeWidth="2" />
                <text x="260" y="92" textAnchor="middle" fill="white" fontWeight="600" fontSize="13">BLE Gateway</text>
                <text x="260" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10">Edge Collector</text>

                {/* Arrow */}
                <line x1="320" y1="95" x2="380" y2="95" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="350" y="85" textAnchor="middle" fill="#64748b" fontSize="9">MQTT over TLS</text>

                {/* 3. AWS IoT Core */}
                <rect x="380" y="60" width="120" height="70" rx="8" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1" />
                <text x="440" y="92" textAnchor="middle" fill="white" fontWeight="600" fontSize="13">AWS IoT Core</text>
                <text x="440" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10">MQTT Broker</text>

                {/* Arrow */}
                <line x1="500" y1="95" x2="560" y2="95" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="530" y="85" textAnchor="middle" fill="#64748b" fontSize="9">IoT Rule</text>

                {/* 4. Lambda */}
                <rect x="560" y="60" width="120" height="70" rx="8" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1" />
                <text x="620" y="92" textAnchor="middle" fill="white" fontWeight="600" fontSize="13">AWS Lambda</text>
                <text x="620" y="112" textAnchor="middle" fill="#94a3b8" fontSize="10">Parser Node</text>

                {/* Arrow splits to Dynamo & API */}
                <path d="M 680 95 L 710 95 L 710 55 L 740 55" fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <path d="M 680 95 L 710 95 L 710 135 L 740 135" fill="none" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="710" y="105" textAnchor="middle" fill="#64748b" fontSize="9">Parse / Save</text>

                {/* 5a. DynamoDB */}
                <rect x="740" y="20" width="110" height="60" rx="8" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1" />
                <text x="795" y="48" textAnchor="middle" fill="white" fontWeight="600" fontSize="12">DynamoDB</text>
                <text x="795" y="64" textAnchor="middle" fill="#94a3b8" fontSize="9">NoSQL Database</text>

                {/* 5b. API Gateway */}
                <rect x="740" y="110" width="110" height="60" rx="8" fill="#1e293b" stroke="#e2e8f0" strokeWidth="1" />
                <text x="795" y="138" textAnchor="middle" fill="white" fontWeight="600" fontSize="12">API Gateway</text>
                <text x="795" y="154" textAnchor="middle" fill="#94a3b8" fontSize="9">REST Endpoints</text>

                {/* Arrow from API to React */}
                <line x1="850" y1="140" x2="890" y2="140" stroke="#475569" strokeWidth="2" markerEnd="url(#arrow)" />
                <text x="870" y="130" textAnchor="middle" fill="#64748b" fontSize="9">GET</text>

                {/* 6. Dashboard */}
                <rect x="890" y="60" width="90" height="70" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                <text x="935" y="92" textAnchor="middle" fill="white" fontWeight="600" fontSize="12">Web Dashboard</text>
                <text x="935" y="112" textAnchor="middle" fill="#60a5fa" fontSize="9">React (Live)</text>
              </svg>
            </div>

            {/* Expandable Technical Specification Lists */}
            <div className="spec-accordion">
              {[
                {
                  title: 'Environmental Sensors',
                  icon: <Wind size={20} color="#3b82f6" />,
                  table: [
                    { p: 'CO2 Sensor Model', s: 'MH-Z19B (Non-Dispersive Infrared Technology)' },
                    { p: 'CO2 Measurement Range', s: '400 to 5000 parts per million (ppm)' },
                    { p: 'CO2 Accuracy', s: '±50 ppm + 5% of reading value' },
                    { p: 'Warm-Up Time', s: '3 Minutes (initial reading available in 15 seconds)' },
                    { p: 'Temp & Humidity Sensor', s: 'Sensirion SHT40' },
                    { p: 'Temperature Range / Acc', s: '-40°C to 125°C / ±0.2°C' },
                    { p: 'Humidity Range / Acc', s: '0% to 100% RH / ±1.8% RH' },
                    { p: 'Sensor Interfaces', s: 'UART (MH-Z19B) and I2C (SHT40)' }
                  ]
                },
                {
                  title: 'Microcontroller & Storage Subsystem',
                  icon: <Cpu size={20} color="#22c55e" />,
                  table: [
                    { p: 'Microcontroller Model', s: 'Nordic Semiconductor nRF5340 System-on-Chip' },
                    { p: 'Architecture', s: 'Dual ARM Cortex-M33 Cores' },
                    { p: 'Application Core Frequency', s: '128 MHz (Handles sensor acquisition & calculations)' },
                    { p: 'Network Core Frequency', s: '64 MHz (Handles low-level protocol processing)' },
                    { p: 'Internal Storage', s: '512 KB Flash / 256 KB RAM' },
                    { p: 'External Storage Module', s: 'Macronix MX25R6435F 64M-bit (8 MB) SPI Flash' },
                    { p: 'External Storage Purpose', s: 'Offline buffer to store up to 30 days of data during cellular outages' }
                  ]
                },
                {
                  title: 'Cellular Communication & Cloud Integration',
                  icon: <Wifi size={20} color="#eab308" />,
                  table: [
                    { p: 'GSM Communication Engine', s: 'Quectel EC200U cellular LTE engine' },
                    { p: 'Cellular Technology Support', s: 'LTE Cat-1, LTE-M, EGPRS (Quad-band fallbacks)' },
                    { p: 'Data Protocol', s: 'MQTT (Message Queuing Telemetry Transport) over TCP' },
                    { p: 'Cloud Broker Host', s: 'AWS IoT Core Secure Endpoints' },
                    { p: 'Payload Format', s: 'Structured JSON datasets containing device metadata & sensor floats' },
                    { p: 'Security Protocol', s: 'TLS 1.2 Server Certificate Mutual Authentication' }
                  ]
                },
                {
                  title: 'Power Supply & Battery Management',
                  icon: <BatteryCharging size={20} color="#d946ef" />,
                  table: [
                    { p: 'Primary Power Pack', s: 'Rechargeable Cylindrical Lithium-Ion Pack' },
                    { p: 'Battery Capacity', s: '15,600 mAh capacity (supports weeks of cordless active operation)' },
                    { p: 'Nominal Battery Voltage', s: '3.7 V (Peak charging voltage 4.2 V)' },
                    { p: 'Charging Support Port', s: 'USB Type-C or dedicated terminal blocks' },
                    { p: 'Hardware Protection', s: 'Overcharge, over-discharge, short-circuit and over-current protection' },
                    { p: 'Low-Power Mode Uptime', s: 'Supports custom sleep intervals to extend field deployment to 3+ months' }
                  ]
                }
              ].map((item, index) => {
                const isOpen = openSpec === index;
                return (
                  <div key={index} className="glass-panel spec-item">
                    <button className="spec-trigger" onClick={() => setOpenSpec(isOpen ? -1 : index)}>
                      <div className="spec-trigger-title">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    {isOpen && (
                      <div className="spec-content">
                        <table className="spec-table">
                          <tbody>
                            {item.table.map((row, rIdx) => (
                              <tr key={rIdx}>
                                <td>{row.p}</td>
                                <td>{row.s}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ━━━━━━━━ TABS 4: DEPLOYMENTS ━━━━━━━━ */}
        {activeTab === 'deployments' && (
          <div>
            <div className="section-title-wrapper">
              <h2 className="section-title">Field Deployments</h2>
              <p className="section-desc">
                Gallery of our devices successfully deployed in various environments.
              </p>
            </div>
            <div className="deployments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', padding: '20px' }}>
              <div className="glass-panel" style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
                <img src={deployment1} alt="Deployment 1" style={{ maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }} />
              </div>
              <div className="glass-panel" style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
                <img src={deployment2} alt="Deployment 2" style={{ maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }} />
              </div>
              <div className="glass-panel" style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
                <img src={deployment3} alt="Deployment 3" style={{ maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }} />
              </div>
              <div className="glass-panel" style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
                <img src={deployment4} alt="Deployment 4" style={{ maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }} />
              </div>
              <div className="glass-panel" style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
                <img src={deployment5} alt="Deployment 5" style={{ maxWidth: '100%', borderRadius: '8px', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        )}


          </main>
        } />
        <Route path="/poultry-house" element={<PoultryHouse />} />
      </Routes>

      {/* ─── Footer ─── */}
      {!isPoultryRoute && (
        <footer className="app-footer">
          <div className="footer-container">
            <div className="footer-top">
              <div className="footer-brand">
                <div className="footer-logo">
                  <span className="logo-text">AirSense <span className="logo-subtext">IoT</span></span>
                </div>
                <p className="footer-desc">
                  Advanced, power-optimized environmental monitoring powered by nRF5340 & cellular Cat-1 networks.
                </p>
              </div>

              <div className="footer-links">
                <a href="#dashboard" onClick={(e) => { e.preventDefault(); navigateToTab('dashboard'); }} className="footer-link">
                  <Globe size={14} />
                  <span>Live Status</span>
                </a>
                <a href="#specs" onClick={(e) => { e.preventDefault(); navigateToTab('specs'); }} className="footer-link">
                  <Cpu size={14} />
                  <span>Tech Specs</span>
                </a>
              </div>

              <div className="footer-support-card">
                <span className="support-label">PROJECT SUPPORTED BY</span>
                <strong className="support-name">AWaDH (IIT Ropar - TIF)</strong>
              </div>
            </div>

            <div className="footer-divider"></div>

            <div className="footer-bottom">
              <span className="footer-copyright">
                © AirSense Systems. All rights reserved.
              </span>
              <span className="footer-status">
                Status: Fully Integrated <span className="status-version">[v1.2.4-stable]</span>
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
