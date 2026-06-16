import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

// Import the images from the Images folder
import img1 from '../Images/1.jpeg';
import img2 from '../Images/2.jpeg';
import img3 from '../Images/3.jpeg';
import img4 from '../Images/4.jpeg';
import img5 from '../Images/5.jpeg';
import img6 from '../Images/6.jpeg';
import img7 from '../Images/7.jpeg';
import img8 from '../Images/8.jpeg';
import img9 from '../Images/9.jpeg';

const deploymentImages = [
  { src: img1, title: 'Deployment 1', desc: 'Pre-season PVC field water tube assembly installation' },
  { src: img2, title: 'Deployment 2', desc: 'Solar-powered BLE node configuration in the field' },
  { src: img3, title: 'Deployment 3', desc: 'Direct hydraulic control solenoid valve hookup' },
  { src: img4, title: 'Deployment 4', desc: 'Robust sensor array positioning inside protective housing' },
  { src: img5, title: 'Deployment 5', desc: 'Flooded field baseline verification (+5cm level)' },
  { src: img6, title: 'Deployment 6', desc: 'Drying phase redox potential sensor calibration' },
  { src: img7, title: 'Deployment 7', desc: 'Network range and BLE relay station testing' },
  { src: img8, title: 'Deployment 8', desc: 'Latching actuator valve and pipe fittings check' },
  { src: img9, title: 'Deployment 9', desc: 'Live telemetries database syncing and final test' },
];

const DeploymentSection = () => {
  const [selectedIdx, setSelectedIdx] = useState(null);

  // Close lightbox on Escape key press
  useEffect(() => {
    if (selectedIdx === null) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedIdx(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx]);

  const handlePrev = () => {
    setSelectedIdx((prev) => (prev === 0 ? deploymentImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIdx((prev) => (prev === deploymentImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="deployment" className="section" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="container">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <span className="badge">Field Gallery</span>
          <h2>Deployments</h2>
          <p style={{ maxWidth: '700px', margin: '0 auto', color: 'var(--text-muted)' }}>
            Visualizing real-world applications and installations. Click on any deployment card to inspect the hardware setup and field telemetry in detail.
          </p>
        </motion.div>

        {/* Responsive Grid */}
        <div className="deployment-grid">
          {deploymentImages.map((image, index) => (
            <motion.div
              key={index}
              className="deployment-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => setSelectedIdx(index)}
            >
              <div className="deployment-img-wrapper">
                <img 
                  src={image.src} 
                  alt={image.title} 
                  loading="lazy"
                  className="deployment-img"
                />
                <div className="deployment-overlay">
                  <Maximize2 size={24} className="deployment-zoom-icon" />
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedIdx !== null && (
            <motion.div 
              className="lightbox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIdx(null)}
            >
              {/* Close Button */}
              <button 
                className="lightbox-close-btn"
                onClick={() => setSelectedIdx(null)}
                aria-label="Close lightbox"
              >
                <X size={28} />
              </button>

              {/* Prev Button */}
              <button 
                className="lightbox-nav-btn prev"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                aria-label="Previous image"
              >
                <ChevronLeft size={32} />
              </button>

              {/* Next Button */}
              <button 
                className="lightbox-nav-btn next"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                aria-label="Next image"
              >
                <ChevronRight size={32} />
              </button>

              {/* Main Content Card */}
              <motion.div 
                className="lightbox-content"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={deploymentImages[selectedIdx].src} 
                  alt={deploymentImages[selectedIdx].title}
                  className="lightbox-img"
                />

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default DeploymentSection;
