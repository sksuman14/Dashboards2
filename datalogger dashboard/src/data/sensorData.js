import { Network, Save, BatteryCharging, ShieldCheck } from 'lucide-react';

export const dataLogger = {
  title: "Data",
  highlightText: "Logger",
  subtitle: "Reliable data logging & seamless connectivity",
  eyebrow: "4G Dual SIM · IP65 · Solar ready",
  bannerPoints: [
    "4G Dual SIM with multi-protocol support",
    "Advanced power management with solar charging",
    "Robust design with IP65 rating",
  ],
  stats: [
    { val: "30 days", lbl: "Data backup" },
    { val: "4G+GPS", lbl: "Connectivity" },
    { val: "IP65", lbl: "Protection" },
  ],
  features: [
    "OpenCPU architecture with Quectel EC200U LTE Cat 1 module",
    "Built-in LTE and GPS antennas for connectivity and tracking",
    "Dual SIM switching for reliable network redundancy",
    "Supports QuecPython for rapid IoT application development",
    "Multi-protocol interfaces: UART, I²C, SPI, RS232, and RS485",
  ],
  applications: [
    "Remote weather monitoring stations",
    "Smart agriculture and irrigation management",
    "Industrial and environmental monitoring",
    "Smart cities and IoT projects",
    "Cold storage management",
  ],
  specifications: [
    { label: "Processor Module", value: "Quectel EC200U LTE Cat 1" },
    { label: "Input Voltage Range", value: "5V – 12V DC" },
    { label: "Operating Temperature", value: "-30°C to +75°C" },
    { label: "Communication Interfaces", value: "3× UART, 2× I²C, 1× SPI" },
    { label: "Industrial Interfaces", value: "RS232 and RS485" },
    { label: "Wireless Connectivity", value: "LTE (4G), GPS" },
    { label: "Storage Support", value: "microSD card slot (up to 32GB)" },
    { label: "Power Management", value: "MPPT solar charging via CN3791, Li-ion battery, and USB-C input" },
  ],
  techHighlights: [
    {
      value: "4G/LTE",
      label: "Dual SIM Connectivity",
      description: "Equipped with dual-SIM fallback and manual routing for mission-critical reliability in remote connectivity environments."
    },
    {
      value: "30 Days",
      label: "On-board Data Resilience",
      description: "High-capacity internal storage ensures your primary data remains safe and retrievable during infrastructure outages or server downtime."
    },
    {
      value: "5-16V",
      label: "Industrial Voltage Support",
      description: "Optimized for industrial power supplies and solar charging systems with built-in voltage regulation and surge protection."
    },
  ],
  imagePath: "/datalogger_nobg.png",
  email: "communications@annam.ai",
  datasheetKey: "DataLogger",
  datasheetUrl: "/pdfs/Data_logger_datasheet.pdf",
  detailedFeatures: [
    {
      title: "Advanced Connectivity",
      description: "4G Dual SIM support with multi-protocol interfaces including RS485, UART, and I2C for universal sensor integration.",
      icon: Network // Used lucide-react equivalent for Icons.lan_outlined
    },
    {
      title: "Resilient Data Backup",
      description: "Internal data logging with 25–30 days of storage. Reliable data persistence even during connectivity outages.",
      icon: Save // Used lucide-react equivalent for Icons.save_outlined
    },
    {
      title: "Smart Power Mgmt",
      description: "Optimized for solar charging with ultra-low power sleep modes. Ideal for remote stations and off-grid deployments.",
      icon: BatteryCharging // Used lucide-react equivalent for Icons.battery_charging_full_outlined
    },
    {
      title: "Industrial Integrity",
      description: "Rugged IP65 enclosure designed for extreme environmental stress. Built-in LTE/GPS antennas and wide voltage input.",
      icon: ShieldCheck // Used lucide-react equivalent for Icons.verified_user_outlined
    },
  ],
  detailedApplications: [
    {
      title: "Remote weather monitoring",
      description: "High-fidelity data collection for synoptic stations, agriculture networks, and environmental research.",
      tag: "Meteorology"
    },
    {
      title: "Smart Irrigation",
      description: "Water management optimization with real-time soil moisture and weather data integration for precise farming.",
      tag: "AgriTech"
    },
    {
      title: "Industrial IoT",
      description: "Monitoring factory environments, cold storage, and complex machinery health with multi-protocol sensor support.",
      tag: "Industrial"
    },
    {
      title: "Urban Flood Tracking",
      description: "Early warning systems for urban areas, measuring rainfall and water levels to mitigate disaster risks.",
      tag: "Safety"
    },
  ],
};
