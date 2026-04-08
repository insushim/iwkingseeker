'use client';

import { useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { useFullscreen } from '@/hooks/useFullscreen';
import { pickQuestion } from '@/lib/questionPicker';
import ScoreBoard from '@/components/game/ScoreBoard';
import TeamSplitter from '@/components/game/TeamSplitter';
import KingSelector from '@/components/game/KingSelector';
import RockPaperScissors from '@/components/game/RockPaperScissors';
import QuizDisplay from '@/components/game/QuizDisplay';
import KingGuess from '@/components/game/KingGuess';
import RoundResult from '@/components/game/RoundResult';
import GameOver from '@/components/game/GameOver';
import { Maximize, Minimize, Pause } from 'lucide-react';

export default function GamePlayPage() {
  const {
    phase,
    questionPool,
    usedQuestionIds,
    setCurrentQuestion,
    currentQuestion,
  } = useGameStore();
  const { isFullscreen, toggleFullscreen } = useFullscreen();

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
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] via-[#16082b] to-[#0d0520] flex flex-col">
      <div className="flex items-center justify-between px-4 py-2">
        {showScoreboard ? (
          <div className="flex-1">
            <ScoreBoard />
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400"
            title={isFullscreen ? '전체화면 종료' : '전체화면'}
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          {phase === 'TEAM_SPLIT' && <TeamSplitter key="team-split" />}
          {phase === 'KING_SELECT_A' && <KingSelector key="king-a" selectingTeam="team_a" />}
          {phase === 'KING_SELECT_B' && <KingSelector key="king-b" selectingTeam="team_b" />}
          {phase === 'RPS' && <RockPaperScissors key="rps" />}
          {phase === 'QUIZ' && <QuizDisplay key="quiz" />}
          {phase === 'GUESS_KING' && <KingGuess key="guess" />}
          {phase === 'ROUND_RESULT' && <RoundResult key="round-result" />}
          {phase === 'GAME_OVER' && <GameOver key="game-over" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
