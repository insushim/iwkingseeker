'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Crown, X, Check } from 'lucide-react';

interface StudentCardProps {
  name: string;
  isRevealed?: boolean;
  isKing?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  teamColor?: 'blue' | 'amber';
  showCrown?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function StudentCard({
  name,
  isRevealed = false,
  isKing = false,
  isSelected = false,
  isDisabled = false,
  onClick,
  teamColor = 'blue',
  showCrown = false,
  size = 'md',
}: StudentCardProps) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const colorClasses = {
    blue: {
      bg: 'bg-blue-900/40 border-blue-700/50 hover:bg-blue-800/60',
      selected: 'bg-blue-600/60 border-blue-400 ring-2 ring-blue-400',
      revealed: 'bg-gray-800/40 border-gray-600/30',
    },
    amber: {
      bg: 'bg-amber-900/40 border-amber-700/50 hover:bg-amber-800/60',
      selected: 'bg-amber-600/60 border-amber-400 ring-2 ring-amber-400',
      revealed: 'bg-gray-800/40 border-gray-600/30',
    },
  };

  const colors = colorClasses[teamColor];

  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled || isRevealed}
      className={cn(
        'relative rounded-xl border font-bold transition-all cursor-pointer',
        sizeClasses[size],
        isRevealed
          ? colors.revealed
          : isSelected
            ? colors.selected
            : colors.bg,
        (isDisabled || isRevealed) && 'cursor-not-allowed opacity-60'
      )}
      whileHover={!isDisabled && !isRevealed ? { scale: 1.05 } : {}}
      whileTap={!isDisabled && !isRevealed ? { scale: 0.95 } : {}}
      layout
    >
      <span className={cn('text-white', isRevealed && 'text-gray-500 line-through')}>
        {name}
      </span>

      {showCrown && (
        <motion.div
          className="absolute -top-3 -right-2"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        </motion.div>
      )}

      {isRevealed && !isKing && (
        <motion.div
          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <X className="w-3 h-3 text-white" />
        </motion.div>
      )}

      {isKing && isRevealed && (
        <motion.div
          className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Crown className="w-4 h-4 text-white" />
        </motion.div>
      )}

      {isSelected && (
        <motion.div
          className="absolute -top-2 -left-2 bg-green-500 rounded-full p-0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Check className="w-3 h-3 text-white" />
        </motion.div>
      )}
    </motion.button>
  );
}
