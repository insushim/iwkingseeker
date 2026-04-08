'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import CrownAnimation from './CrownAnimation';
import { playKingFoundSound } from '@/lib/sounds';

export default function RoundResult() {
  const {
    lastGuessResult,
    lastGuessedStudent,
    startNewRound,
    setPhase,
    phase,
  } = useGameStore();

  useEffect(() => {
    if (lastGuessResult === 'found') {
      playKingFoundSound();
    }
  }, [lastGuessResult]);

  if (lastGuessResult === 'found' && phase !== 'GAME_OVER') {
    return (
      <AnimatePresence>
        <CrownAnimation
          studentName={lastGuessedStudent ?? ''}
          onComplete={() => startNewRound()}
        />
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-8xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring' }}
      >
        ❌
      </motion.div>

      <h2
        className="text-3xl font-black text-gray-300"
        style={{ fontFamily: "'Black Han Sans', sans-serif" }}
      >
        왕이 아닙니다!
      </h2>

      <p className="text-xl text-gray-400">
        <span className="text-white font-bold">{lastGuessedStudent}</span> 학생은 왕이 아닙니다.
        게임을 계속합니다!
      </p>

      <motion.button
        className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold text-lg"
        onClick={() => setPhase('QUIZ')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        다음 문제로!
      </motion.button>
    </motion.div>
  );
}
