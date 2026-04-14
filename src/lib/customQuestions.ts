import type { Question } from '@/types';

export interface StoredCustomQuestion {
  id: string;
  grade: number;
  subject: string;
  unit: string;
  question_type: 'multiple_choice' | 'ox' | 'fill_blank' | 'short_answer';
  question_text: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  difficulty: number;
  created_at: string;
}

const STORAGE_KEY = 'kingseeker_custom_questions';

export function getCustomQuestions(): StoredCustomQuestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomQuestions(list: StoredCustomQuestion[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addCustomQuestion(q: Omit<StoredCustomQuestion, 'id' | 'created_at'>): StoredCustomQuestion {
  const list = getCustomQuestions();
  const created: StoredCustomQuestion = {
    ...q,
    id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    created_at: new Date().toISOString(),
  };
  list.push(created);
  saveCustomQuestions(list);
  return created;
}

export function updateCustomQuestion(id: string, patch: Partial<StoredCustomQuestion>) {
  const list = getCustomQuestions().map((q) => (q.id === id ? { ...q, ...patch } : q));
  saveCustomQuestions(list);
}

export function deleteCustomQuestion(id: string) {
  saveCustomQuestions(getCustomQuestions().filter((q) => q.id !== id));
}

export function getCustomQuestionsFiltered(grade: number, subject: string, unit: string): StoredCustomQuestion[] {
  return getCustomQuestions().filter(
    (q) => q.grade === grade && q.subject === subject && q.unit === unit
  );
}

/** Convert stored custom question to runtime Question shape used by the game. */
export function toRuntimeQuestion(c: StoredCustomQuestion): Question {
  return {
    id: c.id,
    grade: c.grade,
    subject: c.subject,
    unit: c.unit,
    unit_code: null,
    question_type: c.question_type,
    question_text: c.question_text,
    options: c.options,
    correct_answer: c.correct_answer,
    explanation: c.explanation,
    difficulty: c.difficulty,
    used_count: 0,
    created_at: c.created_at,
  };
}

export function exportCustomQuestionsJson(): string {
  return JSON.stringify(getCustomQuestions(), null, 2);
}

export function importCustomQuestionsJson(json: string): { added: number; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return { added: 0, error: '배열 형식이 아닙니다.' };
    const existing = getCustomQuestions();
    const existingIds = new Set(existing.map((q) => q.id));
    const toAdd: StoredCustomQuestion[] = [];
    for (const q of parsed) {
      if (!q || typeof q !== 'object') continue;
      if (typeof q.question_text !== 'string' || typeof q.correct_answer !== 'string') continue;
      const safe: StoredCustomQuestion = {
        id: existingIds.has(q.id) ? `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}` : (q.id || `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`),
        grade: Number(q.grade) || 3,
        subject: String(q.subject || '기타'),
        unit: String(q.unit || '기타'),
        question_type: ['multiple_choice', 'ox', 'fill_blank', 'short_answer'].includes(q.question_type) ? q.question_type : 'multiple_choice',
        question_text: String(q.question_text),
        options: Array.isArray(q.options) ? q.options.map(String) : null,
        correct_answer: String(q.correct_answer),
        explanation: q.explanation ? String(q.explanation) : null,
        difficulty: [1, 2, 3].includes(Number(q.difficulty)) ? Number(q.difficulty) : 2,
        created_at: typeof q.created_at === 'string' ? q.created_at : new Date().toISOString(),
      };
      toAdd.push(safe);
    }
    saveCustomQuestions([...existing, ...toAdd]);
    return { added: toAdd.length };
  } catch (e) {
    return { added: 0, error: e instanceof Error ? e.message : '파싱 실패' };
  }
}
