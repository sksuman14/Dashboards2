import { motion } from 'framer-motion';
import KitDistributionMap from '../components/KitDistributionMap';

export default function Deployments() {
  return (
    <main className="relative z-10 flex-grow min-h-screen pt-24 px-4 sm:px-8 pb-12 flex flex-col items-center">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-label font-bold text-xs tracking-widest uppercase mb-4">
            Deployment Reach
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter">
            Hardware Distribution <span className="text-primary">Map</span>
          </h1>
          <p className="font-body text-on-surface-variant text-sm sm:text-base mt-4 max-w-2xl">
            Explore our deployment network. See where our development kits and robotics modules have been provided across academic institutions.
          </p>
        </motion.div>
        
        <div className="w-full h-[70vh] rounded-3xl overflow-hidden glass-panel border border-white/10 relative">
          <KitDistributionMap />
        </div>
      </div>
    </main>
  );
}
