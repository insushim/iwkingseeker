'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { useFullscreen } from '@/hooks/useFullscreen';
import { pickQuestion } from '@/lib/questionPicker';
import { playPhaseTransition } from '@/lib/sounds';
import { playBgm, stopBgm } from '@/lib/bgm';
import ScoreBoard from '@/components/game/ScoreBoard';
import TeamSplitter from '@/components/game/TeamSplitter';
import KingSelector from '@/components/game/KingSelector';
import RockPaperScissors from '@/components/game/RockPaperScissors';
import QuizDisplay from '@/components/game/QuizDisplay';
import KingGuess from '@/components/game/KingGuess';
import RoundResult from '@/components/game/RoundResult';
import WrongAnswer from '@/components/game/WrongAnswer';
import GameOver from '@/components/game/GameOver';
import { Maximize, Minimize, Volume2, VolumeX } from 'lucide-react';

export default function GamePlayPage() {
  const router = useRouter();
  const { phase, teamA, questionPool, usedQuestionIds, setCurrentQuestion, currentQuestion } = useGameStore();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const prevPhaseRef = useRef(phase);
  const [bgmOn, setBgmOn] = useState(true);

  useEffect(() => {
    if (phase === 'SETUP' || teamA.students.length === 0) {
      router.replace('/game/setup');
    }
  }, [phase, teamA.students.length, router]);

  // Phase change → sound + BGM
  useEffect(() => {
    if (prevPhaseRef.current !== phase && phase !== 'SETUP') {
      playPhaseTransition();
    }
    prevPhaseRef.current = phase;

    if (!bgmOn) { stopBgm(); return; }

    if (phase === 'QUIZ' || phase === 'GUESS_KING') {
      playBgm('quiz');
    } else if (phase === 'KING_SELECT_A' || phase === 'KING_SELECT_B') {
      playBgm('king');
    } else {
      stopBgm();
    }
  }, [phase, bgmOn]);

  // Cleanup BGM on unmount
  useEffect(() => () => stopBgm(), []);

  const toggleBgm = () => {
    setBgmOn((prev) => {
      if (prev) stopBgm();
      return !prev;
    });
  };

  const loadNextQuestion = useCallback(() => {
    if (phase === 'QUIZ' && !currentQuestion && questionPool.length > 0) {
      const next = pickQuestion(questionPool, usedQuestionIds);
      if (next) setCurrentQuestion(next);
    }
  }, [phase, currentQuestion, questionPool, usedQuestionIds, setCurrentQuestion]);

  useEffect(() => { loadNextQuestion(); }, [loadNextQuestion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F11') { e.preventDefault(); toggleFullscreen(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  const showScoreboard = !['SETUP', 'TEAM_SPLIT', 'GAME_OVER', 'WRONG_ANSWER'].includes(phase);

  return (
    <div className="h-screen bg-mesh bg-mesh-animated flex flex-col relative noise-overlay overflow-hidden">
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-3 py-1 shrink-0">
        {showScoreboard ? (
          <motion.div className="flex-1" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <ScoreBoard />
          </motion.div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex items-center gap-1 ml-2">
          <motion.button
            onClick={toggleBgm}
            className="p-2 glass rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title={bgmOn ? 'BGM 끄기' : 'BGM 켜기'}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {bgmOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </motion.button>
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

      {/* Main content - fill all remaining space */}
      <div className="relative z-10 flex-1 flex px-3 pb-2 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full flex items-center justify-center"
          >
            {phase === 'TEAM_SPLIT' && <TeamSplitter />}
            {phase === 'KING_SELECT_A' && <KingSelector selectingTeam="team_a" />}
            {phase === 'KING_SELECT_B' && <KingSelector selectingTeam="team_b" />}
            {phase === 'RPS' && <RockPaperScissors />}
            {phase === 'QUIZ' && <QuizDisplay />}
            {phase === 'WRONG_ANSWER' && <WrongAnswer />}
            {phase === 'GUESS_KING' && <KingGuess />}
            {phase === 'ROUND_RESULT' && <RoundResult />}
            {phase === 'GAME_OVER' && <GameOver />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
