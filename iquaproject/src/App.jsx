import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Testing from './pages/Testing';
import FieldData from './pages/FieldData';
import Deployment from './pages/Deployment';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          marginBottom: '32px',
          background: 'var(--panel-bg)',
          padding: '16px 24px',
          borderRadius: '12px',
          border: '1px solid var(--panel-border)',
          backdropFilter: 'blur(16px)'
        }}>
          {/* Logo / Brand Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              boxShadow: '0 4px 10px rgba(20, 184, 166, 0.3)'
            }}>
              IQ
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.2rem', margin: 0, background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Chloritron IQUA
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '-2px' }}>Monitoring System</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <NavLink 
              to="/" 
              style={({ isActive }) => ({
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-blue-glow)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              })}
            >
              Home
            </NavLink>
            <NavLink 
              to="/testing" 
              style={({ isActive }) => ({
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-blue-glow)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              })}
            >
              Testing
            </NavLink>
            <NavLink 
              to="/field-data" 
              style={({ isActive }) => ({
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-teal-glow)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              })}
            >
              Field Data
            </NavLink>
            <NavLink 
              to="/deployment" 
              style={({ isActive }) => ({
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-teal-glow)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s',
                fontSize: '0.95rem'
              })}
            >
              Deployment
            </NavLink>
          </div>

          {/* Right side - User / Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/testing" element={<Testing />} />
          <Route path="/field-data" element={<FieldData />} />
          <Route path="/deployment" element={<Deployment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
