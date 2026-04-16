import { questionsSeed } from '../src/data/questions-seed';

const byGrade: Record<number, number> = {};
const byG5Subject: Record<string, number> = {};
const byG5SubjectUnit: Record<string, number> = {};

for (const q of questionsSeed) {
  byGrade[q.grade] = (byGrade[q.grade] || 0) + 1;
  if (q.grade === 5) {
    byG5Subject[q.subject] = (byG5Subject[q.subject] || 0) + 1;
    const key = `${q.subject}|${q.unit}`;
    byG5SubjectUnit[key] = (byG5SubjectUnit[key] || 0) + 1;
  }
}

console.log('총 문제 수:', questionsSeed.length);
console.log('학년별:', byGrade);
console.log('5학년 과목별:', byG5Subject);
console.log('5학년 과목/단원별:');
Object.entries(byG5SubjectUnit)
  .sort()
  .forEach(([k, v]) => console.log(`  ${k}: ${v}`));
