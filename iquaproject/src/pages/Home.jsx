import React from 'react';
import { FiActivity, FiCpu, FiDroplet, FiGlobe, FiShield, FiSun } from 'react-icons/fi';
import { FaLeaf, FaCity, FaIndustry, FaFish } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container animate-fade-in">
      
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title text-gradient">Chloritron Smart and IQUA</h1>
        <p className="hero-description delay-1">
          The Chloritron Smart and IQUA is an IoT-based sensor system for 24x7 monitoring of irrigation and drinking water quality. It measures parameters like pH, TDS, turbidity, temperature, conductivity, and heavy metals, providing mobile alerts and cloud integration.
        </p>
      </section>

      {/* Value Proposition */}
      <section className="delay-2">
        <div className="value-grid">
          <div className="value-card">
            <div className="value-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
              <FiSun />
            </div>
            <h3>Portable and solar-powered, requiring minimal maintenance.</h3>
          </div>
          <div className="value-card">
            <div className="value-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)' }}>
              <FiActivity />
            </div>
            <h3>Provides real-time alerts and AI-based analytics via dashboards.</h3>
          </div>
          <div className="value-card">
            <div className="value-icon" style={{ background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-teal)' }}>
              <FiShield />
            </div>
            <h3>Features self-cleaning, waterproof (IP68) sensors.</h3>
          </div>
          <div className="value-card">
            <div className="value-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
              <FiCpu />
            </div>
            <h3>Built on a modular, low-power (12V DC), scalable design.</h3>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="delay-3">
        <div className="info-card">
          <h2 style={{ color: 'var(--text-primary)' }}>
            <FiDroplet color="var(--accent-teal)" />
            Technology Description
          </h2>
          <p>
            The IQUA system is an advanced, field-tested solution for 24/7, real-time water quality monitoring. It is a modular, IoT-based system built with a suite of robust sensors to track a wide range of critical parameters, including pH, Total Dissolved Solids (TDS), turbidity, Dissolved Oxygen (DO), Chemical Oxygen Demand (COD), and chlorine. 
            <br/><br/>
            Engineered for durability and autonomy, the system features self-cleaning, waterproof (IP68) sensors and is powered by a low-power (12V DC) design, making it ideal for solar-powered deployment in remote locations with minimal maintenance.
          </p>
        </div>
      </section>

      {/* Applications */}
      <section className="app-section delay-4">
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '16px' }}>
          <span className="text-gradient">Key Applications</span>
        </h2>
        
        <div className="app-grid">
          <div className="app-item">
            <div className="app-item-icon"><FaLeaf /></div>
            <div className="app-item-content">
              <h4>Agriculture</h4>
              <p>Prevents soil degradation and crop loss from poor water quality, ensures safe water use in irrigation and livestock, and promotes data-driven water governance in rural areas.</p>
            </div>
          </div>
          
          <div className="app-item">
            <div className="app-item-icon" style={{ color: 'var(--accent-blue)' }}><FaCity /></div>
            <div className="app-item-content">
              <h4>Municipal Water</h4>
              <p>Ensures safe distribution & compliance with regulations for public health and safety.</p>
            </div>
          </div>
          
          <div className="app-item">
            <div className="app-item-icon" style={{ color: 'var(--warning)' }}><FaIndustry /></div>
            <div className="app-item-content">
              <h4>Industry</h4>
              <p>Useful for process water control in dairy, textile, and chemical industries.</p>
            </div>
          </div>
          
          <div className="app-item">
            <div className="app-item-icon" style={{ color: '#8b5cf6' }}><FaFish /></div>
            <div className="app-item-content">
              <h4>Aquaculture</h4>
              <p>Leads to improved fish health & productivity by maintaining optimal water conditions.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
