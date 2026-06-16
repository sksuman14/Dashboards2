import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { Download, MessageCircle } from 'lucide-react';
import { handleEmailEnquiry } from '../utils/emailHelper';

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

export const DeploySection = ({ sensor }) => {
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <div style={{
      width: '100%',
      padding: `${isMobile ? '60px' : '140px'} ${isMobile ? '20px' : '40px'}`,
      backgroundColor: 'transparent',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Bottom glowing mesh */}
      <div style={{
        position: 'absolute',
        bottom: '-200px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(0,229,255,0.1) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <span style={{
        color: 'var(--accent-cyan)',
        fontSize: '12px',
        fontWeight: '900',
        letterSpacing: '4px',
        position: 'relative',
        zIndex: 1
      }}>
        GET STARTED TODAY
      </span>
      <div style={{ height: '24px' }} />

      <h2 style={{
        textAlign: 'center',
        fontSize: isMobile ? '42px' : '72px',
        fontWeight: '900',
        color: 'white',
        fontFamily: 'Syne, sans-serif',
        letterSpacing: '-2px',
        lineHeight: '1.1',
        margin: 0,
        position: 'relative',
        zIndex: 1
      }}>
        Ready to{' '}
        <span className="text-gradient">
          deploy?
        </span>
      </h2>
      <div style={{ height: '32px' }} />

      <p style={{
        maxWidth: '700px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: isMobile ? '16px' : '20px',
        lineHeight: '1.6',
        margin: 0,
        position: 'relative',
        zIndex: 1
      }}>
        Download the full datasheet or speak with the ANNAM.AI engineering team about your specific application and integration requirements.
      </p>
      <div style={{ height: '56px' }} />

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
  );
};
