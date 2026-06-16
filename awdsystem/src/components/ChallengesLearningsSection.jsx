import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, Droplets, CheckCircle2 } from 'lucide-react';

const challenges = [
  {
    icon: <ShieldAlert className="h-8 w-8 text-amber-500" />,
    title: "Float Switch Bio-Fouling",
    desc: "In highly turbid water, mud and algae can cause standard sensors to jam.",
    solution: "We utilize ruggedized mechanical-binary dual-float switches encased in a 200-mesh nylon filtration screen, completely eliminating false analog readings."
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    title: "Signal Attenuation",
    desc: "A mature, water-rich rice canopy severely attenuates 2.4 GHz RF signals.",
    solution: "Deployed a multi-hop BLE relay architecture with 'learned passive scanning', maintaining >99% data reliability per hop across expansive fields."
  },
  {
    icon: <Droplets className="h-8 w-8 text-red-500" />,
    title: "Agronomic Short-Cycling",
    desc: "Minor surface ripples can trigger rapid, unstable valve actuation.",
    solution: "Implemented strict agronomic hysteresis. The bottom float permanently locks at -15cm (drying threshold), and the top switch triggers exactly at +5cm (weed suppression)."
  }
];

const ChallengesLearningsSection = () => {
  return (
    <section id="challenges" className="section" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="badge">Field Tested</span>
            <h2>Challenges & Engineering Solutions</h2>
            <p style={{ maxWidth: '700px', margin: '0 auto' }}>
              Transitioning from prototype to long-term field deployment introduces systemic risks. Here's how we solved them for real-world reliability.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-3">
          {challenges.map((item, index) => (
            <motion.div 
              key={index} 
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div style={{ marginBottom: '1.5rem' }}>{item.icon}</div>
              <h4 style={{ marginBottom: '1rem' }}>{item.title}</h4>
              <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>{item.desc}</p>
              
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                borderLeft: '4px solid var(--primary-light)',
                borderRadius: '0 8px 8px 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary-light)', fontWeight: '600' }}>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>The Solution</span>
                </div>
                <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-main)' }}>{item.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengesLearningsSection;
