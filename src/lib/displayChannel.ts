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
}

export interface DisplayMessage {
  type: 'state';
  state: DisplayState;
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
  };
}
