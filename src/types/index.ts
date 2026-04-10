export interface Teacher {
  id: string;
  email: string;
  name: string;
  school_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Classroom {
  id: string;
  teacher_id: string;
  name: string;
  grade: number;
  students: string[];
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  grade: number;
  subject: string;
  unit: string;
  unit_code: string | null;
  question_type: 'multiple_choice' | 'ox' | 'fill_blank' | 'short_answer';
  question_text: string;
  options: string[] | null;
  correct_answer: string;
  explanation: string | null;
  difficulty: number;
  used_count: number;
  created_at: string;
}

export interface Game {
  id: string;
  teacher_id: string;
  classroom_id: string | null;
  grade: number;
  subject: string;
  unit: string;
  team_a_name: string;
  team_b_name: string;
  team_a_students: string[];
  team_b_students: string[];
  team_a_score: number;
  team_b_score: number;
  target_score: number;
  winner: 'team_a' | 'team_b' | null;
  rounds: RoundRecord[];
  total_questions_asked: number;
  total_correct: number;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

export interface RoundRecord {
  round_number: number;
  king_of_a: string;
  king_of_b: string;
  winner: 'team_a' | 'team_b';
  questions_in_round: QuestionRecord[];
}

export interface QuestionRecord {
  question_id: string;
  question_text: string;
  attacker: 'team_a' | 'team_b';
  answer_given: string;
  correct: boolean;
  king_guess?: string;
  king_found?: boolean;
}

export type GamePhase =
  | 'SETUP'
  | 'TEAM_SPLIT'
  | 'KING_SELECT_A'
  | 'KING_SELECT_B'
  | 'RPS'
  | 'QUIZ'
  | 'WRONG_ANSWER'
  | 'GUESS_KING'
  | 'ROUND_RESULT'
  | 'NEW_ROUND'
  | 'GAME_OVER';

export interface TeamState {
  name: string;
  students: string[];
  score: number;
}

export interface GameState {
  phase: GamePhase;
  teamA: TeamState;
  teamB: TeamState;
  kingOfTeamA: string | null;
  kingOfTeamB: string | null;
  kingSelectorA: string | null;
  kingSelectorB: string | null;
  revealedA: string[];
  revealedB: string[];
  currentAttacker: 'team_a' | 'team_b';
  currentQuestion: Question | null;
  usedQuestionIds: string[];
  targetScore: number;
  grade: number;
  subject: string;
  unit: string;
  timerSeconds: number;
  roundHistory: RoundRecord[];
  totalQuestionsAsked: number;
  totalCorrect: number;
  currentRoundQuestions: QuestionRecord[];
  lastGuessResult: 'found' | 'not_found' | null;
  lastGuessedStudent: string | null;
  questionPool: Question[];
}

export interface CustomQuestion {
  id: string;
  teacher_id: string;
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
