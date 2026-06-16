import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Droplets, Radio, PlayCircle } from 'lucide-react';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { 
      id: 0,
      icon: <Settings className="h-6 w-6" />,
      title: '1. Installation (+5cm Flood)', 
      desc: 'A perforated PVC field water tube is installed to monitor subsurface water conditions (-15cm to +5cm).' 
    },
    { 
      id: 1,
      icon: <Droplets className="h-6 w-6" />,
      title: '2. Drying Phase (Water Receding)', 
      desc: 'Water recedes naturally. Soil oxygen spikes, shutting down methane production without stressing the crop.' 
    },
    { 
      id: 2,
      icon: <Radio className="h-6 w-6" />,
      title: '3. Critical Threshold (-15cm)', 
      desc: 'At exactly -15cm, the lower magnetic float switch triggers, and the BLE node transmits the event.' 
    },
    { 
      id: 3,
      icon: <PlayCircle className="h-6 w-6" />,
      title: '4. Automated Reflood (+5cm)', 
      desc: 'Latching solenoid valve opens, reflooding the field to +5cm to suppress weeds before closing again.' 
    },
  ];

  return (
    <section id="how-it-works" className="section" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Interactive System Simulation</h2>
          <p style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 4rem', color: 'var(--text-muted)' }}>
            See how Automated AWD manages the delicate balance between water conservation and crop health.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2" style={{ alignItems: 'center' }}>
          
          {/* Interactive Steps List */}
          <div>
            {steps.map((step, index) => (
              <motion.div 
                key={step.id} 
                onClick={() => setActiveStep(step.id)}
                style={{ 
                  padding: '1.5rem', 
                  marginBottom: '1rem',
                  border: '1px solid',
                  borderColor: activeStep === step.id ? 'var(--primary)' : 'var(--border)',
                  borderRadius: 'var(--radius)', 
                  backgroundColor: activeStep === step.id ? 'rgba(10, 92, 54, 0.05)' : 'var(--background)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: activeStep === step.id ? 1 : 0.6
                }}
                whileHover={{ scale: 1.02, opacity: 1 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ color: activeStep === step.id ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {step.icon}
                  </div>
                  <h4 style={{ margin: 0, color: activeStep === step.id ? 'var(--primary)' : 'var(--text-main)' }}>{step.title}</h4>
                </div>
                <p style={{ fontSize: '0.95rem', margin: '0 0 0 3rem' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Simulation Visual */}
          <div style={{ 
            height: '400px', 
            backgroundColor: '#e0f2fe', 
            borderRadius: 'var(--radius)', 
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
          }}>
            {/* The Soil / Ground */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '50%', backgroundColor: '#854d0e', borderTop: '4px solid #653808' }}>
               {/* Roots */}
               <div style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '100px', borderLeft: '2px solid #a16207', borderRight: '2px solid #a16207', borderBottomRadius: '50%' }}></div>
            </div>

            {/* The Crop */}
            <div style={{ position: 'absolute', bottom: '50%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
              <div style={{ width: '4px', height: '80px', backgroundColor: '#22c55e', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ width: '4px', height: '120px', backgroundColor: '#16a34a', borderRadius: '4px 4px 0 0' }}></div>
              <div style={{ width: '4px', height: '90px', backgroundColor: '#22c55e', borderRadius: '4px 4px 0 0' }}></div>
            </div>

            {/* The Tube */}
            <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '40px', height: '60%', backgroundColor: '#cbd5e1', border: '2px solid #94a3b8', borderRadius: '4px' }}>
              {/* Perforations */}
              <div style={{ position: 'absolute', bottom: '10%', left: '30%', width: '4px', height: '4px', backgroundColor: '#334155', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', bottom: '30%', left: '60%', width: '4px', height: '4px', backgroundColor: '#334155', borderRadius: '50%' }}></div>
            </div>

            {/* The Water */}
            <motion.div 
              style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(56, 189, 248, 0.7)', borderTop: '2px solid rgba(14, 165, 233, 0.9)' }}
              animate={{ 
                height: activeStep === 0 ? '60%' : activeStep === 1 ? '40%' : activeStep === 2 ? '20%' : '60%' 
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Dynamic Labels */}
            <AnimatePresence mode='wait'>
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ position: 'absolute', top: '20px', right: '20px', padding: '10px 15px', backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#1e293b' }}
              >
                {activeStep === 0 && 'System Installed (+5cm Flood)'}
                {activeStep === 1 && 'Drying (Water Receding)'}
                {activeStep === 2 && 'Threshold Reached (-15cm)'}
                {activeStep === 3 && 'Valve Open (+5cm Reflood)'}
              </motion.div>
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
