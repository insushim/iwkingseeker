'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import StudentCard from './StudentCard';
import { Target, Check } from 'lucide-react';

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

  const handleConfirm = () => {
    if (!selected) return;
    guessKing(selected);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      <motion.div
        className="flex items-center gap-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Target className="w-8 h-8 text-yellow-400" />
        <h2
          className="text-3xl font-black text-white"
          style={{ fontFamily: "'Black Han Sans', sans-serif" }}
        >
          정답! 상대팀의 왕을 지목하세요!
        </h2>
      </motion.div>

      <p className="text-gray-400">
        <span className={currentAttacker === 'team_a' ? 'text-blue-400' : 'text-amber-400'}>
          {attackerName}
        </span>
        , {targetTeamData.name}의 왕은 누구일까요?
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {targetTeamData.students.map((student, i) => {
          const isRevealed = revealed.includes(student);
          return (
            <motion.div
              key={student}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <StudentCard
                name={student}
                teamColor={targetTeam === 'team_a' ? 'blue' : 'amber'}
                size="lg"
                isRevealed={isRevealed}
                isSelected={selected === student}
                isDisabled={isRevealed}
                onClick={() => !isRevealed && setSelected(student)}
              />
            </motion.div>
          );
        })}
      </div>

      <motion.button
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-2xl font-black text-xl disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ fontFamily: "'Black Han Sans', sans-serif" }}
        onClick={handleConfirm}
        disabled={!selected}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Check className="w-6 h-6" />
        이 학생이 왕이다!
      </motion.button>
    </div>
  );
}
