import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

const SectionLabel = ({ text }) => (
  <span style={{
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '3px',
    color: 'var(--accent-cyan)',
    textTransform: 'uppercase'
  }}>
    {text}
  </span>
);

const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;
  const [isHovered, setIsHovered] = React.useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <div 
      className="interactive-card" 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: isMobile ? '24px' : '32px',
        borderRadius: 'var(--r20)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: isMobile ? '16px' : '24px',
        position: 'relative',
        overflow: 'hidden',
        background: isHovered ? 'rgba(20, 25, 35, 0.8) !important' : 'var(--bg-card) !important',
        transition: 'all 0.4s ease'
      }}
    >
      <div style={{
        padding: '16px',
        backgroundColor: isHovered ? 'rgba(0, 229, 255, 0.15)' : 'var(--bg-tag)',
        borderRadius: 'var(--r14)',
        border: `1px solid ${isHovered ? 'var(--accent-cyan)' : 'rgba(0, 229, 255, 0.2)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.4s ease',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}>
        <Icon size={isMobile ? 24 : 32} color={isHovered ? '#fff' : 'var(--accent-cyan)'} />
      </div>
      
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: isMobile ? '18px' : '22px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px',
          marginBottom: '12px'
        }}>
          {feature.title}
        </h3>
        
        <p style={{
          fontSize: '16px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          margin: 0
        }}>
          {feature.description}
        </p>
      </div>
    </div>
  );
};

export const FeatureSection = ({ sensor }) => {
  const { width } = useWindowSize();
  const isWide = width > 1024;
  const isTablet = width > 700 && width <= 1024;
  const isMobile = width < 768;

  const hPad = isWide ? '80px' : isTablet ? '40px' : '24px';

  if (!sensor.detailedFeatures || sensor.detailedFeatures.length === 0) return null;

  return (
    <div id="features" style={{
      backgroundColor: 'transparent',
      padding: isMobile ? '60px 20px' : `120px ${hPad}`,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '1400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <SectionLabel text="Core Architecture" />
          <div style={{ height: '16px' }} />
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: isMobile ? '32px' : isWide ? '54px' : '40px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            letterSpacing: '-2px'
          }}>
            Built for the <span className="text-gradient">Unknown</span>
          </h2>
          <div style={{ height: '24px' }} />
          <p style={{
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: isMobile ? '16px' : '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            {sensor.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isWide ? 'repeat(2, 1fr)' : '1fr',
          gap: '32px',
        }}>
          {sensor.detailedFeatures.map((f, i) => (
            <FeatureCard key={i} feature={f} />
          ))}
        </div>
      </div>
    </div>
  );
};
