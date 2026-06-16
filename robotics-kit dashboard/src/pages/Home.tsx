import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { kitsData } from '../data';

export default function Home() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeItem = kitsData[activeIndex];
  const fullTitle = `${activeItem.title.trim()} ${activeItem.highlightText.trim()}`.replace(/\s+/g, ' ');

  return (
    <main className="relative z-10 flex-grow min-h-screen pt-24 px-4 sm:px-8 pb-12 flex items-center tech-grid">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col lg:flex-row min-h-[80vh] lg:h-[80vh] gap-8">
        
        {/* Left Side: Interactive Navigation List */}
        <div className="w-full lg:w-1/3 flex flex-col lg:h-full border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-8 overflow-y-auto hide-scrollbar">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-label font-bold text-xs tracking-widest uppercase mb-6">
              Hardware Catalog
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-black text-white leading-tight tracking-tighter">
              Development Kits &<br />
              <span className="text-primary">Robotics</span>
            </h1>
          </motion.div>

          <div className="flex flex-col gap-2">
            {kitsData.map((item, index) => {
              const isActive = index === activeIndex;
              const itemTitle = `${item.title.trim()} ${item.highlightText.trim()}`.replace(/\s+/g, ' ');

              return (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`relative p-6 text-left rounded-2xl transition-all duration-500 overflow-hidden group cursor-pointer ${
                    isActive ? 'bg-surface-container border border-primary/30 shadow-[0_0_30px_rgba(0,240,255,0.1)]' : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_#00F0FF]" 
                    />
                  )}
                  <h3 className={`font-headline text-xl font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-on-surface-variant group-hover:text-white/80'}`}>
                    {itemTitle}
                  </h3>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${item.datasheetKey}`);
                    }}
                    className={`mt-2 text-sm font-label uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-primary' : 'text-transparent group-hover:text-primary/50'}`}
                  >
                    View Module &rarr;
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Dynamic Presentation Area */}
        <div className="w-full lg:w-2/3 lg:h-full min-h-[500px] relative rounded-3xl overflow-hidden glass-panel flex flex-col items-center justify-center p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full h-full flex flex-col items-center justify-center"
            >
              {/* Massive background watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03]">
                <h2 className="font-headline font-black text-6xl sm:text-8xl md:text-[12rem] whitespace-nowrap text-white text-center">
                  {activeItem.datasheetKey}
                </h2>
              </div>

              {/* Glowing pedestal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-primary/20 blur-[100px] rounded-[100%] pointer-events-none"></div>

              {/* Product Image */}
              <motion.img
                src={`/${activeItem.imagePath}`}
                alt={fullTitle}
                className="w-auto h-auto max-w-[80%] max-h-[50%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 cursor-pointer mb-12"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onClick={() => navigate(`/product/${activeItem.datasheetKey}`)}
              />

              {/* Quick Details & CTA */}
              <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end w-full max-w-3xl z-20 gap-6 lg:gap-8 text-center lg:text-left mt-8 lg:mt-0">
                <div className="max-w-lg">
                  <h3 className="font-headline text-2xl sm:text-3xl font-bold text-white mb-2">{fullTitle}</h3>
                  <p className="font-body text-on-surface-variant text-sm sm:text-base line-clamp-2">{activeItem.subtitle}</p>
                </div>
                
                <button
                  onClick={() => navigate(`/product/${activeItem.datasheetKey}`)}
                  className="shrink-0 bg-surface-container hover:bg-white/10 text-primary font-label font-bold text-sm uppercase tracking-widest px-6 py-4 rounded-full border border-white/10 transition-all duration-300 flex items-center gap-3 group w-full lg:w-auto justify-center"
                >
                  Explore Details
                  <span className="material-symbols-outlined transform group-hover:translate-x-2 transition-transform">arrow_forward</span>
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </main>
  );
}
