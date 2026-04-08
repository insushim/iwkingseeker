'use client';

import { motion } from 'framer-motion';

interface CrownAnimationProps {
  studentName: string;
  onComplete?: () => void;
}

export default function CrownAnimation({ studentName, onComplete }: CrownAnimationProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <span className="text-[120px] block">👑</span>
        </motion.div>

        <motion.h2
          className="text-4xl font-black text-yellow-400"
          style={{ fontFamily: "'Black Han Sans', sans-serif" }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          왕을 찾았다!
        </motion.h2>

        <motion.p
          className="text-2xl text-white font-bold"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {studentName} 학생이 왕이었습니다!
        </motion.p>

        <Particles />

        <motion.button
          className="mt-8 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-lg"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
        >
          계속하기
        </motion.button>
      </div>
    </motion.div>
  );
}

function Particles() {
  const colors = ['#fbbf24', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#10b981'];
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 600,
    y: (Math.random() - 0.5) * 600,
    color: colors[i % colors.length]!,
    size: Math.random() * 10 + 4,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: '50%',
            top: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
          }}
          transition={{
            duration: 1.5,
            delay: p.delay + 0.3,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}
