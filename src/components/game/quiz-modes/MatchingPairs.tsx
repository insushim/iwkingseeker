'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  showResult: boolean;
  isCorrect: boolean;
  onAnswer: (answer: string) => void;
}

const CARD_BACK_COLORS = [
  'from-purple-600 to-indigo-900',
  'from-pink-600 to-rose-900',
  'from-cyan-600 to-blue-900',
  'from-amber-500 to-orange-900',
];

const CARD_FRONT_COLORS = [
  'from-rose-500 to-rose-700',
  'from-sky-500 to-sky-700',
  'from-emerald-500 to-emerald-700',
  'from-amber-400 to-amber-600',
];

export default function MatchingPairs({
  options,
  correctAnswer,
  selectedAnswer,
  showResult,
  isCorrect,
  onAnswer,
}: Props) {
  const [flipped, setFlipped] = useState<boolean[]>(() => options.map(() => false));

  useEffect(() => {
    setFlipped(options.map(() => false));
  }, [options]);

  const handleClick = (option: string, i: number) => {
    if (showResult) return;
    if (!flipped[i]) {
      setFlipped((prev) => {
        const next = [...prev];
        next[i] = true;
        return next;
      });
      return;
    }
    onAnswer(option);
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-4">
      <div className="grid grid-cols-2 gap-5 w-full max-w-3xl">
        {options.map((option, i) => {
          const isFlipped = flipped[i] || showResult;
          const isThisCorrect = option === correctAnswer;
          const isThisSelected = option === selectedAnswer;

          return (
            <div key={i} className="relative h-40" style={{ perspective: '1000px' }}>
              <motion.div
                className="relative w-full h-full cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 140 }}
                onClick={() => handleClick(option, i)}
                whileHover={!showResult && !isFlipped ? { scale: 1.03, y: -4 } : {}}
                whileTap={!showResult ? { scale: 0.97 } : {}}
              >
                {/* Back */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl border-4 border-white/20 flex items-center justify-center text-7xl font-black text-white/80 shadow-2xl bg-gradient-to-br',
                    CARD_BACK_COLORS[i % CARD_BACK_COLORS.length]
                  )}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  ?
                </div>
                {/* Front */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl border-4 flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-2xl px-4 text-center leading-tight bg-gradient-to-br',
                    showResult && isThisCorrect
                      ? 'from-green-400 to-green-700 border-green-200 ring-4 ring-green-300/40'
                      : showResult && isThisSelected && !isCorrect
                      ? 'from-red-500 to-red-800 border-red-200'
                      : `${CARD_FRONT_COLORS[i % CARD_FRONT_COLORS.length]} border-white/30`
                  )}
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  {option}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="text-center text-base text-purple-300/90 font-bold">
        🃏 카드를 뒤집어 답을 골라라! (한 번 더 누르면 선택)
      </div>
    </div>
  );
}
