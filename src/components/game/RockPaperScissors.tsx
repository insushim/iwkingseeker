'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { playCorrectSound } from '@/lib/sounds';
import { Crown } from 'lucide-react';

export default function RockPaperScissors() {
  const { teamA, teamB, setRPSResult } = useGameStore();

  const handleSelectWinner = (winner: 'team_a' | 'team_b') => {
    playCorrectSound();
    setRPSResult(winner);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <motion.h2
        className="text-3xl font-black text-white"
        style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        가위바위보!
      </motion.h2>

      <motion.p
        className="text-lg text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        양 팀 대표가 직접 가위바위보를 한 뒤, 이긴 팀을 선택하세요
      </motion.p>

      <div className="flex items-center gap-8">
        <motion.button
          className="flex flex-col items-center gap-4 px-12 py-8 bg-blue-900/40 border-2 border-blue-600/50 rounded-2xl hover:bg-blue-800/60 hover:border-blue-400 transition-all"
          onClick={() => handleSelectWinner('team_a')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-5xl">🐲</span>
          <span className="text-2xl font-black text-blue-400">{teamA.name}</span>
          <div className="flex items-center gap-2 text-yellow-400">
            <Crown className="w-5 h-5" />
            <span className="font-bold">승리!</span>
          </div>
        </motion.button>

        <motion.span
          className="text-4xl font-bold text-gray-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          VS
        </motion.span>

        <motion.button
          className="flex flex-col items-center gap-4 px-12 py-8 bg-amber-900/40 border-2 border-amber-600/50 rounded-2xl hover:bg-amber-800/60 hover:border-amber-400 transition-all"
          onClick={() => handleSelectWinner('team_b')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-5xl">🐯</span>
          <span className="text-2xl font-black text-amber-400">{teamB.name}</span>
          <div className="flex items-center gap-2 text-yellow-400">
            <Crown className="w-5 h-5" />
            <span className="font-bold">승리!</span>
          </div>
        </motion.button>
      </div>

      <motion.p
        className="text-sm text-gray-500 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        선공팀이 먼저 퀴즈를 풀 수 있습니다
      </motion.p>
    </div>
  );
}
