import React from 'react';

const PerformanceSection = () => {
  const metrics = [
    { label: 'Relay Node Sleep Current', value: '~7.3 µA' },
    { label: 'Baseline Battery Life', value: '114.18 Hrs', sub: 'using 620 mAh battery' },
    { label: 'Outdoor Comm. Reliability', value: '> 99%', sub: 'across 180–200m spans' },
    { label: 'Water Savings vs Flooding', value: '15–30%' }
  ];

  return (
    <section id="performance" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2>Performance Results & Benefits</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Field validation outcomes demonstrate extreme efficiency and reliability.
          </p>
        </div>

        <div className="grid grid-cols-4">
          {metrics.map((metric, index) => (
            <div key={index} className="card animate-fade-in" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--primary)' }}>
                {metric.value}
              </div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{metric.label}</div>
              {metric.sub && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{metric.sub}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
