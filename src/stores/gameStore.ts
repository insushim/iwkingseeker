'use client';

import { create } from 'zustand';
import type { GameState, GamePhase, Question, QuestionRecord, RoundRecord } from '@/types';

interface GameActions {
  setPhase: (phase: GamePhase) => void;
  initGame: (config: {
    grade: number;
    subject: string;
    unit: string;
    targetScore: number;
    timerSeconds: number;
    teamAName: string;
    teamBName: string;
    teamAStudents: string[];
    teamBStudents: string[];
  }) => void;
  selectKing: (team: 'team_a' | 'team_b', studentName: string) => void;
  setRPSResult: (winner: 'team_a' | 'team_b') => void;
  setCurrentQuestion: (question: Question) => void;
  submitAnswer: (answer: string, isCorrect: boolean) => void;
  guessKing: (studentName: string) => void;
  switchAttacker: () => void;
  startNewRound: () => void;
  endGame: () => void;
  resetGame: () => void;
  setQuestionPool: (pool: Question[]) => void;
  addUsedQuestionId: (id: string) => void;
}

const initialState: GameState = {
  phase: 'SETUP',
  teamA: { name: '청룡', students: [], score: 0 },
  teamB: { name: '백호', students: [], score: 0 },
  kingOfTeamA: null,
  kingOfTeamB: null,
  revealedA: [],
  revealedB: [],
  currentAttacker: 'team_a',
  currentQuestion: null,
  usedQuestionIds: [],
  targetScore: 3,
  grade: 5,
  subject: '수학',
  unit: '',
  timerSeconds: 30,
  roundHistory: [],
  totalQuestionsAsked: 0,
  totalCorrect: 0,
  currentRoundQuestions: [],
  lastGuessResult: null,
  lastGuessedStudent: null,
  questionPool: [],
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  initGame: (config) =>
    set({
      phase: 'TEAM_SPLIT',
      grade: config.grade,
      subject: config.subject,
      unit: config.unit,
      targetScore: config.targetScore,
      timerSeconds: config.timerSeconds,
      teamA: { name: config.teamAName, students: config.teamAStudents, score: 0 },
      teamB: { name: config.teamBName, students: config.teamBStudents, score: 0 },
      kingOfTeamA: null,
      kingOfTeamB: null,
      revealedA: [],
      revealedB: [],
      currentAttacker: 'team_a',
      currentQuestion: null,
      usedQuestionIds: [],
      roundHistory: [],
      totalQuestionsAsked: 0,
      totalCorrect: 0,
      currentRoundQuestions: [],
      lastGuessResult: null,
      lastGuessedStudent: null,
    }),

  selectKing: (team, studentName) => {
    if (team === 'team_a') {
      set({ kingOfTeamA: studentName });
    } else {
      set({ kingOfTeamB: studentName });
    }
  },

  setRPSResult: (winner) =>
    set({
      currentAttacker: winner,
      phase: 'QUIZ',
    }),

  setCurrentQuestion: (question) =>
    set({
      currentQuestion: question,
      totalQuestionsAsked: get().totalQuestionsAsked + 1,
    }),

  submitAnswer: (answer, isCorrect) => {
    const state = get();
    const record: QuestionRecord = {
      question_id: state.currentQuestion?.id ?? '',
      question_text: state.currentQuestion?.question_text ?? '',
      attacker: state.currentAttacker,
      answer_given: answer,
      correct: isCorrect,
    };

    if (isCorrect) {
      set({
        totalCorrect: state.totalCorrect + 1,
        currentRoundQuestions: [...state.currentRoundQuestions, record],
        phase: 'GUESS_KING',
        usedQuestionIds: state.currentQuestion
          ? [...state.usedQuestionIds, state.currentQuestion.id]
          : state.usedQuestionIds,
      });
    } else {
      const newAttacker: 'team_a' | 'team_b' =
        state.currentAttacker === 'team_a' ? 'team_b' : 'team_a';
      set({
        currentRoundQuestions: [...state.currentRoundQuestions, record],
        currentAttacker: newAttacker,
        currentQuestion: null,
        phase: 'WRONG_ANSWER',
        usedQuestionIds: state.currentQuestion
          ? [...state.usedQuestionIds, state.currentQuestion.id]
          : state.usedQuestionIds,
      });
    }
  },

  guessKing: (studentName) => {
    const state = get();
    const targetTeam = state.currentAttacker === 'team_a' ? 'team_b' : 'team_a';
    const king = targetTeam === 'team_a' ? state.kingOfTeamA : state.kingOfTeamB;
    const isKing = studentName === king;

    const updatedRecord: QuestionRecord = {
      ...state.currentRoundQuestions[state.currentRoundQuestions.length - 1]!,
      king_guess: studentName,
      king_found: isKing,
    };
    const updatedRoundQuestions = [
      ...state.currentRoundQuestions.slice(0, -1),
      updatedRecord,
    ];

    if (isKing) {
      const scoringTeam = state.currentAttacker;
      const newScoreA = scoringTeam === 'team_a' ? state.teamA.score + 1 : state.teamA.score;
      const newScoreB = scoringTeam === 'team_b' ? state.teamB.score + 1 : state.teamB.score;

      const roundRecord: RoundRecord = {
        round_number: state.roundHistory.length + 1,
        king_of_a: state.kingOfTeamA ?? '',
        king_of_b: state.kingOfTeamB ?? '',
        winner: scoringTeam,
        questions_in_round: updatedRoundQuestions,
      };

      const isGameOver =
        newScoreA >= state.targetScore || newScoreB >= state.targetScore;

      set({
        teamA: { ...state.teamA, score: newScoreA },
        teamB: { ...state.teamB, score: newScoreB },
        roundHistory: [...state.roundHistory, roundRecord],
        currentRoundQuestions: [],
        lastGuessResult: 'found',
        lastGuessedStudent: studentName,
        phase: isGameOver ? 'GAME_OVER' : 'ROUND_RESULT',
      });
    } else {
      const revealedKey = targetTeam === 'team_a' ? 'revealedA' : 'revealedB';
      const currentRevealed = targetTeam === 'team_a' ? state.revealedA : state.revealedB;
      const newRevealed = [...currentRevealed, studentName];

      const targetStudents = targetTeam === 'team_a' ? state.teamA.students : state.teamB.students;
      const unrevealed = targetStudents.filter(
        (s) => !newRevealed.includes(s) && s !== king
      );

      if (unrevealed.length === 0 && king) {
        const scoringTeam = state.currentAttacker;
        const newScoreA = scoringTeam === 'team_a' ? state.teamA.score + 1 : state.teamA.score;
        const newScoreB = scoringTeam === 'team_b' ? state.teamB.score + 1 : state.teamB.score;

        const roundRecord: RoundRecord = {
          round_number: state.roundHistory.length + 1,
          king_of_a: state.kingOfTeamA ?? '',
          king_of_b: state.kingOfTeamB ?? '',
          winner: scoringTeam,
          questions_in_round: updatedRoundQuestions,
        };

        const isGameOver =
          newScoreA >= state.targetScore || newScoreB >= state.targetScore;

        set({
          [revealedKey]: newRevealed,
          teamA: { ...state.teamA, score: newScoreA },
          teamB: { ...state.teamB, score: newScoreB },
          roundHistory: [...state.roundHistory, roundRecord],
          currentRoundQuestions: [],
          lastGuessResult: 'found',
          lastGuessedStudent: king,
          phase: isGameOver ? 'GAME_OVER' : 'ROUND_RESULT',
        });
      } else {
        set({
          [revealedKey]: newRevealed,
          currentRoundQuestions: updatedRoundQuestions,
          lastGuessResult: 'not_found',
          lastGuessedStudent: studentName,
          currentQuestion: null,
          phase: 'ROUND_RESULT',
        });
      }
    }
  },

  switchAttacker: () => {
    const state = get();
    set({
      currentAttacker: state.currentAttacker === 'team_a' ? 'team_b' : 'team_a',
    });
  },

  startNewRound: () =>
    set({
      kingOfTeamA: null,
      kingOfTeamB: null,
      revealedA: [],
      revealedB: [],
      currentQuestion: null,
      currentRoundQuestions: [],
      lastGuessResult: null,
      lastGuessedStudent: null,
      phase: 'KING_SELECT_A',
    }),

  endGame: () => set({ phase: 'GAME_OVER' }),

  resetGame: () => set({ ...initialState }),

  setQuestionPool: (pool) => set({ questionPool: pool }),

  addUsedQuestionId: (id) =>
    set((state) => ({
      usedQuestionIds: [...state.usedQuestionIds, id],
    })),
}));
