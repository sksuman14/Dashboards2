import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Activity, Clock, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { format, parse, differenceInSeconds } from 'date-fns';

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

function App() {
  const [nodeId, setNodeId] = useState('');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() - 24);
    return format(d, "yyyy-MM-dd'T'HH:mm");
  });
  const [endDate, setEndDate] = useState(() => {
    return format(new Date(), "yyyy-MM-dd'T'HH:mm");
  });
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

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

  const fetchData = async () => {
    setIsLoading(true);

    const nodeIdToUse = nodeId.replace('BF', '').trim();
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();

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

    const url = `https://h6q2v0jvn0.execute-api.us-east-1.amazonaws.com/default/Gateway_Predicition_API_Function?nodeId=${nodeIdToUse}&startTime=${startTimeStamp}&endTime=${endTimeStamp}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const responseData = await response.json();
        
        if (responseData.length === 0) {
          showToast("No activities found in selected range.");
          setData([]);
        } else {
          // Filter out invalid timestamps
          const validData = responseData.filter(activity => {
            const timestampStr = String(activity.TimeStamp);
            const parsed = parse(timestampStr, 'yyyy-MM-dd HH:mm:ss', new Date());
            return !isNaN(parsed.getTime());
          });
          setData(validData);
          showToast(`Fetched ${validData.length} records successfully.`);
        }
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      showToast(`Failed to fetch: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
    let lastTimestamps = {};

    data.forEach(activity => {
      const activityLabel = activity.ActivityLabel;
      const parsed = parse(String(activity.TimeStamp), 'yyyy-MM-dd HH:mm:ss', new Date());
      const timestamp = Math.floor(parsed.getTime() / 1000);

      if (lastTimestamps[activityLabel] !== undefined) {
        const duration = timestamp - lastTimestamps[activityLabel];
        totals[activityLabel] = (totals[activityLabel] || 0) + duration;
      }
      lastTimestamps[activityLabel] = timestamp;
    });

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

    groupedActivities.forEach(group => {
      if (group.length > 0) {
        const firstTime = group[0].TimeStamp;
        const lastTime = group[group.length - 1].TimeStamp;
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
              onClick={() => setActiveTab('overview')}
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
            <button 
              onClick={() => setActiveTab('deployment')}
              className={`nav-tab ${activeTab === 'deployment' ? 'active' : ''}`}
            >
              Deployment
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
        </div>
      )}
      
      {activeTab === 'deployment' && (
        <div className="overview-container">
          <div className="glass-panel hero-panel" style={{ display: 'block' }}>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
              <AlertCircle size={28} color="#f59e0b" />
              Deployment Gallery
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} style={{ overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--glass-border)', aspectRatio: '4/3' }}>
                  <img 
                    src={`/deployment-${num}.jpeg`} 
                    alt={`Deployment ${num}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <>
      {/* Top Bar / Controls */}
      <div className="glass-panel top-bar">
        <div className="control-group">
          <label>Node ID (Cow ID)</label>
          <input 
            type="text" 
            className="control-input"
            placeholder="e.g. 120/157"
            value={nodeId}
            onChange={(e) => setNodeId(e.target.value)}
          />
        </div>
        
        <div className="control-group">
          <label>Start Date & Time</label>
          <input 
            type="datetime-local" 
            className="control-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>End Date & Time</label>
          <input 
            type="datetime-local" 
            className="control-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={fetchData} disabled={isLoading}>
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
        </div>
      </div>

      {data.length === 0 && !isLoading && (
        <div className="glass-panel empty-state" style={{ minHeight: '300px', border: '1px dashed var(--glass-border)' }}>
          <Activity size={64} style={{ color: 'var(--primary)', opacity: 0.5, marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text-main)', fontSize: '1.5rem' }}>Ready to Analyze Herd Data</h2>
          <p style={{ maxWidth: '400px', margin: '0 auto', color: 'var(--text-muted)' }}>
            Enter a valid Node ID (e.g. 120/157) and select a date range to fetch real-time behavioral insights for the specific cattle.
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
                    const lastTime = group[group.length - 1].TimeStamp;
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
