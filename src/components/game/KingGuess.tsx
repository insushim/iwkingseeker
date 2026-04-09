'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import StudentCard from './StudentCard';
import { playButtonClick } from '@/lib/sounds';
import { Target, Check, Crosshair } from 'lucide-react';

export default function KingGuess() {
  const {
    currentAttacker,
    teamA,
    teamB,
    revealedA,
    revealedB,
    guessKing,
  } = useGameStore();
  const [selected, setSelected] = useState<string | null>(null);

  const targetTeam = currentAttacker === 'team_a' ? 'team_b' : 'team_a';
  const targetTeamData = targetTeam === 'team_a' ? teamA : teamB;
  const revealed = targetTeam === 'team_a' ? revealedA : revealedB;
  const attackerName = currentAttacker === 'team_a' ? teamA.name : teamB.name;
  const attackerColor = currentAttacker === 'team_a' ? 'text-blue-400' : 'text-amber-400';

  const handleSelect = (student: string) => {
    playButtonClick();
    setSelected(student);
  };

  const handleConfirm = () => {
    if (!selected) return;
    guessKing(selected);
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

      {/* Student grid */}
      <div className="flex flex-wrap justify-center gap-3">
        {targetTeamData.students.map((student, i) => {
          const isRevealed = revealed.includes(student);
          return (
            <motion.div
              key={student}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.04 }}
            >
              <StudentCard
                name={student}
                teamColor={targetTeam === 'team_a' ? 'blue' : 'amber'}
                size="lg"
                isRevealed={isRevealed}
                isSelected={selected === student}
                isDisabled={isRevealed}
                onClick={() => !isRevealed && handleSelect(student)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Confirm button */}
      <motion.button
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-2xl font-black text-xl disabled:opacity-40 disabled:cursor-not-allowed transition-shadow hover:shadow-lg hover:shadow-red-500/20"
        style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        onClick={handleConfirm}
        disabled={!selected}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Target className="w-6 h-6" />
        이 학생이 왕이다!
      </motion.button>
    </div>
  );
}
