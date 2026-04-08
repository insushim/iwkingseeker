'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Crown, Plus, Gamepad2, History, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] to-[#0d0520]">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <Crown className="w-7 h-7 text-yellow-400" />
          <span
            className="text-xl font-black text-white"
            style={{ fontFamily: "var(--font-heading), sans-serif" }}
          >
            킹시커
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/game/setup" className="text-gray-400 hover:text-white text-sm font-medium">
            새 게임
          </Link>
          <Link href="/questions" className="text-gray-400 hover:text-white text-sm font-medium">
            문제 관리
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <motion.h1
          className="text-3xl font-black text-white mb-8"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          대시보드
        </motion.h1>

        <Link href="/game/setup">
          <motion.div
            className="w-full p-8 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/40 rounded-2xl flex items-center justify-center gap-4 cursor-pointer hover:from-purple-600/40 hover:to-pink-600/40 transition-all mb-8"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Gamepad2 className="w-10 h-10 text-purple-400" />
            <span
              className="text-2xl font-black text-white"
              style={{ fontFamily: "var(--font-heading), sans-serif" }}
            >
              새 게임 시작
            </span>
          </motion.div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="bg-gray-800/60 rounded-2xl border border-gray-700/50 p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-bold text-white">총 게임</h3>
            </div>
            <p className="text-4xl font-black text-purple-400">0</p>
            <p className="text-sm text-gray-500 mt-1">Supabase 연동 후 표시됩니다</p>
          </motion.div>

          <motion.div
            className="bg-gray-800/60 rounded-2xl border border-gray-700/50 p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-bold text-white">문제 은행</h3>
            </div>
            <p className="text-4xl font-black text-green-400">500+</p>
            <p className="text-sm text-gray-500 mt-1">2022 개정 교육과정 기반</p>
          </motion.div>

          <motion.div
            className="bg-gray-800/60 rounded-2xl border border-gray-700/50 p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <History className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">평균 정답률</h3>
            </div>
            <p className="text-4xl font-black text-blue-400">--%</p>
            <p className="text-sm text-gray-500 mt-1">게임 진행 후 표시됩니다</p>
          </motion.div>
        </div>

        <div className="bg-gray-800/40 rounded-2xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">최근 게임</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <History className="w-12 h-12 mb-3 opacity-30" />
            <p>아직 진행한 게임이 없습니다</p>
            <Link href="/game/setup" className="text-purple-400 hover:text-purple-300 text-sm mt-2">
              첫 게임을 시작해보세요!
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
