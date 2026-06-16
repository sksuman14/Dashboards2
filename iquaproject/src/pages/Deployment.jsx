import React from 'react';

import img1 from '../assets/deployment-1.jpeg';
import img2 from '../assets/deployment-2.jpeg';
import img3 from '../assets/deployment-3.jpeg';
import img4 from '../assets/deployment-4.jpeg';
import img5 from '../assets/deployment-5.jpeg';
import img6 from '../assets/deployment-6.jpeg';
import img7 from '../assets/deployment-7.jpeg';
import img8 from '../assets/deployment-8.jpeg';
import img9 from '../assets/deployment-9.jpeg';
import img10 from '../assets/deployment-10.jpeg';

const deploymentImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

const Deployment = () => {
  return (
    <div className="animate-fade-in">
      <div className="dashboard-header">
        <h1><span>Chloritron Smart and IQUA</span> Deployment</h1>
        <p>Field deployment images</p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '24px', color: 'var(--accent-teal)' }}>Deployment Images</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          {deploymentImages.map((img, index) => (
            <div key={index} style={{ 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              aspectRatio: '3/4'
            }}>
              <img 
                src={img} 
                alt={`Deployment ${index + 1}`} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deployment;
