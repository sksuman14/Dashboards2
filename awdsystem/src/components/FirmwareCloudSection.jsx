import React from 'react';
import { Code, Cloud, ShieldAlert, LineChart } from 'lucide-react';

const FirmwareCloudSection = () => {
  return (
    <section className="section" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary)', color: 'white', borderRadius: '12px' }}>
                <Code size={24} />
              </div>
              <h2 style={{ margin: 0 }}>Firmware Intelligence</h2>
            </div>
            <p style={{ marginBottom: '2rem' }}>Built around deterministic state machines to automate AWD cycles efficiently.</p>
            
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
              <li style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Dynamic data fetching & learned passive scanning</li>
              <li style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Dynamic Primary Channel Scanning (DPCS)</li>
              <li style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Autonomous valve actuation</li>
            </ul>

            <div className="card" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: '#dc2626' }}>
                <ShieldAlert size={20} />
                <h4 style={{ margin: 0 }}>Safety Overrides</h4>
              </div>
              <p style={{ fontSize: '0.95rem', margin: 0 }}>
                During the flowering stage, maintaining adequate moisture is critical. The firmware automatically suspends AWD thresholds and maintains 3–5 cm of standing water to prevent pollen sterility and protect crop yield.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FirmwareCloudSection;
