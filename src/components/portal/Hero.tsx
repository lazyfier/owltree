import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative min-h-[70vh] flex flex-col justify-end pb-16">
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-6 items-end">
          {/* Left - Main Title */}
          <div className="col-span-12 lg:col-span-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="mb-4"
            >
              <span className="label-sans">Visual Novel Navigation</span>
            </motion.div>

            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Owltree
            </motion.h1>

            <motion.div 
              className="mt-8 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                一个关于选择、记忆与叙事的空间。<br />
                记录思绪的轨迹，收藏时间的碎片。
              </p>
            </motion.div>
          </div>

          {/* Right - Minimal Info Card */}
          <div className="col-span-12 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="space-y-6 lg:pb-4"
            >
              <div className="text-right lg:text-left">
                <span className="label-sans block mb-1">Location</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  35°41′22″N<br />139°41′30″E
                </span>
              </div>

              <div className="divider" />

              <div className="text-right lg:text-left">
                <span className="label-sans block mb-1">Local Time</span>
                <Clock />
              </div>

              <div className="divider" />

              <div className="text-right lg:text-left">
                <span className="label-sans block mb-1">Weather</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Clear, 18°C
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Clock() {
  const [time, setTime] = React.useState('');
  
  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="text-sm tabular-nums" style={{ color: 'var(--text-secondary)' }}>
      {time}
    </span>
  );
}

import React from 'react';
