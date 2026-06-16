import React from 'react';
import { Droplets } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '4rem 0 2rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
            <Droplets size={32} />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>AWD System</span>
          </div>
          <p style={{ maxWidth: '400px', color: 'var(--text-muted)' }}>
            Smart Irrigation for Sustainable Rice Cultivation.
          </p>
          <div className="badge" style={{ marginTop: '1rem' }}>
            Developed by IIT Ropar Technology & Innovation Foundation (iHub-AWaDH)
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          &copy; iHub-AWaDH. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
