'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { cn } from '@/lib/utils';

export default function ScoreBoard() {
  const { teamA, teamB, currentAttacker, targetScore } = useGameStore();

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50">
      <TeamScore
        name={teamA.name}
        score={teamA.score}
        emoji="🐲"
        isActive={currentAttacker === 'team_a'}
        colorClass="text-blue-400"
        bgClass="bg-blue-500/20"
        targetScore={targetScore}
      />

      <div className="flex flex-col items-center mx-6">
        <span className="text-2xl font-bold text-gray-500">VS</span>
        <span className="text-xs text-gray-600">목표 {targetScore}점</span>
      </div>

      <TeamScore
        name={teamB.name}
        score={teamB.score}
        emoji="🐯"
        isActive={currentAttacker === 'team_b'}
        colorClass="text-amber-400"
        bgClass="bg-amber-500/20"
        targetScore={targetScore}
      />
    </div>
  );
}

function TeamScore({
  name,
  score,
  emoji,
  isActive,
  colorClass,
  bgClass,
  targetScore,
}: {
  name: string;
  score: number;
  emoji: string;
  isActive: boolean;
  colorClass: string;
  bgClass: string;
  targetScore: number;
}) {
  return (
    <motion.div
      className={cn(
        'flex-1 flex items-center gap-4 px-5 py-3 rounded-xl transition-all',
        isActive && 'ring-2 ring-yellow-400/60',
        bgClass
      )}
      animate={isActive ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
    >
      <span className="text-4xl">{emoji}</span>
      <div className="flex flex-col">
        <span className={cn('text-lg font-bold', colorClass)}>{name}</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: targetScore }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'w-3 h-3 rounded-full',
                i < score ? 'bg-yellow-400' : 'bg-gray-600'
              )}
              animate={i < score ? { scale: [1, 1.3, 1] } : {}}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      </div>
      <div className="ml-auto">
        <AnimatePresence mode="wait">
          <motion.span
            key={score}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={cn('text-5xl font-black', colorClass)}
            style={{ fontFamily: "'Black Han Sans', sans-serif" }}
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </div>
      {isActive && (
        <motion.div
          className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          공격!
        </motion.div>
      )}
    </motion.div>
  );
}
