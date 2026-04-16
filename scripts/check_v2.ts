import { seedGrade5V2Math } from '../src/data/seed-grade5-v2-math';
import { seedGrade5V2Science } from '../src/data/seed-grade5-v2-science';
import { seedGrade5V2English } from '../src/data/seed-grade5-v2-english';
import { seedGrade5V2Others } from '../src/data/seed-grade5-v2-others';
import { questionsSeed } from '../src/data/questions-seed';

const v2All = [
  ...seedGrade5V2Math,
  ...seedGrade5V2Science,
  ...seedGrade5V2English,
  ...seedGrade5V2Others,
];

console.log('=== v2 추가 문제 수 ===');
console.log('수학:', seedGrade5V2Math.length);
console.log('과학:', seedGrade5V2Science.length);
console.log('영어:', seedGrade5V2English.length);
console.log('국어+사회+도덕:', seedGrade5V2Others.length);
console.log('v2 합계:', v2All.length);

const issues: string[] = [];
const seen = new Set<string>();
let dup = 0;
const bySubject: Record<string, number> = {};

for (const q of v2All) {
  bySubject[q.subject] = (bySubject[q.subject] || 0) + 1;
  const key = `${q.subject}|${q.question_text}`;
  if (seen.has(key)) {
    dup++;
    if (issues.length < 20) issues.push(`중복: [${q.subject}] ${q.question_text.slice(0, 60)}`);
  } else {
    seen.add(key);
  }
  if (q.question_type === 'multiple_choice' && q.options) {
    if (!q.options.includes(q.correct_answer)) {
      issues.push(`correct 없음: ${q.question_text.slice(0, 60)}`);
    }
    if (q.options.length < 2) {
      issues.push(`options 부족: ${q.question_text.slice(0, 60)}`);
    }
  }
  if (q.question_type === 'ox' && !['O', 'X'].includes(q.correct_answer)) {
    issues.push(`ox answer 이상: ${q.question_text.slice(0, 60)}`);
  }
  if (!q.question_text?.trim() || !q.correct_answer?.trim()) {
    issues.push(`빈 필드: ${q.question_text}`);
  }
}

console.log('\nv2 과목별:', bySubject);
console.log('v2 중복:', dup);
console.log('v2 이슈:', issues.length);
if (issues.length > 0) {
  console.log('상위 20개:');
  issues.slice(0, 20).forEach((i) => console.log('  ' + i));
}

console.log('\n=== 통합 후 총 문제 수 (questionsSeed, dedup 후) ===');
console.log(questionsSeed.length);

const byGrade: Record<number, number> = {};
const byG5Subject: Record<string, number> = {};
for (const q of questionsSeed) {
  byGrade[q.grade] = (byGrade[q.grade] || 0) + 1;
  if (q.grade === 5) byG5Subject[q.subject] = (byG5Subject[q.subject] || 0) + 1;
}
console.log('학년별:', byGrade);
console.log('5학년 과목별:', byG5Subject);
