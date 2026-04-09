'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import StudentCard from './StudentCard';
import { shuffleArray } from '@/lib/utils';
import { playShuffleSound, playButtonClick } from '@/lib/sounds';
import { Shuffle, Check, ArrowLeftRight } from 'lucide-react';

export default function TeamSplitter() {
  const { teamA, teamB, setPhase, initGame, grade, subject, unit, targetScore, timerSeconds } = useGameStore();
  const [localTeamA, setLocalTeamA] = useState<string[]>(teamA.students);
  const [localTeamB, setLocalTeamB] = useState<string[]>(teamB.students);
  const [teamAName, setTeamAName] = useState(teamA.name);
  const [teamBName, setTeamBName] = useState(teamB.name);

  const handleShuffle = () => {
    playShuffleSound();
    const all = [...localTeamA, ...localTeamB];
    const shuffled = shuffleArray(all);
    const mid = Math.ceil(shuffled.length / 2);
    setLocalTeamA(shuffled.slice(0, mid));
    setLocalTeamB(shuffled.slice(mid));
  };

  const moveToTeamB = (student: string) => {
    playButtonClick();
    setLocalTeamA((prev) => prev.filter((s) => s !== student));
    setLocalTeamB((prev) => [...prev, student]);
  };

  const moveToTeamA = (student: string) => {
    playButtonClick();
    setLocalTeamB((prev) => prev.filter((s) => s !== student));
    setLocalTeamA((prev) => [...prev, student]);
  };

  const handleConfirm = () => {
    if (localTeamA.length < 2 || localTeamB.length < 2) return;
    initGame({
      grade,
      subject,
      unit,
      targetScore,
      timerSeconds,
      teamAName,
      teamBName,
      teamAStudents: localTeamA,
      teamBStudents: localTeamB,
    });
    setPhase('KING_SELECT_A');
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-5xl mx-auto">
      <motion.h2
        className="text-3xl font-black text-white"
        style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        팀을 나누세요!
      </motion.h2>

      <motion.button
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-bold text-lg transition-shadow hover:shadow-lg hover:shadow-purple-500/20"
        onClick={handleShuffle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Shuffle className="w-5 h-5" />
        랜덤 배정
      </motion.button>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 w-full">
        {/* Team A */}
        <motion.div
          className="glass-blue rounded-2xl p-5"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🐲</span>
            <input
              value={teamAName}
              onChange={(e) => setTeamAName(e.target.value)}
              className="bg-transparent text-xl font-bold text-blue-400 border-b border-blue-600/50 outline-none w-full focus:border-blue-400 transition-colors"
            />
            <span className="text-sm text-blue-500/70 font-medium shrink-0">{localTeamA.length}명</span>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[60px]">
            <AnimatePresence mode="popLayout">
              {localTeamA.map((student) => (
                <motion.div
                  key={student}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <StudentCard
                    name={student}
                    teamColor="blue"
                    size="sm"
                    onClick={() => moveToTeamB(student)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Arrow */}
        <div className="flex items-center">
          <motion.div
            className="p-2 rounded-full glass"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowLeftRight className="w-6 h-6 text-gray-500" />
          </motion.div>
        </div>

        {/* Team B */}
        <motion.div
          className="glass-amber rounded-2xl p-5"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🐯</span>
            <input
              value={teamBName}
              onChange={(e) => setTeamBName(e.target.value)}
              className="bg-transparent text-xl font-bold text-amber-400 border-b border-amber-600/50 outline-none w-full focus:border-amber-400 transition-colors"
            />
            <span className="text-sm text-amber-500/70 font-medium shrink-0">{localTeamB.length}명</span>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[60px]">
            <AnimatePresence mode="popLayout">
              {localTeamB.map((student) => (
                <motion.div
                  key={student}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <StudentCard
                    name={student}
                    teamColor="amber"
                    size="sm"
                    onClick={() => moveToTeamA(student)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.p
        className="text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        학생 이름을 클릭하면 반대 팀으로 이동합니다
      </motion.p>

      <motion.button
        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-black text-xl disabled:opacity-40 disabled:cursor-not-allowed transition-shadow hover:shadow-lg hover:shadow-purple-500/20"
        style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        onClick={handleConfirm}
        disabled={localTeamA.length < 2 || localTeamB.length < 2}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Check className="w-6 h-6" />
        팀 확정!
      </motion.button>
    </div>
  );
}
