'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';
import Timer from './Timer';
import { playCorrectSound, playWrongSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { Sparkles, ThumbsUp, ThumbsDown } from 'lucide-react';

const OPTION_STYLES = [
  { bg: 'bg-red-600/80 hover:bg-red-500/90 border-red-400/40', glow: 'hover:shadow-red-500/20 hover:shadow-lg', icon: '1' },
  { bg: 'bg-blue-600/80 hover:bg-blue-500/90 border-blue-400/40', glow: 'hover:shadow-blue-500/20 hover:shadow-lg', icon: '2' },
  { bg: 'bg-green-600/80 hover:bg-green-500/90 border-green-400/40', glow: 'hover:shadow-green-500/20 hover:shadow-lg', icon: '3' },
  { bg: 'bg-yellow-600/80 hover:bg-yellow-500/90 border-yellow-400/40', glow: 'hover:shadow-yellow-500/20 hover:shadow-lg', icon: '4' },
];

function ResultOverlay({ isCorrect }: { isCorrect: boolean }) {
  const particles = useMemo(() =>
    isCorrect
      ? Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: (Math.random() - 0.5) * 400,
          y: (Math.random() - 0.5) * 400,
          delay: Math.random() * 0.3,
          size: 4 + Math.random() * 8,
          color: ['#fbbf24', '#22c55e', '#3b82f6', '#a855f7'][i % 4],
        }))
      : [],
    [isCorrect]
  );

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Result badge */}
      <motion.div
        className={cn(
          'relative text-7xl font-black px-14 py-8 rounded-3xl',
          isCorrect
            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white glow-green'
            : 'bg-gradient-to-br from-red-500 to-rose-600 text-white glow-red'
        )}
        style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {isCorrect ? '정답!' : '오답!'}
        {isCorrect && (
          <Sparkles className="absolute -top-4 -right-4 w-10 h-10 text-yellow-300" />
        )}
      </motion.div>

      {/* Celebration particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: '50%',
            top: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0 }}
          transition={{ duration: 1, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  );
}

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
  const attackerEmoji = currentAttacker === 'team_a' ? '🐲' : '🐯';

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
    <div className="flex flex-col items-center gap-6 w-full max-w-6xl mx-auto px-4">
      {/* Top bar: Attacker + Timer */}
      <div className="flex items-center justify-between w-full">
        <motion.div
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-lg glass',
            currentAttacker === 'team_a'
              ? 'text-blue-400 glass-blue'
              : 'text-amber-400 glass-amber'
          )}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-2xl">{attackerEmoji}</span>
          <span>공격: {attackerName}</span>
        </motion.div>

        <Timer
          seconds={timerSeconds}
          isActive={!showResult}
          onTimeUp={handleTimeUp}
          size={75}
        />
      </div>

      {/* Question card */}
      <motion.div
        className="w-full glass-strong rounded-2xl p-8 relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-60" />
        <p className="text-sm text-purple-400/80 mb-3 font-medium">
          {currentQuestion.subject} &middot; {currentQuestion.unit}
        </p>
        <h3 className="text-3xl md:text-4xl font-bold text-white leading-relaxed">
          {currentQuestion.question_text}
        </h3>
      </motion.div>

      {/* Multiple choice */}
      {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentQuestion.options.map((option, i) => {
            const style = OPTION_STYLES[i]!;
            const isThisCorrect = option === currentQuestion.correct_answer;
            const isThisSelected = option === selectedAnswer;

            return (
              <motion.button
                key={i}
                className={cn(
                  'relative p-6 rounded-xl border text-left text-xl font-bold text-white transition-all overflow-hidden',
                  showResult && isThisCorrect
                    ? 'bg-green-600 border-green-400/60 ring-2 ring-green-400/40 glow-green'
                    : showResult && isThisSelected && !isCorrect
                      ? 'bg-red-600/80 border-red-400/40 glow-red'
                      : `${style.bg} ${style.glow}`,
                  showResult && 'pointer-events-none'
                )}
                onClick={() => handleAnswer(option)}
                whileHover={!showResult ? { scale: 1.02, y: -2 } : {}}
                whileTap={!showResult ? { scale: 0.98 } : {}}
                initial={{ x: i % 2 === 0 ? -30 : 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
              >
                <span className="mr-3 text-2xl font-black opacity-40">{style.icon}</span>
                {option}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* O/X */}
      {currentQuestion.question_type === 'ox' && (
        <div className="flex gap-8 w-full justify-center">
          {['O', 'X'].map((choice) => {
            const isThisCorrect = choice === currentQuestion.correct_answer;
            const isThisSelected = choice === selectedAnswer;

            return (
              <motion.button
                key={choice}
                className={cn(
                  'w-36 h-36 rounded-full text-7xl font-black border-4 transition-all',
                  showResult && isThisCorrect
                    ? 'bg-green-600 border-green-400 glow-green'
                    : showResult && isThisSelected && !isCorrect
                      ? 'bg-red-600/80 border-red-400 glow-red'
                      : choice === 'O'
                        ? 'bg-blue-600/70 hover:bg-blue-500/80 border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/20'
                        : 'bg-red-600/70 hover:bg-red-500/80 border-red-400/40 hover:shadow-lg hover:shadow-red-500/20',
                  showResult && 'pointer-events-none'
                )}
                onClick={() => handleAnswer(choice)}
                whileHover={!showResult ? { scale: 1.1 } : {}}
                whileTap={!showResult ? { scale: 0.9 } : {}}
              >
                {choice}
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Short answer / Fill blank */}
      {(currentQuestion.question_type === 'short_answer' ||
        currentQuestion.question_type === 'fill_blank') && (
        <div className="flex flex-col items-center gap-5 w-full">
          <p className="text-gray-300 text-lg">
            학생의 답을 들은 후 판정해주세요
          </p>
          <div className="flex gap-5">
            <motion.button
              className="flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl text-2xl font-black transition-shadow hover:shadow-lg hover:shadow-green-500/20"
              style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
              onClick={() => handleTeacherJudge(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={showResult}
            >
              <ThumbsUp className="w-7 h-7" />
              정답!
            </motion.button>
            <motion.button
              className="flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-2xl font-black transition-shadow hover:shadow-lg hover:shadow-red-500/20"
              style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
              onClick={() => handleTeacherJudge(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={showResult}
            >
              <ThumbsDown className="w-7 h-7" />
              오답!
            </motion.button>
          </div>
        </div>
      )}

      {/* Result overlay */}
      <AnimatePresence>
        {showResult && <ResultOverlay isCorrect={isCorrect} />}
      </AnimatePresence>

      {/* Explanation */}
      {showResult && isCorrect && currentQuestion.explanation && (
        <motion.div
          className="w-full glass rounded-xl p-4"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-sm text-gray-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            {currentQuestion.explanation}
          </p>
        </motion.div>
      )}

      {/* Teacher hint */}
      <div className="fixed bottom-2 left-2 z-50">
        <details className="cursor-pointer select-none">
          <summary className="text-[10px] text-gray-700/50 hover:text-gray-500">
            hint
          </summary>
          <p className="text-[11px] text-gray-500 bg-gray-900/95 px-2.5 py-1.5 rounded-lg mt-0.5 backdrop-blur-sm">
            {currentQuestion.correct_answer}
          </p>
        </details>
      </div>
    </div>
  );
}
