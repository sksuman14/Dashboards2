import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

const SectionLabel = ({ text }) => (
  <span style={{
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '3px',
    color: 'var(--accent-purple)',
    textTransform: 'uppercase'
  }}>
    {text}
  </span>
);

const SpecRow = ({ label, value, isMobile }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: isMobile ? 'flex-start' : 'space-between',
        padding: isMobile ? '16px 20px' : '24px',
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: isHovered ? 'rgba(255,255,255,0.02)' : 'transparent',
        transition: 'background-color 0.3s ease',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '8px' : '0'
      }}
    >
      <span style={{
        fontSize: '18px',
        fontWeight: '600',
        color: isHovered ? 'var(--accent-cyan)' : 'var(--text-primary)',
        transition: 'color 0.3s ease',
        flex: 1
      }}>
        {label}
      </span>
      <span style={{
        fontSize: isMobile ? '14px' : '16px',
        color: 'var(--text-secondary)',
        fontWeight: '500',
        flex: 1,
        textAlign: isMobile ? 'left' : 'right'
      }}>
        {value}
      </span>
    </div>
  );
};

const SpecHighlightCard = ({ highlight, isMobile }) => (
  <div className="interactive-card" style={{
    flex: 1,
    padding: isMobile ? '24px' : '32px',
    borderRadius: 'var(--r20)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute',
      top: '-50px',
      left: '-50px',
      width: '150px',
      height: '150px',
      background: 'radial-gradient(circle, rgba(0,229,255,0.1) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(15px)',
      pointerEvents: 'none'
    }} />
    
    <div style={{
      padding: '6px 12px',
      backgroundColor: 'var(--bg-tag)',
      borderRadius: 'var(--r50)',
      border: '1px solid rgba(176, 38, 255, 0.3)',
      alignSelf: 'flex-start'
    }}>
      <span style={{
        fontSize: '10px',
        fontWeight: '800',
        color: 'var(--accent-purple)',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}>
        TECH HIGHLIGHT
      </span>
    </div>
    <div style={{ height: '24px' }} />
    <span className="text-gradient" style={{
      fontFamily: 'Syne, sans-serif',
      fontSize: isMobile ? '32px' : '42px',
      fontWeight: '900',
      lineHeight: '1.1'
    }}>
      {highlight.value}
    </span>
    <div style={{ height: '12px' }} />
    <span style={{
      fontSize: '16px',
      fontWeight: '700',
      color: 'var(--text-primary)',
      letterSpacing: '-0.2px'
    }}>
      {highlight.label}
    </span>
    <div style={{ height: '12px' }} />
    <span style={{
      fontSize: '15px',
      color: 'var(--text-secondary)',
      lineHeight: '1.5'
    }}>
      {highlight.description}
    </span>
  </div>
);

export const SpecSection = ({ sensor }) => {
  const { width } = useWindowSize();
  const isWide = width > 1024;
  const isTablet = width > 700 && width <= 1024;
  const isMobile = width < 768;

  const hPad = isWide ? '80px' : isTablet ? '40px' : '24px';
  const specs = sensor.specifications;
  const highlights = sensor.techHighlights;

  if (!specs || specs.length === 0) return null;

  return (
    <div id="specifications" style={{
      backgroundColor: 'transparent',
      padding: isMobile ? '60px 20px' : `120px ${hPad}`,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '1400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <SectionLabel text="Technical specifications" />
          <div style={{ height: '16px' }} />
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: isMobile ? '32px' : isWide ? '54px' : '40px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            letterSpacing: '-2px'
          }}>
            Everything you need to <span className="text-gradient">know</span>
          </h2>
          <div style={{ height: '24px' }} />
          <p style={{
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: isMobile ? '16px' : '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Full technical detail for systems integrators, procurement, and engineering teams.
          </p>
        </div>

        {/* Top Highlights Banner */}
        {highlights && (
          <div style={{
            display: 'flex',
            flexDirection: isWide ? 'row' : 'column',
            gap: '24px',
            marginBottom: '64px'
          }}>
            {highlights.map((h, i) => (
              <SpecHighlightCard key={i} highlight={h} isMobile={isMobile} />
            ))}
          </div>
        )}

        {/* Flat Hover-Table for Specs */}
        <div className="interactive-card" style={{
          padding: isWide ? '24px 64px' : '16px 24px',
          borderRadius: 'var(--r20)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '2px solid var(--border)',
          }}>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Specification</span>
            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Detail</span>
          </div>
          {specs.map((s, i) => (
            <SpecRow key={i} label={s.label} value={s.value} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </div>
  );
};
