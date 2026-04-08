'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import Timer from './Timer';
import { playCorrectSound, playWrongSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';

const OPTION_COLORS = [
  'bg-red-600 hover:bg-red-500 border-red-400',
  'bg-blue-600 hover:bg-blue-500 border-blue-400',
  'bg-green-600 hover:bg-green-500 border-green-400',
  'bg-yellow-600 hover:bg-yellow-500 border-yellow-400',
];

export default function QuizDisplay() {
  const {
    currentQuestion,
    currentAttacker,
    teamA,
    teamB,
    timerSeconds,
    submitAnswer,
  } = useGameStore();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const attackerName = currentAttacker === 'team_a' ? teamA.name : teamB.name;

  const handleAnswer = useCallback(
    (answer: string) => {
      if (showResult || !currentQuestion) return;
      const correct = answer === currentQuestion.correct_answer;
      setSelectedAnswer(answer);
      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
        playCorrectSound();
      } else {
        playWrongSound();
      }

      setTimeout(() => {
        submitAnswer(answer, correct);
        setSelectedAnswer(null);
        setShowResult(false);
      }, 2500);
    },
    [showResult, currentQuestion, submitAnswer]
  );

  const handleTimeUp = useCallback(() => {
    if (!showResult) {
      handleAnswer('__timeout__');
    }
  }, [showResult, handleAnswer]);

  const handleTeacherJudge = useCallback(
    (correct: boolean) => {
      if (showResult || !currentQuestion) return;
      setIsCorrect(correct);
      setShowResult(true);

      if (correct) {
        playCorrectSound();
      } else {
        playWrongSound();
      }

      setTimeout(() => {
        submitAnswer(correct ? currentQuestion.correct_answer : '__wrong__', correct);
        setSelectedAnswer(null);
        setShowResult(false);
      }, 2500);
    },
    [showResult, currentQuestion, submitAnswer]
  );

  if (!currentQuestion) return null;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between w-full">
        <motion.div
          className={cn(
            'px-4 py-2 rounded-xl font-bold text-lg',
            currentAttacker === 'team_a'
              ? 'bg-blue-600/30 text-blue-400'
              : 'bg-amber-600/30 text-amber-400'
          )}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          현재 공격: {attackerName}
        </motion.div>

        <Timer
          seconds={timerSeconds}
          isActive={!showResult}
          onTimeUp={handleTimeUp}
          size={70}
        />
      </div>

      <motion.div
        className="w-full bg-gray-800/80 rounded-2xl border border-gray-600/50 p-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <p className="text-sm text-gray-400 mb-2">
          {currentQuestion.subject} &gt; {currentQuestion.unit}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
          {currentQuestion.question_text}
        </h3>
      </motion.div>

      {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentQuestion.options.map((option, i) => (
            <motion.button
              key={i}
              className={cn(
                'p-5 rounded-xl border-2 text-left text-lg font-bold text-white transition-all',
                showResult && option === currentQuestion.correct_answer
                  ? 'bg-green-600 border-green-400 ring-4 ring-green-400/40'
                  : showResult && option === selectedAnswer && !isCorrect
                    ? 'bg-red-600 border-red-400'
                    : OPTION_COLORS[i],
                showResult && 'pointer-events-none'
              )}
              onClick={() => handleAnswer(option)}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              initial={{ x: i % 2 === 0 ? -20 : 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="mr-3 text-2xl font-black opacity-60">{i + 1}</span>
              {option}
            </motion.button>
          ))}
        </div>
      )}

      {currentQuestion.question_type === 'ox' && (
        <div className="flex gap-6 w-full justify-center">
          {['O', 'X'].map((choice) => (
            <motion.button
              key={choice}
              className={cn(
                'w-40 h-40 rounded-full text-7xl font-black border-4',
                showResult && choice === currentQuestion.correct_answer
                  ? 'bg-green-600 border-green-400'
                  : showResult && choice === selectedAnswer && !isCorrect
                    ? 'bg-red-600 border-red-400'
                    : choice === 'O'
                      ? 'bg-blue-600 hover:bg-blue-500 border-blue-400'
                      : 'bg-red-600 hover:bg-red-500 border-red-400',
                showResult && 'pointer-events-none'
              )}
              onClick={() => handleAnswer(choice)}
              whileHover={!showResult ? { scale: 1.1 } : {}}
              whileTap={!showResult ? { scale: 0.9 } : {}}
            >
              {choice}
            </motion.button>
          ))}
        </div>
      )}

      {(currentQuestion.question_type === 'short_answer' ||
        currentQuestion.question_type === 'fill_blank') && (
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="text-gray-300 text-lg">
            학생의 답을 들은 후 판정해주세요
          </p>
          <p className="text-sm text-gray-500">
            정답: <span className="text-yellow-400 font-bold">{currentQuestion.correct_answer}</span>
          </p>
          <div className="flex gap-4">
            <motion.button
              className="px-10 py-5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-2xl font-black"
              onClick={() => handleTeacherJudge(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={showResult}
            >
              정답!
            </motion.button>
            <motion.button
              className="px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-2xl font-black"
              onClick={() => handleTeacherJudge(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={showResult}
            >
              오답!
            </motion.button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showResult && (
          <motion.div
            className={cn(
              'fixed inset-0 z-40 flex items-center justify-center pointer-events-none',
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={cn(
                'text-6xl font-black px-12 py-6 rounded-3xl',
                isCorrect
                  ? 'bg-green-500/90 text-white'
                  : 'bg-red-500/90 text-white'
              )}
              style={{ fontFamily: "'Black Han Sans', sans-serif" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {isCorrect ? '정답!' : '오답!'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showResult && currentQuestion.explanation && (
        <motion.div
          className="w-full bg-gray-800/60 rounded-xl p-4 border border-gray-600/30"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-sm text-gray-400">
            💡 {currentQuestion.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}
