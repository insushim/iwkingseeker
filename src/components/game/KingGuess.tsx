'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import StudentCard from './StudentCard';
import { playButtonClick, playKingSelectSuspense } from '@/lib/sounds';
import { Target, Crosshair, Heart } from 'lucide-react';

export default function KingGuess() {
  const {
    currentAttacker,
    teamA,
    teamB,
    revealedA,
    revealedB,
    kingSelectorA,
    kingSelectorB,
    guessKing,
  } = useGameStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [isSuspense, setIsSuspense] = useState(false);

  const targetTeam = currentAttacker === 'team_a' ? 'team_b' : 'team_a';
  const targetTeamData = targetTeam === 'team_a' ? teamA : teamB;
  const revealed = targetTeam === 'team_a' ? revealedA : revealedB;
  const kingSelector = targetTeam === 'team_a' ? kingSelectorA : kingSelectorB;
  const attackerName = currentAttacker === 'team_a' ? teamA.name : teamB.name;
  const attackerColor = currentAttacker === 'team_a' ? 'text-blue-400' : 'text-amber-400';

  const handleSelect = (student: string) => {
    if (isSuspense) return;
    playButtonClick();
    setSelected(student);
  };

  const handleConfirm = () => {
    if (!selected || isSuspense) return;
    setIsSuspense(true);
    playKingSelectSuspense();
    setTimeout(() => playKingSelectSuspense(), 1100);
    setTimeout(() => {
      guessKing(selected);
    }, 2400);
  };

  const unrevealed = targetTeamData.students.filter((s) => !revealed.includes(s));

  return (
    <div className="flex flex-col items-center gap-6 w-full w-full">
      {/* Header */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Crosshair className="w-8 h-8 text-yellow-400" />
        </motion.div>
        <h2
          className="text-4xl font-black text-white"
          style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        >
          정답! 상대팀의 왕을 지목하세요!
        </h2>
      </motion.div>

      <motion.p
        className="text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span className={attackerColor}>{attackerName}</span>
        , {targetTeamData.name}의 왕은 누구일까요?
        {unrevealed.length < targetTeamData.students.length && (
          <span className="ml-2 text-gray-500 text-sm">
            (남은 후보: {unrevealed.length}명)
          </span>
        )}
      </motion.p>

      {/* 왕을 뽑은 사람 힌트 */}
      {kingSelector && (
        <motion.div
          className="flex items-center gap-2 glass rounded-xl px-5 py-2.5"
          style={{ boxShadow: '0 0 15px rgba(168,85,247,0.15)' }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <span className="text-2xl">🕵️</span>
          <span className="text-purple-300 font-bold text-lg">
            <span className="text-white">{kingSelector}</span> 학생이 왕을 뽑았습니다
          </span>
        </motion.div>
      )}

      {/* Student grid */}
      <div className="flex flex-wrap justify-center gap-3">
        {targetTeamData.students.map((student, i) => {
          const isRevealed = revealed.includes(student);
          const isTarget = isSuspense && selected === student;
          const isDimmed = isSuspense && selected !== student;
          return (
            <motion.div
              key={student}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                isTarget
                  ? {
                      scale: [1, 1.08, 1, 1.1, 1, 1.12, 1, 1.15, 1.2],
                      x: [0, -2, 2, -3, 3, -3, 3, -4, 0],
                      rotate: [0, -1, 1, -1.5, 1.5, -2, 2, -2, 0],
                      opacity: 1,
                    }
                  : isDimmed
                    ? { scale: 0.92, opacity: 0.35 }
                    : { scale: 1, opacity: 1 }
              }
              transition={
                isTarget
                  ? { duration: 2.2, ease: 'easeInOut', times: [0, 0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 0.9, 1] }
                  : isDimmed
                    ? { duration: 0.4 }
                    : { delay: 0.15 + i * 0.04 }
              }
              style={
                isTarget
                  ? { filter: 'drop-shadow(0 0 20px rgba(250,204,21,0.7))' }
                  : undefined
              }
            >
              <StudentCard
                name={student}
                teamColor={targetTeam === 'team_a' ? 'blue' : 'amber'}
                size="lg"
                isRevealed={isRevealed}
                isSelected={selected === student}
                isDisabled={isRevealed || isSuspense}
                onClick={() => !isRevealed && handleSelect(student)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* 두근두근 서스펜스 오버레이 */}
      <AnimatePresence>
        {isSuspense && (
          <motion.div
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-950/40 border border-red-500/40"
            style={{ boxShadow: '0 0 30px rgba(239,68,68,0.3)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1, 1.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="w-7 h-7 text-red-400 fill-red-400" />
            </motion.div>
            <motion.span
              className="text-2xl font-black text-red-200"
              style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
              animate={{ opacity: [1, 0.6, 1, 0.6, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              두근... 두근...
            </motion.span>
            <motion.div
              animate={{ scale: [1, 1.3, 1, 1.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
            >
              <Heart className="w-7 h-7 text-red-400 fill-red-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm button */}
      <motion.button
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-2xl font-black text-xl disabled:opacity-40 disabled:cursor-not-allowed transition-shadow hover:shadow-lg hover:shadow-red-500/20"
        style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        onClick={handleConfirm}
        disabled={!selected || isSuspense}
        whileHover={!isSuspense ? { scale: 1.05 } : {}}
        whileTap={!isSuspense ? { scale: 0.95 } : {}}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Target className="w-6 h-6" />
        {isSuspense ? '결과 공개 중...' : '이 학생이 왕이다!'}
      </motion.button>
    </div>
  );
}
