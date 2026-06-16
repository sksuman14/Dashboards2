import React from 'react';
import { dataLogger } from './data/sensorData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeatureSection } from './components/FeatureSection';
import { SpecSection } from './components/SpecSection';
import { DeploySection } from './components/DeploySection';

function App() {
  return (
    <div style={{
      backgroundColor: 'transparent',
      minHeight: '100vh',
      width: '100%',
      color: 'var(--text-primary)',
      fontFamily: 'Syne, sans-serif'
    }}>
      <Header />
      <HeroSection sensor={dataLogger} />
      <FeatureSection sensor={dataLogger} />
      <SpecSection sensor={dataLogger} />
      <DeploySection sensor={dataLogger} />
      
      {/* Simple Footer */}
      <div className="animate-fade-in" style={{
        backgroundColor: 'var(--bg-deep)',
        padding: '32px',
        textAlign: 'center',
        borderTop: '1px solid var(--border)',
        animationDelay: '0.5s'
      }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', letterSpacing: '0.5px' }}>
          Reliable Telemetry & Data Logging Solutions. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default App;
