'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Crown, Search, Filter } from 'lucide-react';
import { GRADES, SUBJECTS, CURRICULUM_UNITS, QUESTION_TYPE_LABELS } from '@/lib/constants';
import type { QuestionType } from '@/lib/constants';

interface SeedQuestion {
  grade: number;
  subject: string;
  unit: string;
  question_type: string;
  question_text: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  difficulty: number;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<SeedQuestion[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [grade, setGrade] = useState<number>(5);
  const [subject, setSubject] = useState<string>('수학');
  const [unit, setUnit] = useState<string>('');
  const [search, setSearch] = useState('');

  const units = CURRICULUM_UNITS[String(grade)]?.[subject] ?? [];

  const loadQuestions = async () => {
    const { questionsSeed } = await import('@/data/questions-seed');
    setQuestions(questionsSeed);
    setLoaded(true);
  };

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (q.grade !== grade) return false;
      if (q.subject !== subject) return false;
      if (unit && q.unit !== unit) return false;
      if (search && !q.question_text.includes(search)) return false;
      return true;
    });
  }, [questions, grade, subject, unit, search]);

  const difficultyLabel = (d: number) => {
    if (d === 1) return '쉬움';
    if (d === 2) return '보통';
    return '어려움';
  };

  const difficultyColor = (d: number) => {
    if (d === 1) return 'text-green-400 bg-green-400/10';
    if (d === 2) return 'text-yellow-400 bg-yellow-400/10';
    return 'text-red-400 bg-red-400/10';
  };

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
          <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm font-medium">
            대시보드
          </Link>
          <Link href="/game/setup" className="text-gray-400 hover:text-white text-sm font-medium">
            새 게임
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1
          className="text-3xl font-black text-white mb-6"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          문제 은행
        </h1>

        {!loaded ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.button
              onClick={loadQuestions}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              문제 은행 불러오기
            </motion.button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex gap-1">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => { setGrade(g); setUnit(''); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                      grade === g ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {g}학년
                  </button>
                ))}
              </div>

              <div className="flex gap-1">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSubject(s); setUnit(''); }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                      subject === s ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="문제 검색..."
                  className="pl-9 pr-4 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {units.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-6">
                <button
                  onClick={() => setUnit('')}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    !unit ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  전체
                </button>
                {units.map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      unit === u ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500 mb-4">{filtered.length}개 문제</p>

            <div className="flex flex-col gap-3">
              {filtered.slice(0, 50).map((q, i) => (
                <motion.div
                  key={i}
                  className="bg-gray-800/60 rounded-xl border border-gray-700/50 p-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">{q.unit}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${difficultyColor(q.difficulty)}`}>
                          {difficultyLabel(q.difficulty)}
                        </span>
                        <span className="text-xs text-gray-600">
                          {QUESTION_TYPE_LABELS[q.question_type as QuestionType]}
                        </span>
                      </div>
                      <p className="text-white font-medium">{q.question_text}</p>
                      {q.options && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {q.options.map((opt, j) => (
                            <span
                              key={j}
                              className={`text-xs px-2 py-1 rounded ${
                                opt === q.correct_answer
                                  ? 'bg-green-600/20 text-green-400 border border-green-600/30'
                                  : 'bg-gray-700/50 text-gray-400'
                              }`}
                            >
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                      {q.explanation && (
                        <p className="text-xs text-gray-500 mt-2">💡 {q.explanation}</p>
                      )}
                    </div>
                    <span className="text-xs text-green-400 font-bold whitespace-nowrap">
                      정답: {q.correct_answer}
                    </span>
                  </div>
                </motion.div>
              ))}
              {filtered.length > 50 && (
                <p className="text-center text-gray-500 text-sm py-4">
                  ... 외 {filtered.length - 50}개 문제
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
