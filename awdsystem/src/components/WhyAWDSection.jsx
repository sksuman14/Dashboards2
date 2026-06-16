import React from 'react';
import { Droplet, Leaf, Battery, Zap, Cloud, Sprout } from 'lucide-react';

const WhyAWDSection = () => {
  const goals = [
    { icon: <Droplet size={24} />, title: 'Reduce Water Usage', desc: 'Saves 15-30% of irrigation water.' },
    { icon: <Sprout size={24} />, title: 'Maintain Productivity', desc: 'No compromise on rice yields.' },
    { icon: <Battery size={24} />, title: 'Lower Pumping Costs', desc: 'Reduces operational expenses.' },
    { icon: <Zap size={24} />, title: 'Energy Efficiency', desc: 'Optimized irrigation cycles.' },
    { icon: <Cloud size={24} />, title: 'Minimize Emissions', desc: 'Reduces methane greenhouse gases.' },
    { icon: <Leaf size={24} />, title: 'Climate-Smart Ag', desc: 'Sustainable farming practices.' },
  ];

  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-in">
          <h2>Why AWD?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Traditional rice cultivation practices rely on continuous flooding, resulting in excessive water consumption and increased methane emissions. The AWD approach offers a sustainable alternative by allowing controlled drying periods before irrigation resumes.
          </p>
        </div>

        <div className="grid grid-cols-3">
          {goals.map((goal, index) => (
            <div key={index} className={`card animate-fade-in delay-${(index % 3 + 1) * 100}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ 
                width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(24, 140, 85, 0.1)', 
                color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' 
              }}>
                {goal.icon}
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>{goal.title}</h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>{goal.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAWDSection;
