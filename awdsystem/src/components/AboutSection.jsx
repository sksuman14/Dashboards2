import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="section" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          
          <div className="animate-fade-in">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>About the Project</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              <strong>Alternate Wetting and Drying (AWD)</strong> is a water management practice that reduces irrigation water use without reducing rice yields. Instead of keeping fields continuously flooded, AWD allows rice fields to dry intermittently before being re-flooded.
            </p>
            <p>
              Irrigation is applied a few days after ponded water disappears from the soil surface. The field alternates between flooded and non-flooded conditions throughout the growing season.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
