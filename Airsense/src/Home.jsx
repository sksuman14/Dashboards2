import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wind, Menu, X, ArrowRight } from 'lucide-react';
import './Home.css';
import productImg from './assets/airsense_product.png';
import poultryImg from './assets/poultry/ammonia.jpeg';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="home-container">
      {/* ─── Navigation Header ─── */}
      <header className="home-header">
        <div className="home-nav-container">
          <div className="home-logo-group">
            <div className="home-logo-icon">
              <Wind size={18} color="white" />
            </div>
            <span className="home-logo-text">AirSense</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={`home-nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
            <Link 
              to="/" 
              className="home-nav-link active"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/air-quality" 
              className="home-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              CO₂ & Air Quality
            </Link>
            <Link 
              to="/poultry-house" 
              className="home-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Poultry House
            </Link>
          </nav>

          {/* Mobile Hamburger Toggle Button */}
          <button className="home-hamburger-btn" onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="home-hero-section">
        <h1 className="home-title">AirSense Platform</h1>
        <h2 className="home-subtitle">Smart Industrial IoT Monitoring Solutions</h2>
        <p className="home-description">
          AirSense provides intelligent industrial monitoring through two specialized platforms designed for different environments.
        </p>
      </section>

      {/* ─── Product Selection Grid ─── */}
      <main className="home-main-content">
        <div className="home-cards-grid">
          
          {/* Left Card: CO2 & Air Quality Monitoring */}
          <div className="home-product-card">
            <div className="home-card-image-wrapper">
              <img src={productImg} alt="AirSense CO₂ & Air Quality Monitoring Device" className="home-card-image" />
            </div>
            <div className="home-card-content">
              <h3 className="home-card-title">CO₂ & Air Quality Monitoring</h3>
              <p className="home-card-desc">
                Monitor CO₂ concentration, temperature, humidity and indoor air quality in real time with cloud connectivity and analytics.
              </p>
              <Link to="/air-quality" className="home-card-btn">
                <span>Open Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Card: Poultry House */}
          <div className="home-product-card">
            <div className="home-card-image-wrapper">
              <img src={poultryImg} alt="Poultry House Monitoring System" className="home-card-image" />
            </div>
            <div className="home-card-content">
              <h3 className="home-card-title">Poultry House</h3>
              <p className="home-card-desc">
                Monitor ammonia, temperature and humidity while tracking poultry house conditions through an intelligent dashboard.
              </p>
              <Link to="/poultry-house" className="home-card-btn">
                <span>Open Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
