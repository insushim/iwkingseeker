'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import StudentCard from './StudentCard';
import { playKingSelectSuspense, playTeamSelect } from '@/lib/sounds';
import { EyeOff, Crown, Check, Lock } from 'lucide-react';

interface KingSelectorProps {
  selectingTeam: 'team_a' | 'team_b';
}

export default function KingSelector({ selectingTeam }: KingSelectorProps) {
  const { teamA, teamB, selectKing, setPhase } = useGameStore();
  const [selectedKing, setSelectedKing] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const selectingTeamData = selectingTeam === 'team_a' ? teamA : teamB;
  // 자기팀의 왕을 선택 (자기팀 학생 목록에서 왕을 고름)
  const targetTeamData = selectingTeamData;
  const targetTeamKey: 'team_a' | 'team_b' = selectingTeam;

  useEffect(() => {
    playKingSelectSuspense();
  }, []);

  const handleSelect = (student: string) => {
    playTeamSelect();
    setSelectedKing(student);
  };

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
          className="p-6 rounded-full glass-strong glow-yellow"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <Crown
            className="w-16 h-16 text-yellow-400"
            style={{ filter: 'drop-shadow(0 0 15px rgba(250,204,21,0.5))' }}
          />
        </motion.div>
        <h2
          className="text-3xl font-black text-gradient-gold"
          style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        >
          왕이 선택되었습니다!
        </h2>
        <div className="flex items-center gap-2 text-gray-400">
          <Lock className="w-4 h-4" />
          <p>다른 학생들은 누가 왕인지 모릅니다</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full w-full">
      {/* Warning banner */}
      <motion.div
        className="flex items-center gap-3 glass rounded-xl px-6 py-3"
        style={{ boxShadow: '0 0 20px rgba(250,204,21,0.1)' }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <EyeOff className="w-6 h-6 text-yellow-400" />
        </motion.div>
        <span className="text-yellow-300 font-bold text-lg">
          다른 학생들은 눈을 감아주세요!
        </span>
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-3xl font-black text-white text-center"
        style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <span className={selectingTeam === 'team_a' ? 'text-blue-400' : 'text-amber-400'}>
          {selectingTeamData.name}
        </span>
        {' '}대표 학생!
        <br />
        우리 팀의 왕을 선택하세요
      </motion.h2>

      {/* Student grid */}
      <div className="flex flex-wrap justify-center gap-3">
        <AnimatePresence>
          {targetTeamData.students.map((student, i) => (
            <motion.div
              key={student}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <StudentCard
                name={student}
                teamColor={selectingTeam === 'team_a' ? 'blue' : 'amber'}
                size="lg"
                isSelected={selectedKing === student}
                showCrown={selectedKing === student}
                onClick={() => handleSelect(student)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirm button */}
      <motion.button
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white rounded-2xl font-black text-xl disabled:opacity-40 disabled:cursor-not-allowed transition-shadow hover:shadow-lg hover:shadow-yellow-500/20"
        style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        onClick={handleConfirm}
        disabled={!selectedKing}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Check className="w-6 h-6" />
        왕 선택 완료!
      </motion.button>
    </div>
  );
}
