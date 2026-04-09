/**
 * 주관식/빈칸 문제를 객관식으로 자동 변환
 * - 같은 과목+학년의 다른 정답을 오답으로 사용
 * - 숫자 답은 근접 오답 자동 생성
 */

import { shuffleArray } from './utils';

interface RawQuestion {
  question_type: string;
  correct_answer: string;
  options: string[] | null;
  subject?: string;
  grade?: number;
  [key: string]: unknown;
}

function isNumeric(str: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(str.trim());
}

function generateNumericOptions(correct: number): string[] {
  const options = new Set<string>();
  options.add(String(correct));

  // 가까운 오답 생성 (정답 크기에 따라 오차 조절)
  const base = Math.max(1, Math.abs(correct));
  const smallOffsets = [1, 2, 3, -1, -2, -3];
  const mediumOffsets = [5, 10, -5, -10];
  const largeOffsets = [20, -20, 15, -15];

  const offsets = base < 20
    ? shuffleArray([...smallOffsets])
    : base < 100
      ? shuffleArray([...smallOffsets, ...mediumOffsets])
      : shuffleArray([...mediumOffsets, ...largeOffsets]);

  for (const offset of offsets) {
    if (options.size >= 4) break;
    const wrong = correct + offset;
    if (wrong >= 0 && wrong !== correct) {
      options.add(String(wrong));
    }
  }

  // 부족하면 배수 오답
  while (options.size < 4) {
    const rand = correct + Math.floor(Math.random() * 10) + 1;
    if (rand !== correct) options.add(String(rand));
  }

  return shuffleArray([...options]);
}

function generateTextOptions(
  correct: string,
  sameSubjectAnswers: string[],
  allAnswers: string[]
): string[] {
  const options = new Set<string>();
  options.add(correct);

  // 1순위: 같은 과목의 비슷한 길이 답 (가장 그럴듯한 오답)
  const similarLength = sameSubjectAnswers.filter(
    (a) => a !== correct && a.length > 0 && a.length < 30 &&
      Math.abs(a.length - correct.length) < 10 &&
      !/^[a-zA-Z\s]+$/.test(a) // 영어만 있는 답 제외
  );
  const shuffledSimilar = shuffleArray(similarLength);
  for (const c of shuffledSimilar) {
    if (options.size >= 4) break;
    options.add(c);
  }

  // 2순위: 같은 과목의 다른 답
  if (options.size < 4) {
    const subjectCandidates = sameSubjectAnswers.filter(
      (a) => a !== correct && a.length > 0 && a.length < 30 &&
        !options.has(a) && !/^[a-zA-Z\s]+$/.test(a)
    );
    for (const c of shuffleArray(subjectCandidates)) {
      if (options.size >= 4) break;
      options.add(c);
    }
  }

  // 3순위: 전체 풀에서 한국어 답
  if (options.size < 4) {
    const fallback = allAnswers.filter(
      (a) => a !== correct && !options.has(a) && a.length > 0 &&
        a.length < 20 && /[가-힣]/.test(a)
    );
    for (const c of shuffleArray(fallback)) {
      if (options.size >= 4) break;
      options.add(c);
    }
  }

  // 최후수단
  while (options.size < 4) {
    options.add(`보기 ${options.size}`);
  }

  return shuffleArray([...options]);
}

export function convertToMultipleChoice<T extends RawQuestion>(questions: T[]): T[] {
  // 과목별 정답 맵 구축
  const answersBySubject: Record<string, string[]> = {};
  const allTextAnswers: string[] = [];

  questions.forEach((q) => {
    if (!isNumeric(q.correct_answer)) {
      const key = `${q.grade ?? ''}_${q.subject ?? ''}`;
      if (!answersBySubject[key]) answersBySubject[key] = [];
      answersBySubject[key].push(q.correct_answer);
      allTextAnswers.push(q.correct_answer);
    }
  });

  return questions.map((q) => {
    // 이미 객관식이거나 OX면 그대로
    if (q.question_type === 'multiple_choice' || q.question_type === 'ox') {
      return q;
    }

    const answer = q.correct_answer.trim();
    const subjectKey = `${q.grade ?? ''}_${q.subject ?? ''}`;

    let options: string[];
    if (isNumeric(answer)) {
      options = generateNumericOptions(Number(answer));
    } else {
      options = generateTextOptions(
        answer,
        answersBySubject[subjectKey] ?? [],
        allTextAnswers
      );
    }

    return {
      ...q,
      question_type: 'multiple_choice',
      options,
    };
  });
}
