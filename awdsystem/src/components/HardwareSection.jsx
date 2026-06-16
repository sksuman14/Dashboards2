import React from 'react';
import { Cpu, Settings2, Waves, Thermometer, Database } from 'lucide-react';

const HardwareSection = () => {
  return (
    <section id="hardware" className="section">
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Hardware Components</h2>
        <p style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '700px', margin: '0 auto 4rem' }}>
          Ruggedized, ultra-low power hardware engineered for harsh agricultural environments.
        </p>

        <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
          
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Waves className="text-primary" size={28} style={{ color: 'var(--primary)' }}/>
              <h3 style={{ margin: 0 }}>Dual-Float Switch & Tube</h3>
            </div>
            <p>A 30 cm PVC field water tube (15 cm diameter, half perforated) enables subsurface monitoring. The dual-float assembly eliminates analog sensor fouling:</p>
            <ul style={{ paddingLeft: '1.5rem', listStyle: 'disc', marginTop: '1rem' }}>
              <li><strong>Lower Float (-15 cm):</strong> Detects drying threshold, triggers irrigation.</li>
              <li><strong>Upper Float (+5 cm):</strong> Detects flood depth, terminates irrigation.</li>
            </ul>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Cpu className="text-primary" size={28} style={{ color: 'var(--primary)' }}/>
              <h3 style={{ margin: 0 }}>BLE Sensor Nodes</h3>
            </div>
            <p>Powered by nRF52832 Bluetooth Low Energy microcontrollers (Arm Cortex-M4, 64 MHz).</p>
            <ul style={{ paddingLeft: '1.5rem', listStyle: 'disc', marginTop: '1rem' }}>
              <li>Bluetooth 5.x support with Integrated NFC.</li>
              <li>Deep-sleep operation consuming only 1.9–7.3 µA.</li>
              <li>Operational life of several years on a single battery.</li>
            </ul>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Thermometer className="text-primary" size={28} style={{ color: 'var(--primary)' }}/>
              <h3 style={{ margin: 0 }}>Sensors & Storage</h3>
            </div>
            <ul style={{ paddingLeft: '1.5rem', listStyle: 'disc' }}>
              <li><strong>Temp & Humidity:</strong> Sensirion SHT40 sensor.</li>
              <li><strong>Motion & Tamper:</strong> LIS3DH three-axis accelerometer.</li>
              <li><strong>Data Storage:</strong> External W25Q16 flash memory for robust logging.</li>
            </ul>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <Settings2 className="text-primary" size={28} style={{ color: 'var(--primary)' }}/>
              <h3 style={{ margin: 0 }}>Actuation System</h3>
            </div>
            <p>Latching solenoid valves require power <em>only</em> during switching events, ensuring near-zero standby power.</p>
            <ul style={{ paddingLeft: '1.5rem', listStyle: 'disc', marginTop: '1rem' }}>
              <li>Reliable hydraulic control.</li>
              <li>Battery-operated for years.</li>
              <li>Motorized valves supported for larger installations.</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HardwareSection;
