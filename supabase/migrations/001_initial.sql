-- KingSeeker 초기 데이터베이스 스키마
-- 2022 개정 교육과정 기반 교실 퀴즈 배틀 게임

-- 교사 테이블
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  school_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 학급 테이블
CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade INT NOT NULL,
  students JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 문제 은행 테이블
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade INT NOT NULL,
  subject TEXT NOT NULL,
  unit TEXT NOT NULL,
  unit_code TEXT,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty INT DEFAULT 2,
  used_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_grade_subject ON questions(grade, subject);
CREATE INDEX idx_questions_unit ON questions(unit);
CREATE INDEX idx_questions_used ON questions(used_count);

-- 게임 기록 테이블
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES classrooms(id) ON DELETE SET NULL,
  grade INT NOT NULL,
  subject TEXT NOT NULL,
  unit TEXT NOT NULL,
  team_a_name TEXT NOT NULL DEFAULT '청룡',
  team_b_name TEXT NOT NULL DEFAULT '백호',
  team_a_students JSONB NOT NULL DEFAULT '[]',
  team_b_students JSONB NOT NULL DEFAULT '[]',
  team_a_score INT DEFAULT 0,
  team_b_score INT DEFAULT 0,
  target_score INT DEFAULT 3,
  winner TEXT,
  rounds JSONB DEFAULT '[]',
  total_questions_asked INT DEFAULT 0,
  total_correct INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 교사 커스텀 문제 테이블
CREATE TABLE custom_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
  grade INT NOT NULL,
  subject TEXT NOT NULL,
  unit TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice',
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty INT DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_questions ENABLE ROW LEVEL SECURITY;

-- teachers: 본인 데이터만 CRUD
CREATE POLICY "teachers_select_own" ON teachers
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "teachers_insert_own" ON teachers
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "teachers_update_own" ON teachers
  FOR UPDATE USING (auth.uid() = id);

-- classrooms: 본인 teacher_id 데이터만 CRUD
CREATE POLICY "classrooms_select_own" ON classrooms
  FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "classrooms_insert_own" ON classrooms
  FOR INSERT WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "classrooms_update_own" ON classrooms
  FOR UPDATE USING (teacher_id = auth.uid());
CREATE POLICY "classrooms_delete_own" ON classrooms
  FOR DELETE USING (teacher_id = auth.uid());

-- questions: 모든 인증 유저가 읽기 가능
CREATE POLICY "questions_select_all" ON questions
  FOR SELECT USING (true);

-- games: 본인 teacher_id 데이터만 CRUD
CREATE POLICY "games_select_own" ON games
  FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "games_insert_own" ON games
  FOR INSERT WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "games_update_own" ON games
  FOR UPDATE USING (teacher_id = auth.uid());

-- custom_questions: 본인 teacher_id 데이터만 CRUD
CREATE POLICY "custom_questions_select_own" ON custom_questions
  FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "custom_questions_insert_own" ON custom_questions
  FOR INSERT WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "custom_questions_update_own" ON custom_questions
  FOR UPDATE USING (teacher_id = auth.uid());
CREATE POLICY "custom_questions_delete_own" ON custom_questions
  FOR DELETE USING (teacher_id = auth.uid());
