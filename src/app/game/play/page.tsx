'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { useFullscreen } from '@/hooks/useFullscreen';
import { pickQuestion } from '@/lib/questionPicker';
import { playPhaseTransition } from '@/lib/sounds';
import ScoreBoard from '@/components/game/ScoreBoard';
import TeamSplitter from '@/components/game/TeamSplitter';
import KingSelector from '@/components/game/KingSelector';
import RockPaperScissors from '@/components/game/RockPaperScissors';
import QuizDisplay from '@/components/game/QuizDisplay';
import KingGuess from '@/components/game/KingGuess';
import RoundResult from '@/components/game/RoundResult';
import GameOver from '@/components/game/GameOver';
import { Maximize, Minimize } from 'lucide-react';
import { useRef } from 'react';

export default function GamePlayPage() {
  const router = useRouter();
  const {
    phase,
    teamA,
    questionPool,
    usedQuestionIds,
    setCurrentQuestion,
    currentQuestion,
  } = useGameStore();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const prevPhaseRef = useRef(phase);

  useEffect(() => {
    if (phase === 'SETUP' || teamA.students.length === 0) {
      router.replace('/game/setup');
    }
  }, [phase, teamA.students.length, router]);

  // Play transition sound on phase change
  useEffect(() => {
    if (prevPhaseRef.current !== phase && phase !== 'SETUP') {
      playPhaseTransition();
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  const loadNextQuestion = useCallback(() => {
    if (phase === 'QUIZ' && !currentQuestion && questionPool.length > 0) {
      const next = pickQuestion(questionPool, usedQuestionIds);
      if (next) {
        setCurrentQuestion(next);
      }
    }
  }, [phase, currentQuestion, questionPool, usedQuestionIds, setCurrentQuestion]);

  useEffect(() => {
    loadNextQuestion();
  }, [loadNextQuestion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  const showScoreboard = !['SETUP', 'TEAM_SPLIT', 'GAME_OVER'].includes(phase);

  return (
    <div className="min-h-screen bg-mesh bg-mesh-animated flex flex-col relative noise-overlay">
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-2">
        {showScoreboard ? (
          <motion.div
            className="flex-1"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ScoreBoard />
          </motion.div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex items-center gap-2 ml-4">
          <motion.button
            onClick={toggleFullscreen}
            className="p-2 glass rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isFullscreen ? '전체화면 종료' : '전체화면'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full flex items-center justify-center"
          >
            {phase === 'TEAM_SPLIT' && <TeamSplitter />}
            {phase === 'KING_SELECT_A' && <KingSelector selectingTeam="team_a" />}
            {phase === 'KING_SELECT_B' && <KingSelector selectingTeam="team_b" />}
            {phase === 'RPS' && <RockPaperScissors />}
            {phase === 'QUIZ' && <QuizDisplay />}
            {phase === 'GUESS_KING' && <KingGuess />}
            {phase === 'ROUND_RESULT' && <RoundResult />}
            {phase === 'GAME_OVER' && <GameOver />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
