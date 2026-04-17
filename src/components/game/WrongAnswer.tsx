'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { ArrowRightLeft } from 'lucide-react';
import TeamEmoji from './TeamEmoji';

export default function WrongAnswer() {
  const { currentAttacker, teamA, teamB, setPhase } = useGameStore();

  const attackerName = currentAttacker === 'team_a' ? teamA.name : teamB.name;
  const attackerColor = currentAttacker === 'team_a' ? 'text-blue-400' : 'text-amber-400';

  // 2초 후 자동으로 퀴즈로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('QUIZ');
    }, 2000);
    return () => clearTimeout(timer);
  }, [setPhase]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <div className="p-6 rounded-full glass-strong" style={{ boxShadow: '0 0 30px rgba(147,51,234,0.3)' }}>
          <ArrowRightLeft className="w-16 h-16 text-purple-400" />
        </div>
      </motion.div>

      <motion.h2
        className="text-5xl font-black text-white"
        style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        공수 교대!
      </motion.h2>

      <motion.div
        className="flex items-center gap-4 glass-strong rounded-2xl px-8 py-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <TeamEmoji team={currentAttacker} size={56} />
        <div>
          <p className="text-gray-400 text-lg">다음 공격</p>
          <p className={`text-3xl font-black ${attackerColor}`}>{attackerName}</p>
        </div>
      </motion.div>

      <motion.div
        className="flex gap-1 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-purple-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>
    </div>
  );
}
