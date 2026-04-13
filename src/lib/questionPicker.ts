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

  // 유형 가중치 — 시드 데이터가 객관식에 편중돼 있어
  // OX/빈칸이 충분히 나오도록 가중치로 보정 (mc 2 : ox 3 : fill_blank 3)
  const typeWeights: Array<'multiple_choice' | 'ox' | 'fill_blank'> = [
    'multiple_choice', 'multiple_choice',
    'ox', 'ox', 'ox',
    'fill_blank', 'fill_blank', 'fill_blank',
  ];

  const tryPools: Question[][] = [];
  if (difficultyMatched.length > 0) {
    const targetType = typeWeights[Math.floor(Math.random() * typeWeights.length)]!;
    const byType = difficultyMatched.filter((q) => q.question_type === targetType);
    if (byType.length > 0) tryPools.push(byType);
    tryPools.push(difficultyMatched);
  }
  tryPools.push(leastUsed);

  for (const pool2 of tryPools) {
    if (pool2.length > 0) return shuffleArray(pool2)[0]!;
  }

  return shuffleArray(leastUsed)[0]!;
}
