import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function ProfileCard() {
  const signatures = [
    '在代码与灵感之间游走',
    'Digital Alchemist',
    'Building things that matter',
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % signatures.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="glass-card p-6 rounded-lg w-full">
      <div className="flex flex-col items-center">
        <div className="w-[120px] h-[120px] mx-auto rounded-full border-4 border-teal-500 flex items-center justify-center mb-2">
          <User className="w-8 h-8 text-slate-200" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-semibold">Your Name</span>
          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
        </div>
        <div className="h-8 w-full mb-2 flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-slate-300"
            >
              {signatures[idx]}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <Badge variant="pixel">React</Badge>
          <Badge variant="pixel">TypeScript</Badge>
          <Badge variant="pixel">Design</Badge>
          <Badge variant="pixel">...</Badge>
        </div>
      </div>
    </section>
  );
}
