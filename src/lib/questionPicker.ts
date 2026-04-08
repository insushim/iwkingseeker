import type { Question } from '@/types';
import { shuffleArray } from '@/lib/utils';

export function pickQuestion(
  pool: Question[],
  usedIds: string[]
): Question | null {
  const available = pool.filter((q) => !usedIds.includes(q.id));

  if (available.length === 0) {
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)]!;
  }

  const minUsedCount = Math.min(...available.map((q) => q.used_count));
  const leastUsed = available.filter((q) => q.used_count === minUsedCount);

  const difficulties = [1, 1, 1, 2, 2, 2, 2, 2, 3, 3];
  const targetDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]!;

  const difficultyMatched = leastUsed.filter((q) => q.difficulty === targetDifficulty);

  if (difficultyMatched.length > 0) {
    const shuffled = shuffleArray(difficultyMatched);
    return shuffled[0]!;
  }

  const shuffled = shuffleArray(leastUsed);
  return shuffled[0]!;
}

export function filterQuestionsByUnit(
  questions: Question[],
  grade: number,
  subject: string,
  unit: string
): Question[] {
  return questions.filter(
    (q) => q.grade === grade && q.subject === subject && q.unit === unit
  );
}
