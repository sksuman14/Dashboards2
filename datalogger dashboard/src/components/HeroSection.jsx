import React from 'react';
import { ArrowRight, Download, MessageCircle } from 'lucide-react';
import { useWindowSize } from '../hooks/useWindowSize';
import { handleEmailEnquiry } from '../utils/emailHelper';

// Small reusable components
const EyebrowTag = ({ text }) => (
  <div className="animate-fade-in" style={{
    padding: '8px 16px',
    backgroundColor: 'var(--bg-tag)',
    borderRadius: 'var(--r50)',
    border: '1px solid var(--accent-bdr)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 0 10px rgba(0, 229, 255, 0.1)'
  }}>
    <div style={{
      width: '6px',
      height: '6px',
      backgroundColor: 'var(--accent-cyan)',
      borderRadius: '50%',
      boxShadow: '0 0 8px var(--accent-cyan)'
    }} />
    <span style={{
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '1px',
      color: 'var(--accent-cyan)',
      textTransform: 'uppercase'
    }}>
      {text}
    </span>
  </div>
);

const BannerBullet = ({ text }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--r50)', border: '1px solid var(--border-light)' }}>
    <div style={{
      width: '6px',
      height: '6px',
      background: 'var(--accent-gradient)',
      borderRadius: '50%',
      boxShadow: '0 0 5px var(--accent-purple)'
    }} />
    <div style={{ width: '8px' }} />
    <span style={{
      fontSize: '14px',
      fontWeight: '500',
      color: 'var(--text-secondary)',
    }}>
      {text}
    </span>
  </div>
);

const ActionBtn = ({ label, Icon, isPrimary, onClick }) => {
  return (
    <button
      className="interactive-btn"
      onClick={onClick}
      style={{
        padding: '16px 32px',
        background: isPrimary ? 'var(--text-primary)' : 'rgba(255,255,255,0.05)',
        borderRadius: '50px',
        border: `1px solid ${isPrimary ? 'transparent' : 'var(--border)'}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        width: '100%',
        boxShadow: isPrimary ? '0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(0, 229, 255, 0.1)' : 'none'
      }}
    >
      <span style={{
        position: 'relative',
        zIndex: 1,
        color: isPrimary ? 'var(--bg-deep)' : 'var(--text-primary)',
        fontWeight: isPrimary ? '800' : '500',
        fontSize: '15px'
      }}>
        {label}
      </span>
      {Icon && (
        <Icon size={18} color={isPrimary ? 'var(--bg-deep)' : 'var(--text-primary)'} style={{ position: 'relative', zIndex: 1 }} />
      )}
    </button>
  );
};

export const HeroSection = ({ sensor }) => {
  const { width } = useWindowSize();
  const isWide = width > 1024;
  const isTablet = width > 700 && width <= 1024;
  const isMobile = width < 768;

  const h1Size = isMobile ? '40px' : isWide ? '84px' : isTablet ? '64px' : '48px';

  return (
    <div style={{
      backgroundColor: 'var(--bg-base)',
      borderBottom: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: isMobile ? '100px' : isWide ? '140px' : '100px'
    }}>
      {/* Centered Content */}
      <div className="animate-slide-up" style={{ 
        maxWidth: '1000px', 
        width: '100%', 
        padding: '0 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <EyebrowTag text={sensor.eyebrow} />
        <div style={{ height: '32px' }} />

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: h1Size,
          fontWeight: '900',
          lineHeight: '1.05',
          letterSpacing: '-2px',
          color: 'var(--text-primary)'
        }}>
          {sensor.title} <span className="text-gradient">{sensor.highlightText}</span>
        </h1>

        <div style={{ height: '24px' }} />

        <p style={{
          fontSize: isMobile ? '16px' : isWide ? '20px' : '18px',
          fontWeight: '400',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          maxWidth: '700px'
        }}>
          {sensor.subtitle}
        </p>
        <div style={{ height: '32px' }} />

        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px', 
          justifyContent: 'center',
          marginBottom: '48px'
        }}>
          {sensor.bannerPoints.map((p, i) => (
            <BannerBullet key={i} text={p} />
          ))}
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '20px',
          justifyContent: 'center',
          width: isMobile ? '100%' : 'auto',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ width: isMobile ? '100%' : '240px' }}>
            <ActionBtn 
              label="Enquire Now" 
              Icon={MessageCircle} 
              isPrimary={true} 
              onClick={() => handleEmailEnquiry(sensor.email, "Product Enquiry", "Hello, I am interested in your product.")} 
            />
          </div>
          <div style={{ width: isMobile ? '100%' : '280px' }}>
            <ActionBtn 
              label="Download Datasheet" 
              Icon={Download} 
              isPrimary={false} 
              onClick={() => window.open(sensor.datasheetUrl, '_blank')} 
            />
          </div>
        </div>
      </div>

      <div style={{ height: '80px' }} />

      {/* Large Bottom Image and Stats */}
      <div className="animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '1400px', 
        padding: '0 24px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animationDelay: '0.4s'
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          zIndex: 0
        }} />

        <img
          src={sensor.imagePath}
          alt="Device"
          className="animate-float"
          style={{ 
            width: '100%', 
            maxWidth: '800px', 
            height: 'auto', 
            objectFit: 'contain',
            position: 'relative',
            zIndex: 5,
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))'
          }}
        />

        {/* Floating Stats */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          transform: 'translateY(-40px)',
          position: 'relative',
          zIndex: 10
        }}>
          {sensor.stats.map((stat, i) => (
            <div key={i} className="interactive-card" style={{
              padding: '16px 24px',
              borderRadius: 'var(--r50)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(13, 31, 45, 0.8) !important',
            }}>
              <span className="text-gradient" style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '20px',
                fontWeight: '800',
              }}>
                {stat.val}
              </span>
              <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }} />
              <span style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}>
                {stat.lbl}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


