import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { day: 1, waterLevel: 5, redox: -200 },
  { day: 2, waterLevel: 2, redox: -150 },
  { day: 3, waterLevel: -2, redox: 0 },
  { day: 4, waterLevel: -7, redox: 200 },
  { day: 5, waterLevel: -12, redox: 300 },
  { day: 6, waterLevel: -15, redox: 300 },
  { day: 7, waterLevel: 5, redox: -200 },
];

const DataVisualizationSection = () => {
  return (
    <section id="data-validation" className="section" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge">Field Validation</span>
            <h2>Scientific Data & Results</h2>
            <p style={{ maxWidth: '700px', margin: '0 auto' }}>
              High-fidelity telemetry proves the effectiveness of Automated AWD. The cyclic manipulation of water levels directly influences the soil's oxidation-reduction status, serving as the primary lever for massive methane mitigation.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2">
          {/* Chart 1: Water Level */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Water Level vs. Time</h4>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="day" label={{ value: 'Time (Days)', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'Water Level (cm)', angle: -90, position: 'insideLeft' }} domain={[-20, 10]} />
                  <Tooltip />
                  <ReferenceLine y={5} stroke="var(--primary)" strokeDasharray="3 3" label="Flood Baseline (+5cm)" />
                  <ReferenceLine y={-15} stroke="#ef4444" strokeDasharray="3 3" label="Safe AWD Threshold (-15cm)" />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Line type="monotone" dataKey="waterLevel" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} animationDuration={2000} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
              Illustrates the gradual depletion phase driven by evapotranspiration, reaching the critical -15 cm threshold before automated, near-instantaneous reflooding to +5 cm.
            </p>
          </motion.div>

          {/* Chart 2: Redox Potential */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 style={{ marginBottom: '1.5rem', color: '#ef4444' }}>Soil Oxygen (Redox Potential)</h4>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRedox" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="day" label={{ value: 'Time (Days)', position: 'insideBottom', offset: -10 }} />
                  <YAxis label={{ value: 'Redox Potential (mV)', angle: -90, position: 'insideLeft' }} domain={[-300, 400]} />
                  <Tooltip />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Area type="monotone" dataKey="redox" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRedox)" animationDuration={2000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p style={{ fontSize: '0.85rem', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
              Shows the cyclic shift from anaerobic conditions (-200 mV) to a highly oxygenated state (+300 mV). This spike inhibits methane-producing archaea, shutting down emissions.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DataVisualizationSection;
