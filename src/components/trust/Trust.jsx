'use client';

import React from 'react';
import { motion } from "framer-motion";

const Trust = () => {
  // এখানে আপনার ইমেজ বা লোগোর পাথ বসান
  const row1 = [
  
  ];

  const row2 = [
   
  ];

  // লুপ ঠিক রাখার জন্য ডুপ্লিকেট করা
  const firstRow = [...row1, ...row1];
  const secondRow = [...row2, ...row2];

  return (
    <section id='trust' className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-2xl font-bold text-slate-400 uppercase tracking-widest">
          আমাদের ওপর আস্থা রেখেছেন যারা
        </h2>
      </div>

      <div className="flex flex-col gap-10">
        {/* প্রথম সারি: বাম দিকে ঘুরবে */}
        <div className="flex overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
          <motion.div 
            className="flex shrink-0 gap-12 items-center"
            animate={{ x: [0, -1000] }}
            transition={{
              x: { repeat: Infinity, duration: 25, ease: "linear" }
            }}
          >
            {firstRow.map((img, i) => (
              <img key={i} src={img} alt="partner" className="h-12 md:h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 object-contain w-32" />
            ))}
          </motion.div>
        </div>

        {/* দ্বিতীয় সারি: ডান দিকে ঘুরবে (Reverse) */}
        <div className="flex overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
          <motion.div 
            className="flex shrink-0 gap-12 items-center"
            animate={{ x: [-1000, 0] }}
            transition={{
              x: { repeat: Infinity, duration: 30, ease: "linear" }
            }}
          >
            {secondRow.map((img, i) => (
              <img key={i} src={img} alt="partner" className="h-12 md:h-16 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 object-contain w-32" />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Trust;