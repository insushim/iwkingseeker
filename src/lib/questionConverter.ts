/**
 * 주관식/빈칸 문제를 객관식으로 자동 변환
 */

import { shuffleArray } from './utils';

interface RawQuestion {
  question_type: string;
  correct_answer: string;
  options: string[] | null;
  [key: string]: unknown;
}

function isNumeric(str: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(str.trim());
}

function generateNumericOptions(correct: number): string[] {
  const options = new Set<string>();
  options.add(String(correct));

  // 가까운 오답 생성
  const offsets = [1, 2, 3, 5, 10, -1, -2, -3, -5, -10];
  const shuffledOffsets = shuffleArray([...offsets]);

  for (const offset of shuffledOffsets) {
    if (options.size >= 4) break;
    const wrong = correct + offset;
    if (wrong >= 0) {
      options.add(String(wrong));
    }
  }

  // 부족하면 배수/몫 오답
  if (options.size < 4) {
    const extras = [correct * 2, Math.floor(correct / 2), correct + 20, correct - 10];
    for (const e of extras) {
      if (options.size >= 4) break;
      if (e >= 0 && e !== correct) options.add(String(e));
    }
  }

  // 그래도 부족하면 랜덤
  while (options.size < 4) {
    const rand = Math.floor(Math.random() * (correct + 50));
    if (rand !== correct) options.add(String(rand));
  }

  return shuffleArray([...options]);
}

function generateTextOptions(correct: string, allAnswers: string[]): string[] {
  const options = new Set<string>();
  options.add(correct);

  // 같은 문제 풀에서 다른 정답들을 오답으로 사용
  const candidates = shuffleArray(
    allAnswers.filter((a) => a !== correct && a.length > 0 && a.length < 30)
  );

  for (const c of candidates) {
    if (options.size >= 4) break;
    options.add(c);
  }

  // 부족하면 임의 보기 추가
  const fillers = ['위의 보기 중 없음', correct + '(이)가 아님', '해당 없음'];
  for (const f of fillers) {
    if (options.size >= 4) break;
    options.add(f);
  }

  return shuffleArray([...options]);
}

export function convertToMultipleChoice<T extends RawQuestion>(questions: T[]): T[] {
  // 텍스트 오답 생성용 - 같은 과목 정답 모음
  const allTextAnswers = questions
    .filter((q) => !isNumeric(q.correct_answer))
    .map((q) => q.correct_answer);

  return questions.map((q) => {
    // 이미 객관식이거나 OX면 그대로
    if (q.question_type === 'multiple_choice' || q.question_type === 'ox') {
      return q;
    }

    const answer = q.correct_answer.trim();

    let options: string[];
    if (isNumeric(answer)) {
      options = generateNumericOptions(Number(answer));
    } else {
      options = generateTextOptions(answer, allTextAnswers);
    }

    return {
      ...q,
      question_type: 'multiple_choice',
      options,
    };
  });
}
