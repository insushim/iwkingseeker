import type { Question } from '@/types';
import { shuffleArray } from '@/lib/utils';

export function pickQuestion(
  pool: Question[],
  usedIds: string[]
): Question | null {
  // 자동 출제는 주관식(short_answer) 제외 — 객관식/OX/빈칸으로 다양화
  const typedPool = pool.filter((q) => q.question_type !== 'short_answer');
  const workingPool = typedPool.length > 0 ? typedPool : pool;

  const available = workingPool.filter((q) => !usedIds.includes(q.id));

  if (available.length === 0) {
    if (workingPool.length === 0) return null;
    return workingPool[Math.floor(Math.random() * workingPool.length)]!;
  }

  const minUsedCount = Math.min(...available.map((q) => q.used_count));
  const leastUsed = available.filter((q) => q.used_count === minUsedCount);

  // 고난이도 가중치 상향: 고3 60% / 중2 30% / 저1 10%
  const difficulties = [1, 2, 2, 2, 3, 3, 3, 3, 3, 3];
  const targetDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]!;

  const difficultyMatched = leastUsed.filter((q) => q.difficulty === targetDifficulty);

  if (difficultyMatched.length > 0) {
    // 같은 난이도 내에서도 유형 다양화 — 가장 적게 나온 유형 우선
    const typeCount = new Map<string, number>();
    for (const q of difficultyMatched) {
      typeCount.set(q.question_type, (typeCount.get(q.question_type) || 0) + q.used_count);
    }
    const minTypeUsed = Math.min(...Array.from(typeCount.values()));
    const leastUsedTypes = Array.from(typeCount.entries())
      .filter(([, c]) => c === minTypeUsed)
      .map(([t]) => t);
    const preferredType = leastUsedTypes[Math.floor(Math.random() * leastUsedTypes.length)]!;
    const finalPick = difficultyMatched.filter((q) => q.question_type === preferredType);
    return shuffleArray(finalPick)[0] || shuffleArray(difficultyMatched)[0]!;
  }

  return shuffleArray(leastUsed)[0]!;
}
