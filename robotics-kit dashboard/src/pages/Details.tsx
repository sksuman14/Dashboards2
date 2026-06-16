import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { kitsData } from '../data';
import { sendEmail } from '../utils';

export default function Details() {
  const { id } = useParams<{ id: string }>();
  const product = kitsData.find((item) => item.datasheetKey === id);
  const [activeTab, setActiveTab] = useState<'features' | 'applications' | 'specifications'>('features');

  if (!product) {
    return (
      <div className="flex-grow flex items-center justify-center flex-col gap-6 relative z-10 pt-40 pb-32">
        <h1 className="text-4xl text-white font-headline font-bold">Product not found</h1>
        <Link to="/" className="text-primary hover:text-white transition-colors">
          &larr; Back to Platform
        </Link>
      </div>
    );
  }

  const fullTitle = `${product.title.trim()} ${product.highlightText.trim()}`.replace(/\s+/g, ' ');

  return (
    <main className="relative min-h-screen bg-surface pt-32 pb-32">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <Link to="/" className="inline-flex items-center text-on-surface-variant hover:text-white transition-colors font-label text-sm uppercase tracking-widest gap-2 group mb-8 px-4 py-2 rounded-full border border-white/10 bg-surface-container/50">
          <span className="material-symbols-outlined transform group-hover:-translate-x-1 transition-transform text-lg">&larr;</span>
          Back to Catalog
        </Link>

        {/* Top Section: Split Layout for Image and Basic Info */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-12 lg:mb-20 items-stretch">
          
          {/* Left: Image Box */}
          <div className="w-full lg:w-1/2 bg-[#0A1322] rounded-3xl flex flex-col items-center justify-center p-6 sm:p-12 relative min-h-[300px] sm:min-h-[400px] border border-white/5">
            <motion.img 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              src={`/${product.imagePath}`} 
              alt={fullTitle}
              className="relative z-10 w-full h-auto max-h-[400px] object-contain drop-shadow-2xl"
            />
          </div>

          {/* Right: Info and Actions */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-3 py-1 rounded-sm bg-white/5 border-l-2 border-primary/50 text-white/60 font-label text-xs tracking-widest uppercase mb-6">
                Module ID: {product.datasheetKey}
              </div>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
                {product.title} <br/><span className="text-primary">{product.highlightText}</span>
              </h1>
              <p className="font-body text-xl text-on-surface-variant leading-relaxed mb-10 border-l-2 border-white/10 pl-4 py-1">
                {product.subtitle}
              </p>

              <div className="flex flex-col gap-2 mb-12">
                {product.bannerPoints.map((point, i) => (
                  <div key={i} className="flex items-center gap-4 bg-surface-container/50 py-3 px-5 rounded-lg hover:bg-surface-container transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0"></div>
                    <p className="font-body text-white/90 text-[15px]">{point}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 flex-wrap">
                <button 
                  onClick={() => sendEmail(
                    product.email, 
                    'Product Enquiry', 
                    `Hello, I am interested in your ${product.title.trim()} ${product.highlightText.trim()} product.`
                  )}
                  className="bg-transparent hover:bg-white/5 text-white/90 font-label font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full border border-white/10 transition-all flex items-center gap-3 w-full sm:w-auto justify-center"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary/70">mail</span>
                  Enquire
                </button>
                <a 
                  href={product.pdfPath ? `/${product.pdfPath}` : '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-transparent hover:bg-white/5 text-white/90 font-label font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full border border-white/10 transition-all flex items-center gap-3 w-full sm:w-auto justify-center"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary/70">description</span>
                  Datasheet
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section: Full Width Data Tabs */}
        <div className="w-full">
          <div className="flex justify-between sm:justify-start gap-1 sm:gap-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto hide-scrollbar w-full">
            {(['features', 'applications', 'specifications'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-label font-bold text-[10px] sm:text-sm uppercase tracking-normal sm:tracking-widest px-1 sm:px-4 py-2 transition-colors whitespace-nowrap ${
                  activeTab === tab 
                  ? 'text-primary border-b-2 border-primary -mb-[18px]' 
                  : 'text-on-surface-variant hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[400px] pt-4">
            {activeTab === 'features' && (
              <motion.ul initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 list-none p-0 max-w-4xl">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 rounded-lg bg-surface-container/30 border border-white/5 hover:bg-surface-container/60 transition-colors">
                    <span className="material-symbols-outlined text-primary/50 text-sm mt-0.5">check_circle</span>
                    <span className="font-body text-on-surface-variant text-[15px] leading-relaxed">{feature}</span>
                  </li>
                ))}
              </motion.ul>
            )}

            {activeTab === 'applications' && (
              <motion.ul initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 list-none p-0 max-w-4xl">
                {product.applications.map((app, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 rounded-lg bg-surface-container/30 border border-white/5 hover:bg-surface-container/60 transition-colors">
                    <span className="material-symbols-outlined text-primary/50 text-sm mt-0.5">check_circle</span>
                    <span className="font-body text-on-surface-variant text-[15px] leading-relaxed">{app}</span>
                  </li>
                ))}
              </motion.ul>
            )}

            {activeTab === 'specifications' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 max-w-5xl">
                {product.specifications.map((spec, i) => {
                  const parts = spec.split(':');
                  const label = parts[0];
                  const value = parts.slice(1).join(':');

                  return (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-start justify-between p-5 border-b border-white/5 hover:bg-surface-container/40 transition-colors gap-4">
                      <span className="font-label text-white/50 text-sm tracking-wider uppercase sm:w-1/3 shrink-0 pt-0.5">{label}</span>
                      <span className="font-body text-on-surface-variant text-[15px] sm:w-2/3 leading-relaxed">{value || label}</span>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
