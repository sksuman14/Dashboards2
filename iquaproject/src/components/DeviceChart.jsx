import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const DeviceChart = ({ data, dataKey, name, color, unit }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel chart-container animate-fade-in delay-4" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>No data available for the selected period.</p>
      </div>
    );
  }

  const formatXAxis = (tickItem) => {
    try {
      // The format from API is "18-10-2023 00:00:00"
      if (!tickItem) return '';
      const [datePart, timePart] = tickItem.split(' ');
      const [day, month, year] = datePart.split('-');
      return `${day}/${month} ${timePart.substring(0, 5)}`;
    } catch (e) {
      return tickItem;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--panel-bg)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--panel-border)',
          padding: '12px',
          borderRadius: '8px',
          color: 'var(--text-primary)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</p>
          <p style={{ margin: 0, fontWeight: 600, color: color }}>
            {name}: {payload[0].value} {unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel chart-container animate-fade-in delay-4">
      <div className="chart-header">
        <h3 className="chart-title">{name} Trend</h3>
      </div>
      <div style={{ width: '100%', height: 'calc(100% - 60px)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="Timestamp" 
              tickFormatter={formatXAxis} 
              stroke="var(--text-secondary)" 
              fontSize={12}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis 
              stroke="var(--text-secondary)" 
              fontSize={12}
              tickFormatter={(val) => `${val}${unit ? ' ' + unit : ''}`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              name={name}
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#color${dataKey})`} 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeviceChart;
