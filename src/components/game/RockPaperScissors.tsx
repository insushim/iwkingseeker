'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import { RPS_EMOJI, type RPSChoice } from '@/lib/constants';
import { playRPSBeat, playRPSReveal, playCorrectSound } from '@/lib/sounds';

type RPSStage = 'ready' | 'select_a' | 'select_b' | 'countdown' | 'reveal' | 'result';

function getRPSWinner(a: RPSChoice, b: RPSChoice): 'a' | 'b' | 'draw' {
  if (a === b) return 'draw';
  if (
    (a === 'rock' && b === 'scissors') ||
    (a === 'scissors' && b === 'paper') ||
    (a === 'paper' && b === 'rock')
  ) return 'a';
  return 'b';
}

export default function RockPaperScissors() {
  const { teamA, teamB, setRPSResult } = useGameStore();
  const [stage, setStage] = useState<RPSStage>('ready');
  const [choiceA, setChoiceA] = useState<RPSChoice | null>(null);
  const [choiceB, setChoiceB] = useState<RPSChoice | null>(null);
  const [countdown, setCountdown] = useState(3);
  const [winner, setWinner] = useState<'a' | 'b' | 'draw' | null>(null);

  const startRound = useCallback(() => {
    setChoiceA(null);
    setChoiceB(null);
    setWinner(null);
    setStage('select_a');
  }, []);

  useEffect(() => {
    if (stage === 'ready') {
      const timer = setTimeout(startRound, 1500);
      return () => clearTimeout(timer);
    }
  }, [stage, startRound]);

  useEffect(() => {
    if (stage === 'countdown') {
      if (countdown <= 0) {
        setStage('reveal');
        playRPSReveal();
        return;
      }
      playRPSBeat();
      const timer = setTimeout(() => setCountdown((c) => c - 1), 700);
      return () => clearTimeout(timer);
    }
  }, [stage, countdown]);

  useEffect(() => {
    if (stage === 'reveal' && choiceA && choiceB) {
      const result = getRPSWinner(choiceA, choiceB);
      setWinner(result);
      const timer = setTimeout(() => {
        setStage('result');
        if (result !== 'draw') {
          playCorrectSound();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stage, choiceA, choiceB]);

  const handleSelect = (team: 'a' | 'b', choice: RPSChoice) => {
    if (team === 'a') {
      setChoiceA(choice);
      setStage('select_b');
    } else {
      setChoiceB(choice);
      setCountdown(3);
      setStage('countdown');
    }
  };

  const handleContinue = () => {
    if (winner === 'draw') {
      startRound();
      return;
    }
    setRPSResult(winner === 'a' ? 'team_a' : 'team_b');
  };

  const rpsButtons = (team: 'a' | 'b') => (
    <div className="flex gap-4">
      {(['rock', 'paper', 'scissors'] as RPSChoice[]).map((choice) => (
        <motion.button
          key={choice}
          className="text-6xl p-4 bg-gray-800 rounded-2xl hover:bg-gray-700 border-2 border-gray-600 hover:border-purple-500"
          onClick={() => handleSelect(team, choice)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {RPS_EMOJI[choice]}
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <motion.h2
        className="text-3xl font-black text-white"
        style={{ fontFamily: "'Black Han Sans', sans-serif" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        가위바위보!
      </motion.h2>

      <div className="flex items-center gap-12 w-full justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-xl font-bold text-blue-400">🐲 {teamA.name}</span>
          <AnimatePresence mode="wait">
            {stage === 'select_a' && (
              <motion.div
                key="select_a"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {rpsButtons('a')}
                <p className="text-center text-yellow-300 mt-2 font-bold">선택하세요!</p>
              </motion.div>
            )}
            {(stage === 'select_b' || stage === 'countdown') && choiceA && (
              <motion.div
                key="hidden_a"
                className="text-6xl p-4 bg-gray-800 rounded-2xl border-2 border-blue-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ❓
              </motion.div>
            )}
            {(stage === 'reveal' || stage === 'result') && choiceA && (
              <motion.div
                key="reveal_a"
                className="text-7xl"
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ type: 'spring' }}
              >
                {RPS_EMOJI[choiceA]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center">
          {stage === 'countdown' && (
            <motion.span
              key={countdown}
              className="text-7xl font-black text-yellow-400"
              style={{ fontFamily: "'Black Han Sans', sans-serif" }}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              {countdown > 0 ? countdown : '!'}
            </motion.span>
          )}
          {stage === 'ready' && (
            <motion.span
              className="text-2xl text-gray-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              준비중...
            </motion.span>
          )}
          {stage !== 'countdown' && stage !== 'ready' && (
            <span className="text-4xl font-bold text-gray-500">VS</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <span className="text-xl font-bold text-amber-400">🐯 {teamB.name}</span>
          <AnimatePresence mode="wait">
            {stage === 'select_b' && (
              <motion.div
                key="select_b"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {rpsButtons('b')}
                <p className="text-center text-yellow-300 mt-2 font-bold">선택하세요!</p>
              </motion.div>
            )}
            {stage === 'countdown' && choiceB && (
              <motion.div
                key="hidden_b"
                className="text-6xl p-4 bg-gray-800 rounded-2xl border-2 border-amber-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ❓
              </motion.div>
            )}
            {(stage === 'reveal' || stage === 'result') && choiceB && (
              <motion.div
                key="reveal_b"
                className="text-7xl"
                initial={{ rotateY: -180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ type: 'spring' }}
              >
                {RPS_EMOJI[choiceB]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {stage === 'result' && winner && (
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h3
              className="text-3xl font-black"
              style={{ fontFamily: "'Black Han Sans', sans-serif" }}
            >
              {winner === 'draw' ? (
                <span className="text-gray-400">무승부! 다시!</span>
              ) : (
                <span className={winner === 'a' ? 'text-blue-400' : 'text-amber-400'}>
                  🎉 {winner === 'a' ? teamA.name : teamB.name}가 선공입니다!
                </span>
              )}
            </h3>
            <motion.button
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg"
              onClick={handleContinue}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {winner === 'draw' ? '다시 가위바위보!' : '게임 시작!'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
