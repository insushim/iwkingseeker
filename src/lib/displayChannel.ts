import type { GameState, GamePhase, RoundRecord } from '@/types';

export const DISPLAY_CHANNEL = 'kingseeker-display';

/**
 * Sanitized game state for the student display screen.
 * Sensitive data (king identity, correct answers, revealed lists) is stripped.
 */
export interface DisplayState {
  phase: GamePhase;
  teamA: { name: string; students: string[]; score: number };
  teamB: { name: string; students: string[]; score: number };
  currentAttacker: 'team_a' | 'team_b';
  targetScore: number;
  timerSeconds: number;
  totalQuestionsAsked: number;
  totalCorrect: number;
  currentQuestion: {
    id: string;
    subject: string;
    unit: string;
    question_type: 'multiple_choice' | 'ox' | 'fill_blank' | 'short_answer';
    question_text: string;
    options: string[] | null;
  } | null;
  lastGuessResult: 'found' | 'not_found' | null;
  lastGuessedStudent: string | null;
  roundHistory: RoundRecord[];
  revealedA: string[];
  revealedB: string[];
  kingSelectorA: string | null;
  kingSelectorB: string | null;
  /** 결과 공개 순간만 correct_answer/explanation이 함께 동봉됨 */
  quizResult: {
    selectedAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string | null;
  } | null;
}

export interface DisplayMessage {
  type: 'state';
  state: DisplayState;
}

/** 학생 화면 → 교사 화면으로 보내는 액션 */
export interface DisplayAction {
  type: 'action';
  action: 'answer' | 'rps-winner' | 'king-guess';
  value: string;
}

/**
 * Strip sensitive fields from the full Zustand GameState
 * before broadcasting to the student display window.
 */
export function sanitizeForDisplay(s: GameState): DisplayState {
  return {
    phase: s.phase,
    teamA: { name: s.teamA.name, students: s.teamA.students, score: s.teamA.score },
    teamB: { name: s.teamB.name, students: s.teamB.students, score: s.teamB.score },
    currentAttacker: s.currentAttacker,
    targetScore: s.targetScore,
    timerSeconds: s.timerSeconds,
    totalQuestionsAsked: s.totalQuestionsAsked,
    totalCorrect: s.totalCorrect,
    currentQuestion: s.currentQuestion
      ? {
          id: s.currentQuestion.id,
          subject: s.currentQuestion.subject,
          unit: s.currentQuestion.unit,
          question_type: s.currentQuestion.question_type,
          question_text: s.currentQuestion.question_text,
          options: s.currentQuestion.options,
          // correct_answer deliberately excluded
        }
      : null,
    lastGuessResult: s.lastGuessResult,
    lastGuessedStudent: s.lastGuessedStudent,
    roundHistory: s.roundHistory,
    revealedA: s.revealedA,
    revealedB: s.revealedB,
    kingSelectorA: s.kingSelectorA,
    kingSelectorB: s.kingSelectorB,
    quizResult: s.quizResult && s.currentQuestion
      ? {
          selectedAnswer: s.quizResult.selectedAnswer,
          isCorrect: s.quizResult.isCorrect,
          correctAnswer: s.currentQuestion.correct_answer,
          explanation: s.currentQuestion.explanation,
        }
      : null,
  };
}
