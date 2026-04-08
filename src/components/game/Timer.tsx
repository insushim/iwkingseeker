'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { playCountdownTick, playTimerWarning } from '@/lib/sounds';

interface TimerProps {
  seconds: number;
  isActive: boolean;
  onTimeUp: () => void;
  size?: number;
}

export default function Timer({ seconds, isActive, onTimeUp, size = 80 }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / seconds;
  const strokeDashoffset = circumference * (1 - progress);

  const handleTimeUp = useCallback(() => {
    onTimeUp();
  }, [onTimeUp]);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0 && isActive) {
        handleTimeUp();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 5 && next > 0) {
          playCountdownTick();
        }
        if (next === 3) {
          playTimerWarning();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleTimeUp]);

  const color =
    timeLeft > seconds * 0.5
      ? '#22c55e'
      : timeLeft > seconds * 0.25
        ? '#eab308'
        : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth="4"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </svg>
      <motion.span
        className="absolute text-xl font-black text-white"
        animate={timeLeft <= 5 ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {timeLeft}
      </motion.span>
    </div>
  );
}
