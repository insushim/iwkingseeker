'use client';

import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { playVictoryFanfare } from '@/lib/sounds';
import { Trophy, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GameOver() {
  const {
    teamA,
    teamB,
    targetScore,
    totalQuestionsAsked,
    totalCorrect,
    roundHistory,
    resetGame,
  } = useGameStore();

  const winner = teamA.score >= targetScore ? 'team_a' : 'team_b';
  const winnerData = winner === 'team_a' ? teamA : teamB;
  const winnerEmoji = winner === 'team_a' ? '🐲' : '🐯';
  const winnerColor = winner === 'team_a' ? 'text-blue-400' : 'text-amber-400';

  const accuracy = totalQuestionsAsked > 0
    ? Math.round((totalCorrect / totalQuestionsAsked) * 100)
    : 0;

  useEffect(() => {
    playVictoryFanfare();
  }, []);

  const confettiParticles = useMemo(() => {
    const colors = ['#fbbf24', '#ef4444', '#8b5cf6', '#3b82f6', '#10b981', '#f97316', '#ec4899'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2,
      color: colors[i % colors.length]!,
      size: Math.random() * 8 + 4,
    }));
  }, []);

  return (
    <div className="relative flex flex-col items-center gap-8 w-full overflow-hidden min-h-screen justify-center">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {confettiParticles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: '-20px',
              width: p.size,
              height: p.size * 1.5,
              backgroundColor: p.color,
            }}
            animate={{
              y: ['0vh', '110vh'],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
              x: [0, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
      >
        <Trophy className="w-24 h-24 text-yellow-400" />
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span className="text-6xl">{winnerEmoji}</span>
        <h1
          className={`text-5xl font-black mt-4 ${winnerColor}`}
          style={{ fontFamily: "'Black Han Sans', sans-serif" }}
        >
          {winnerData.name} 승리!
        </h1>
      </motion.div>

      <motion.div
        className="grid grid-cols-3 gap-6 bg-gray-800/80 rounded-2xl p-6 border border-gray-700/50"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="text-center">
          <p className="text-gray-400 text-sm">최종 점수</p>
          <p className="text-2xl font-black text-blue-400">{teamA.score}</p>
          <p className="text-sm text-gray-500">{teamA.name}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">총 라운드</p>
          <p className="text-2xl font-black text-purple-400">{roundHistory.length}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">최종 점수</p>
          <p className="text-2xl font-black text-amber-400">{teamB.score}</p>
          <p className="text-sm text-gray-500">{teamB.name}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">총 문제 수</p>
          <p className="text-2xl font-black text-white">{totalQuestionsAsked}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">정답률</p>
          <p className="text-2xl font-black text-green-400">{accuracy}%</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">정답 수</p>
          <p className="text-2xl font-black text-white">{totalCorrect}</p>
        </div>
      </motion.div>

      <motion.div
        className="flex gap-4"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.button
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold"
          onClick={resetGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          새 게임
        </motion.button>
        <Link href="/dashboard">
          <motion.div
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5" />
            대시보드로
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}
