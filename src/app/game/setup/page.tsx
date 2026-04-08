'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/gameStore';
import { GRADES, SUBJECTS, CURRICULUM_UNITS, TARGET_SCORES, TIMER_OPTIONS, TEAM_DEFAULTS } from '@/lib/constants';
import { splitIntoTeams } from '@/lib/utils';
import { Crown, ChevronRight, Users, BookOpen, Settings, Play, Save, FolderOpen, Trash2 } from 'lucide-react';

interface SavedClass {
  name: string;
  students: string;
}

const STORAGE_KEY = 'kingseeker_classes';

function getSavedClasses(): SavedClass[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveClasses(classes: SavedClass[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}

type Step = 1 | 2 | 3 | 4;

export default function GameSetupPage() {
  const router = useRouter();
  const { initGame, setQuestionPool } = useGameStore();
  const [step, setStep] = useState<Step>(1);
  const [studentInput, setStudentInput] = useState('');
  const [grade, setGrade] = useState<number>(5);
  const [subject, setSubject] = useState<string>('수학');
  const [unit, setUnit] = useState<string>('');
  const [targetScore, setTargetScore] = useState(3);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [teamAName, setTeamAName] = useState(TEAM_DEFAULTS.A.name);
  const [teamBName, setTeamBName] = useState(TEAM_DEFAULTS.B.name);
  const [savedClasses, setSavedClasses] = useState<SavedClass[]>([]);
  const [className, setClassName] = useState('');

  useEffect(() => {
    setSavedClasses(getSavedClasses());
  }, []);

  const handleSaveClass = () => {
    if (!className.trim() || !studentInput.trim()) return;
    const updated = savedClasses.filter((c) => c.name !== className.trim());
    updated.push({ name: className.trim(), students: studentInput });
    saveClasses(updated);
    setSavedClasses(updated);
    setClassName('');
  };

  const handleLoadClass = (cls: SavedClass) => {
    setStudentInput(cls.students);
  };

  const handleDeleteClass = (name: string) => {
    const updated = savedClasses.filter((c) => c.name !== name);
    saveClasses(updated);
    setSavedClasses(updated);
  };

  const students = studentInput
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const units = CURRICULUM_UNITS[String(grade)]?.[subject] ?? [];

  const handleStart = async () => {
    if (students.length < 4 || !unit) return;

    const [teamAStudents, teamBStudents] = splitIntoTeams(students);

    const { questionsSeed } = await import('@/data/questions-seed');
    const filtered = questionsSeed.filter(
      (q) => q.grade === grade && q.subject === subject && q.unit === unit
    );
    const pool = filtered.map((q, i) => ({
      id: `seed-${i}`,
      grade: q.grade,
      subject: q.subject,
      unit: q.unit,
      unit_code: q.unit_code,
      question_type: q.question_type as 'multiple_choice' | 'ox' | 'fill_blank' | 'short_answer',
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      used_count: 0,
      created_at: new Date().toISOString(),
    }));

    setQuestionPool(pool);
    initGame({
      grade,
      subject,
      unit,
      targetScore,
      timerSeconds,
      teamAName,
      teamBName,
      teamAStudents,
      teamBStudents,
    });
    router.push('/game/play');
  };

  const stepLabels = [
    { icon: <Users className="w-5 h-5" />, label: '학생 입력' },
    { icon: <BookOpen className="w-5 h-5" />, label: '과목 선택' },
    { icon: <Settings className="w-5 h-5" />, label: '설정' },
    { icon: <Play className="w-5 h-5" />, label: '팀 이름' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0a2e] to-[#0d0520] flex flex-col">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-gray-800">
        <Crown className="w-7 h-7 text-yellow-400" />
        <h1
          className="text-2xl font-black text-white"
          style={{ fontFamily: "var(--font-heading), sans-serif" }}
        >
          게임 설정
        </h1>
      </header>

      <div className="flex items-center justify-center gap-2 px-6 py-4">
        {stepLabels.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <motion.button
              onClick={() => setStep((i + 1) as Step)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                step === i + 1
                  ? 'bg-purple-600 text-white'
                  : step > i + 1
                    ? 'bg-green-600/30 text-green-400'
                    : 'bg-gray-800 text-gray-500'
              }`}
            >
              {s.icon}
              {s.label}
            </motion.button>
            {i < 3 && <ChevronRight className="w-4 h-4 text-gray-600" />}
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-xl font-bold text-white">학생 이름 입력</h2>

                {savedClasses.length > 0 && (
                  <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/50">
                    <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                      <FolderOpen className="w-4 h-4" /> 저장된 학급
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {savedClasses.map((cls) => (
                        <div key={cls.name} className="flex items-center gap-1">
                          <button
                            onClick={() => handleLoadClass(cls)}
                            className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded-lg text-sm font-medium"
                          >
                            {cls.name}
                          </button>
                          <button
                            onClick={() => handleDeleteClass(cls.name)}
                            className="p-1 text-gray-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-gray-400 text-sm">한 줄에 한 명씩 입력하세요 (최소 4명)</p>
                <textarea
                  value={studentInput}
                  onChange={(e) => setStudentInput(e.target.value)}
                  placeholder={"김민수\n이영희\n박철수\n정수진\n..."}
                  className="w-full h-52 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />

                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 flex-1">현재 {students.length}명 입력됨</p>
                  <input
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="학급 이름 (예: 5-3반)"
                    className="px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm outline-none focus:ring-1 focus:ring-purple-500 w-40"
                  />
                  <button
                    onClick={handleSaveClass}
                    disabled={!className.trim() || students.length < 1}
                    className="flex items-center gap-1 px-3 py-1.5 bg-green-600/30 hover:bg-green-600/50 text-green-400 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" /> 저장
                  </button>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={students.length < 4}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-xl"
                >
                  다음
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-xl font-bold text-white">학년 / 과목 / 단원 선택</h2>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">학년</label>
                  <div className="flex gap-2">
                    {GRADES.map((g) => (
                      <button
                        key={g}
                        onClick={() => { setGrade(g); setUnit(''); }}
                        className={`flex-1 py-3 rounded-xl font-bold text-lg ${
                          grade === g
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {g}학년
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">과목</label>
                  <div className="grid grid-cols-3 gap-2">
                    {SUBJECTS.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSubject(s); setUnit(''); }}
                        className={`py-3 rounded-xl font-bold ${
                          subject === s
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">단원</label>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                    {units.map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`text-left px-4 py-3 rounded-xl font-medium text-sm ${
                          unit === u
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(3)}
                  disabled={!unit}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-xl"
                >
                  다음
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-xl font-bold text-white">게임 설정</h2>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">목표 점수</label>
                  <div className="flex gap-2">
                    {TARGET_SCORES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setTargetScore(s)}
                        className={`flex-1 py-3 rounded-xl font-bold text-lg ${
                          targetScore === s
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {s}점
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 block mb-2">제한 시간</label>
                  <div className="flex flex-wrap gap-2">
                    {TIMER_OPTIONS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimerSeconds(t)}
                        className={`px-4 py-3 rounded-xl font-bold ${
                          timerSeconds === t
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {t}초
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                >
                  다음
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-xl font-bold text-white">팀 이름 설정</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-4">
                    <span className="text-3xl">🐲</span>
                    <input
                      value={teamAName}
                      onChange={(e) => setTeamAName(e.target.value)}
                      className="mt-2 w-full bg-transparent text-xl font-bold text-blue-400 border-b border-blue-600 outline-none"
                    />
                  </div>
                  <div className="bg-amber-900/20 border border-amber-700/40 rounded-xl p-4">
                    <span className="text-3xl">🐯</span>
                    <input
                      value={teamBName}
                      onChange={(e) => setTeamBName(e.target.value)}
                      className="mt-2 w-full bg-transparent text-xl font-bold text-amber-400 border-b border-amber-600 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50">
                  <h3 className="text-sm text-gray-400 mb-2">게임 요약</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">학생 수</div>
                    <div className="text-white font-bold">{students.length}명</div>
                    <div className="text-gray-500">학년/과목</div>
                    <div className="text-white font-bold">{grade}학년 {subject}</div>
                    <div className="text-gray-500">단원</div>
                    <div className="text-white font-bold text-xs">{unit}</div>
                    <div className="text-gray-500">목표 점수</div>
                    <div className="text-white font-bold">{targetScore}점</div>
                    <div className="text-gray-500">제한 시간</div>
                    <div className="text-white font-bold">{timerSeconds}초</div>
                  </div>
                </div>

                <motion.button
                  onClick={handleStart}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-black text-2xl"
                  style={{ fontFamily: "var(--font-heading), sans-serif" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🎮 게임 시작!
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
