import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLocale } from '@/lib/i18n';
import { t } from '@/data/i18n';
import type { Locale } from '@/data/i18n';

export function Hero() {
  const [locale, setLocale] = useState<Locale>('en');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setLocale(getLocale());
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('zh-CN', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-8 md:py-12">
      <div className="float-decor top-0 left-0">01</div>
      
      <div className="flex items-center justify-between mb-8 text-xs font-mono text-[var(--color-text-muted)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>SYSTEM ONLINE {'//'} OWLTREE_V.2.0</span>
        </div>
        <div>
          {currentTime} <span className="text-[var(--color-accent-primary)]">{'//'} RETRO-FUTURE MODE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7">
          <motion.div 
            className="speech-bubble mb-6 inline-block transform -rotate-1 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-medium">"每一个界面都是一次穿越，每一个选择都是一段叙事。"</p>
          </motion.div>
          
          <motion.h1 
            className="glitch-title mb-6" 
            data-text="Owltree"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Owltree
          </motion.h1>
          
          <motion.p 
            className="text-lg mb-8 max-w-lg leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {t(locale, 'subtitle')}<br />
            <span className="font-mono text-sm text-[var(--color-accent-primary)]">{`> ${t(locale, 'pressKey')}...`}</span>
          </motion.p>
          
          <motion.div 
            className="tag-cloud mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span>🎮 {t(locale, 'games')}</span>
            <span>📝 {t(locale, 'notes')}</span>
            <span>🛠 {t(locale, 'tools')}</span>
            <span>📈 {t(locale, 'trends')}</span>
            <span>🔖 {t(locale, 'bookmarks')}</span>
            <span className="border-dashed">+ {t(locale, 'new')}</span>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button type="button" className="action-btn">
              ▶ {t(locale, 'startGame')}
            </button>
            <button 
              type="button" 
              className="action-btn"
              style={{ background: 'transparent', color: 'var(--color-text-primary)' }}
            >
              💾 {t(locale, 'continue')}
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          className="lg:col-span-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="character-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center text-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))' 
                }}
              >
                👤
              </div>
              <div>
                <h3 className="font-bold text-lg">Player_One</h3>
                <p className="text-xs text-[var(--color-text-muted)] font-mono">LV.12 {'//'} {t(locale, 'explorer')}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span>HP ({t(locale, 'creativity')})</span>
                  <span className="text-[var(--color-accent-primary)]">85/100</span>
                </div>
                <div className="pixel-bar">
                  <div className="pixel-bar-fill" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span>MP ({t(locale, 'focus')})</span>
                  <span style={{ color: 'var(--color-accent-tertiary)' }}>60/100</span>
                </div>
                <div className="pixel-bar">
                  <div 
                    className="pixel-bar-fill" 
                    style={{ 
                      width: '60%', 
                      background: `repeating-linear-gradient(90deg, var(--color-accent-tertiary) 0px, var(--color-accent-tertiary) 8px, #9aaa9a 8px, #9aaa9a 16px)` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span>EXP ({t(locale, 'progress')})</span>
                  <span style={{ color: 'var(--color-accent-secondary)' }}>LV.UP SOON</span>
                </div>
                <div className="pixel-bar">
                  <div 
                    className="pixel-bar-fill" 
                    style={{ 
                      width: '92%', 
                      background: `repeating-linear-gradient(90deg, var(--color-accent-secondary) 0px, var(--color-accent-secondary) 8px, #e4b584 8px, #e4b584 16px)` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t-2 border-black">
              <div className="text-center">
                <p className="text-2xl font-black text-[var(--color-accent-primary)]">12</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{t(locale, 'completed')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: 'var(--color-accent-tertiary)' }}>05</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{t(locale, 'inProgress')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: 'var(--color-accent-secondary)' }}>28</p>
                <p className="text-[10px] text-[var(--color-text-muted)]">{t(locale, 'bookmarked')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
