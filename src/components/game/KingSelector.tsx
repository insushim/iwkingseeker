'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import StudentCard from './StudentCard';
import { EyeOff, Crown, Check } from 'lucide-react';

interface KingSelectorProps {
  selectingTeam: 'team_a' | 'team_b';
}

export default function KingSelector({ selectingTeam }: KingSelectorProps) {
  const { teamA, teamB, selectKing, setPhase } = useGameStore();
  const [selectedKing, setSelectedKing] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectingTeamData = selectingTeam === 'team_a' ? teamA : teamB;
  const targetTeamData = selectingTeam === 'team_a' ? teamB : teamA;
  const targetTeamKey: 'team_a' | 'team_b' = selectingTeam === 'team_a' ? 'team_b' : 'team_a';

  const handleConfirm = () => {
    if (!selectedKing) return;
    selectKing(targetTeamKey, selectedKing);
    setConfirmed(true);

    setTimeout(() => {
      if (selectingTeam === 'team_a') {
        setPhase('KING_SELECT_B');
      } else {
        setPhase('RPS');
      }
    }, 2000);
  };

  if (confirmed) {
    return (
      <motion.div
        className="flex flex-col items-center gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <Crown className="w-20 h-20 text-yellow-400" />
        </motion.div>
        <h2
          className="text-3xl font-black text-yellow-400"
          style={{ fontFamily: "'Black Han Sans', sans-serif" }}
        >
          왕이 선택되었습니다! (비밀)
        </h2>
        <p className="text-gray-400">다른 학생들은 누가 왕인지 모릅니다</p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      <motion.div
        className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-6 py-3"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <EyeOff className="w-6 h-6 text-yellow-400" />
        <span className="text-yellow-300 font-bold text-lg">
          다른 학생들은 눈을 감아주세요!
        </span>
      </motion.div>

      <motion.h2
        className="text-2xl font-black text-white text-center"
        style={{ fontFamily: "'Black Han Sans', sans-serif" }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className={selectingTeam === 'team_a' ? 'text-blue-400' : 'text-amber-400'}>
          {selectingTeamData.name}
        </span>
        {' '}대표 학생!
        <br />
        <span className={selectingTeam === 'team_a' ? 'text-amber-400' : 'text-blue-400'}>
          {targetTeamData.name}
        </span>
        의 왕을 선택하세요
      </motion.h2>

      <div className="flex flex-wrap justify-center gap-3">
        <AnimatePresence>
          {targetTeamData.students.map((student, i) => (
            <motion.div
              key={student}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <StudentCard
                name={student}
                teamColor={targetTeamKey === 'team_a' ? 'blue' : 'amber'}
                size="lg"
                isSelected={selectedKing === student}
                showCrown={selectedKing === student}
                onClick={() => setSelectedKing(student)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white rounded-2xl font-black text-xl disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ fontFamily: "'Black Han Sans', sans-serif" }}
        onClick={handleConfirm}
        disabled={!selectedKing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Check className="w-6 h-6" />
        왕 선택 완료!
      </motion.button>
    </div>
  );
}
