import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useWindowSize } from '../hooks/useWindowSize';

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: isMobile ? (scrolled ? '12px 20px' : '16px 20px') : (scrolled ? '16px 40px' : '24px 40px'),
      backgroundColor: scrolled ? 'rgba(3, 3, 3, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Logo Area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(176, 38, 255, 0.4)'
        }}>
          <Activity size={20} color="white" strokeWidth={3} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="text-gradient" style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '20px',
            fontWeight: '900',
            letterSpacing: '1px',
            lineHeight: '1.2'
          }}>
            DATA LOGGER
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{
        display: 'flex',
        gap: isMobile ? '16px' : '32px',
        alignItems: 'center'
      }}>
        {['Features', 'Specifications'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} style={{
          fontSize: isMobile ? '12px' : '14px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            transition: 'color 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            {item}
          </a>
      ))}
      </nav>
    </header>
  );
};
