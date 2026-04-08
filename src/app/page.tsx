'use client';

import { motion } from 'framer-motion';
import { Crown, Swords, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] via-[#16082b] to-[#0d0520] overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            style={{
              left: `${10 + (i * 4.5) % 90}%`,
              top: `${5 + (i * 5.3) % 90}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + (i % 3),
              repeat: Infinity,
              delay: (i % 5) * 0.4,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2">
          <Crown className="w-8 h-8 text-yellow-400" />
          <span className="text-xl font-bold text-white">KingSeeker</span>
        </div>
        <Link href="/game/setup">
          <motion.button
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            게임 시작
          </motion.button>
        </Link>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 pb-32">
        <motion.div
          className="flex flex-col items-center gap-6 text-center"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <span className="text-8xl block">👑</span>
          </motion.div>

          <h1
            className="text-6xl md:text-8xl font-black bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
          >
            킹시커
          </h1>

          <p className="text-xl md:text-2xl text-purple-200 font-medium">
            왕을 찾아라! 교실 퀴즈 배틀
          </p>

          <p className="text-gray-400 max-w-lg text-lg">
            전자칠판 하나로 교실이 흥미진진한 퀴즈 배틀장으로!
            <br />
            팀을 나누고, 비밀 왕을 선택하고, 퀴즈를 풀어 왕을 찾아보세요.
          </p>

          <Link href="/game/setup">
            <motion.button
              className="mt-4 px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-black text-2xl shadow-lg shadow-purple-500/30"
              style={{ fontFamily: "var(--font-heading), 'Black Han Sans', sans-serif" }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(147, 51, 234, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              게임 시작하기
            </motion.button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-4xl w-full">
          {[
            {
              icon: <Users className="w-10 h-10 text-blue-400" />,
              title: '팀 배틀',
              desc: '학급을 두 팀으로 나누고 가위바위보로 선공을 결정하는 흥미진진한 대결!',
              color: 'from-blue-500/20 to-blue-900/20 border-blue-700/30',
            },
            {
              icon: <Crown className="w-10 h-10 text-yellow-400" />,
              title: '숨겨진 왕',
              desc: '상대팀의 왕을 찾아라! 왕 본인도 모르는 비밀 선택 시스템으로 더욱 스릴 넘치는 게임.',
              color: 'from-yellow-500/20 to-amber-900/20 border-yellow-700/30',
            },
            {
              icon: <BookOpen className="w-10 h-10 text-green-400" />,
              title: '학습 퀴즈',
              desc: '2022 개정 교육과정 기반 500+ 문제 은행. 퀴즈를 맞춰야 왕을 지목할 수 있어요!',
              color: 'from-green-500/20 to-emerald-900/20 border-green-700/30',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className={`bg-gradient-to-b ${feature.color} rounded-2xl border p-6 text-center`}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-20 flex items-center gap-2 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Swords className="w-4 h-4" />
          <span className="text-sm">선생님을 위한 교실 학습 게임</span>
        </motion.div>
      </main>
    </div>
  );
}
