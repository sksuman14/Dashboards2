import React, { useState } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { ArrowRight } from 'lucide-react';

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

export const ApplicationSection = ({ sensor }) => {
  const { width } = useWindowSize();
  const isWide = width > 1024;
  const isTablet = width > 700 && width <= 1024;
  const isMobile = width < 768;
  
  const hPad = isWide ? '80px' : isTablet ? '40px' : '24px';

  const [activeIndex, setActiveIndex] = useState(0);

  if (!sensor.detailedApplications || sensor.detailedApplications.length === 0) return null;

  const activeApp = sensor.detailedApplications[activeIndex];

  return (
    <div style={{
      backgroundColor: 'transparent',
      padding: isMobile ? '60px 20px' : `120px ${hPad}`,
      display: 'flex',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '20%',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(176,38,255,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1400px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <SectionLabel text="Where it's used" />
          <div style={{ height: '16px' }} />
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: isMobile ? '32px' : isWide ? '54px' : '40px',
            fontWeight: '900',
            color: 'var(--text-primary)',
            letterSpacing: '-2px'
          }}>
            Critical <span className="text-gradient">Applications</span>
          </h2>
          <div style={{ height: '24px' }} />
          <p style={{
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: isMobile ? '16px' : '18px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Engineered for infrastructure requiring precise, real-time telemetry and long-term data resilience.
          </p>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: isWide ? 'row' : 'column',
          gap: '40px',
          alignItems: 'stretch'
        }}>
          {/* Tabs Navigation */}
          <div style={{ flex: '0 0 35%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sensor.detailedApplications.map((app, i) => {
              const isActive = activeIndex === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    padding: isMobile ? '16px' : '24px',
                    borderRadius: 'var(--r14)',
                    backgroundColor: isActive ? 'var(--bg-card)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--accent-cyan)' : 'transparent'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.05)' : 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="text-gradient" style={{
                      fontSize: '14px',
                      fontWeight: '900',
                      letterSpacing: '2px',
                      opacity: isActive ? 1 : 0.5
                    }}>
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <span style={{
                      fontSize: '18px',
                      fontWeight: isActive ? '800' : '600',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}>
                      {app.title}
                    </span>
                  </div>
                  {isActive && <ArrowRight size={20} color="var(--accent-cyan)" />}
                </button>
              );
            })}
          </div>

          {/* Active Panel Content */}
          <div className="interactive-card" style={{
            flex: 1,
            borderRadius: 'var(--r20)',
            padding: isMobile ? '24px' : isWide ? '64px' : '32px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
             {/* Subtle background glow for the image card */}
            <div style={{
              position: 'absolute',
              top: '0',
              right: '0',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(176,38,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                padding: '8px 16px',
                backgroundColor: 'var(--bg-tag)',
                borderRadius: 'var(--r50)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                alignSelf: 'flex-start',
                display: 'inline-block',
                marginBottom: '24px'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'var(--accent-cyan)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {activeApp.tag}
                </span>
              </div>

              <h3 style={{
                fontSize: isMobile ? '24px' : isWide ? '42px' : '32px',
                fontWeight: '900',
                color: 'var(--text-primary)',
                letterSpacing: '-1px',
                marginBottom: '24px',
                fontFamily: 'Syne, sans-serif'
              }}>
                {activeApp.title}
              </h3>
              
              <p style={{
                fontSize: isMobile ? '16px' : '18px',
                color: 'var(--text-secondary)',
                lineHeight: '1.8',
                maxWidth: '600px'
              }}>
                {activeApp.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
