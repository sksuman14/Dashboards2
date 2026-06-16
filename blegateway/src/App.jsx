import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// SVG Icons
const MeshIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <line x1="8" y1="8" x2="10.5" y2="10.5" />
    <line x1="16" y1="8" x2="13.5" y2="10.5" />
    <line x1="8" y1="16" x2="10.5" y2="13.5" />
    <line x1="16" y1="18" x2="13.5" y2="13.5" />
  </svg>
);

const AntennaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20" />
    <path d="M17 5a9 9 0 0 0-10 0" />
    <path d="M19 8a12 12 0 0 0-14 0" />
    <path d="M21 11a16 16 0 0 0-18 0" />
    <path d="M12 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
  </svg>
);

const RouterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <path d="M6 18h.01" />
    <path d="M10 18h.01" />
    <path d="M14 18h.01" />
    <path d="M20 2v12" />
    <path d="M4 6V2" />
    <path d="M12 10V2" />
  </svg>
);

const UpdateIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const WifiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

const SolarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const CpuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M9 9h6v6H9z" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
  </svg>
);

const SlidersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="2" y1="14" x2="6" y2="14" />
    <line x1="10" y1="8" x2="14" y2="8" />
    <line x1="18" y1="16" x2="22" y2="16" />
  </svg>
);

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Specs Tab Mode
  const [specCategory, setSpecCategory] = useState('all'); // 'all' | 'processor' | 'rf' | 'connectivity' | 'power'

  // Telemetry Simulator States removed

  // Simulator logic removed

  const data = {
    title: "BLE",
    highlightText: "Gateway",
    subtitle: "BLE gateway for industrial IoT applications",
    eyebrow: "BLE 5.4 · 4G / WiFi / LAN · 100+ nodes",
    bannerPoints: [
      "Multi-industry IoT gateway solution",
      "Real-time data aggregation at scale",
      "Scalable gateway supporting 100+ nodes",
    ],
    stats: [
      { val: "100+", lbl: "Node support" },
      { val: "1 km", lbl: "BLE LoS range" },
      { val: "BLE 5.4", lbl: "Version" }
    ],
    techHighlights: [
      {
        value: "100+",
        label: "Seamless Node Mesh",
        description: "Advanced nRF5340 dual-core architecture allows concurrent processing of telemetry from over 100 wireless sensor nodes."
      },
      {
        value: "1 km",
        label: "High-Sensitivity Range",
        description: "Bluetooth 5.4 PA/LNA front-end module achieving massive line-of-sight coverage for expansive farm and facility deployments."
      },
      {
        value: "Triple",
        label: "Redundant Data Path",
        description: "Automatic failover between LTE, WiFi, and LAN ensuring your facility monitoring never goes offline during infrastructure failure."
      },
    ],
    detailedFeatures: [
      {
        title: "Massive Scalability",
        description: "Support for 100+ concurrent BLE nodes with seamless real-time data aggregation and processing.",
        icon: <MeshIcon />
      },
      {
        title: "Long-Range BLE",
        description: "Bluetooth 5.4 implementation reaching up to 1km Line-of-Sight (LoS) for expansive facility coverage.",
        icon: <AntennaIcon />
      },
      {
        title: "Triple Connectivity",
        description: "Uninterrupted data flow via 4G/LTE, WiFi, and LAN fallback mechanisms for critical reliability.",
        icon: <RouterIcon />
      },
      {
        title: "Remote Mgmt (FOTA)",
        description: "Full remote management with Firmware Over the Air (FOTA) updates and real-time node health monitoring.",
        icon: <UpdateIcon />
      },
    ],
    detailedApplications: [
      {
        title: "Smart Asset Tracking",
        description: "Real-time location and status monitoring for 100+ BLE tags in large warehouses and industrial sites.",
        tag: "Logistics"
      },
      {
        title: "Agricultural Sensor Mesh",
        description: "Aggregating data from dispersed soil and weather nodes across large plantations for unified control.",
        tag: "AgriTech"
      },
      {
        title: "Industrial Health",
        description: "Wireless monitoring of vibration and temperature sensors on factory floors for predictive maintenance.",
        tag: "Industrial"
      },
      {
        title: "Smart Hospitals",
        description: "Tracking medical equipment and monitoring patient environments using low-power BLE 5.4 connectivity.",
        tag: "Healthcare"
      },
    ],
    specifications: [
      { label: "Input voltage", value: "5–30 V DC", category: "power" },
      { label: "Processor", value: "Dual-Core ARM Cortex-M33", category: "processor" },
      { label: "BLE Controller", value: "nRF5340 (Nordic)", category: "processor" },
      { label: "BLE Protocol", value: "Bluetooth 5.4", category: "rf" },
      { label: "On-board memory", value: "512 KB RAM + 1 MB Flash", category: "processor" },
      { label: "System interfaces", value: "SPI, I2C, I2S, UART", category: "connectivity" },
      { label: "Connectivity", value: "4G / WiFi / LAN", category: "connectivity" },
      { label: "Power options", value: "Internal Battery + Solar Panel", category: "power" },
    ],
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  // Filter specifications based on tab
  const filteredSpecs = specCategory === 'all' 
    ? data.specifications 
    : data.specifications.filter(s => s.category === specCategory);

  return (
    <div className="app-container">
      {/* Background Grids & Ambient Lights */}
      <div className="bg-grid-overlay"></div>
      <div className="ambient-light"></div>
      <div className="ambient-light-secondary"></div>

      {/* Navbar */}
      <nav className="navbar glow-card-border">
        <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="logo-dot"></div>
          <span className="logo-title">Ble Gateway</span>
        </div>
        
        <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Capabilities</a></li>
          <li><a href="#applications" onClick={(e) => { e.preventDefault(); scrollToSection('applications'); }}>Applications</a></li>
          <li><a href="#specifications" onClick={(e) => { e.preventDefault(); scrollToSection('specifications'); }}>Datasheet</a></li>
          <li><a href="#deployment" onClick={(e) => { e.preventDefault(); scrollToSection('deployment'); }}>Deployment</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="pulsing-dot"></span>
            {data.eyebrow}
          </div>
          <h1 className="hero-title">
            Industrial <span className="gradient-text">{data.title} {data.highlightText}</span>
          </h1>
          <p className="hero-subtitle">{data.subtitle}</p>
          <ul className="banner-points">
            {data.bannerPoints.map((point, i) => (
              <li key={i} className="banner-point-item">
                <span className="banner-point-icon"><CheckIcon /></span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="hero-ctas">
            <button className="btn btn-primary" onClick={() => window.open('/assets/images/pdfs/BLE_GATEWAY_Datasheet.pdf', '_blank')}>
              View Datasheet
            </button>
          </div>

        </div>
        
        {/* Hero Image Panel */}
        <div className="hero-interactive-panel glow-card-border" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="image-glow-backdrop"></div>
          <img 
            src="/assets/images/blegateway.png" 
            alt="BLE Gateway Device Mockup" 
            className="hero-image"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid glow-card-border">
          {data.stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <span className="stat-val">{stat.val}</span>
              <span className="stat-lbl">{stat.lbl}</span>
            </div>
          ))}
        </div>
      </section>



      {/* Technical Highlights */}
      <section className="highlights">
        <div className="section-title-wrapper">
          <span className="eyebrow-accent"><span className="eyebrow-dot"></span>Industrial Specs</span>
          <h2 className="section-title">Technical Highlights</h2>
          <p className="section-subtitle">Engineered for mission-critical remote telemetry under extreme conditions.</p>
        </div>
        <div className="highlights-grid">
          {data.techHighlights.map((hl, i) => (
            <div key={i} className="highlight-card glow-card-border">
              <span className="highlight-val">{hl.value}</span>
              <h3 className="highlight-title">{hl.label}</h3>
              <p className="highlight-desc">{hl.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Features */}
      <section id="features" className="features">
        <div className="section-title-wrapper">
          <span className="eyebrow-accent"><span className="eyebrow-dot"></span>Capabilities</span>
          <h2 className="section-title">Robust Enterprise Features</h2>
          <p className="section-subtitle">Edge intelligence combined with redundant backhaul options for reliable IoT operation.</p>
        </div>
        <div className="features-grid">
          {data.detailedFeatures.map((feat, i) => (
            <div key={i} className="feature-card glow-card-border">
              <div className="feature-icon-wrapper">
                {feat.icon}
              </div>
              <div className="feature-info">
                <h3 className="feature-card-title">{feat.title}</h3>
                <p className="feature-card-desc">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Applications */}
      <section id="applications" className="applications">
        <div className="section-title-wrapper">
          <span className="eyebrow-accent"><span className="eyebrow-dot"></span>Use cases</span>
          <h2 className="section-title">Industrial Deployments</h2>
          <p className="section-subtitle">Multi-industry IoT solution tailored to solve scalability and range constraints.</p>
        </div>
        <div className="apps-container glow-card-border">
          <div className="apps-tabs">
            {data.detailedApplications.map((app, i) => (
              <button 
                key={i} 
                className={`app-tab-btn ${activeTab === i ? 'active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                <span>{app.title}</span>
                <span className="app-tab-btn-tag">{app.tag}</span>
              </button>
            ))}
          </div>
          <div className="app-content-panel">
            <span className="app-content-tag">{data.detailedApplications[activeTab].tag}</span>
            <h3 className="app-content-title">{data.detailedApplications[activeTab].title}</h3>
            <p className="app-content-desc">{data.detailedApplications[activeTab].description}</p>

          </div>
        </div>
      </section>

      {/* Specifications Explorer */}
      <section id="specifications" className="specifications">
        <div className="section-title-wrapper">
          <span className="eyebrow-accent"><span className="eyebrow-dot"></span>Hardware Datasheet</span>
          <h2 className="section-title">Technical Specifications</h2>
          <p className="section-subtitle">Complete hardware details, electrical specs, and controller configuration.</p>
        </div>
        
        <div className="specifications-explorer">
          <div className="specs-category-tabs">
            <button className={`spec-cat-btn ${specCategory === 'all' ? 'active' : ''}`} onClick={() => setSpecCategory('all')}>All Specs</button>
            <button className={`spec-cat-btn ${specCategory === 'processor' ? 'active' : ''}`} onClick={() => setSpecCategory('processor')}>SoC & Memory</button>
            <button className={`spec-cat-btn ${specCategory === 'rf' ? 'active' : ''}`} onClick={() => setSpecCategory('rf')}>Radio & Range</button>
            <button className={`spec-cat-btn ${specCategory === 'connectivity' ? 'active' : ''}`} onClick={() => setSpecCategory('connectivity')}>Backhaul I/O</button>
            <button className={`spec-cat-btn ${specCategory === 'power' ? 'active' : ''}`} onClick={() => setSpecCategory('power')}>Power & Casing</button>
          </div>

          <div className="specs-wrapper glow-card-border">
            <div className="specs-grid">
              {filteredSpecs.map((spec, i) => (
                <div key={i} className="spec-row">
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Section */}
      <section id="deployment" className="deployment">
        <div className="section-title-wrapper">
          <span className="eyebrow-accent"><span className="eyebrow-dot"></span>Deployments</span>
          <h2 className="section-title">Deployment Scenarios</h2>
          <p className="section-subtitle">Visualizing real-world applications and installations.</p>
        </div>
        
        <div className="deployment-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <div key={num} className="deployment-card glow-card-border">
              <div className="deployment-image-wrapper">
                <img 
                  src={`/assets/images/${num}.jpg`} 
                  alt={`Deployment Image ${num}`} 
                  className="deployment-image"
                  loading="lazy"
                />
              </div>
              <div className="deployment-card-info">
                <span className="deployment-card-tag">Deployment {num}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer glow-card-border">
        <div className="footer-top">
          <div className="footer-logo">
            <div className="logo-dot"></div>
            <span>Ble Gateway</span>
          </div>
          <ul className="footer-links">

            <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Capabilities</a></li>
            <li><a href="#specifications" onClick={(e) => { e.preventDefault(); scrollToSection('specifications'); }}>Specs</a></li>
            <li><a href="#deployment" onClick={(e) => { e.preventDefault(); scrollToSection('deployment'); }}>Deployment</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default App;
