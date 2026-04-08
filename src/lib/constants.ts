export const APP_NAME = 'KingSeeker';
export const APP_NAME_KO = '킹시커';
export const APP_SUBTITLE = '왕을 찾아라! 교실 퀴즈 배틀';

export const GRADES = [3, 4, 5, 6] as const;
export type Grade = (typeof GRADES)[number];

export const SUBJECTS = ['국어', '수학', '사회', '과학', '영어', '도덕'] as const;
export type Subject = (typeof SUBJECTS)[number];

export const QUESTION_TYPES = ['multiple_choice', 'ox', 'fill_blank', 'short_answer'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: '4지선다',
  ox: 'O/X',
  fill_blank: '빈칸 채우기',
  short_answer: '단답형',
};

export const TEAM_DEFAULTS = {
  A: { name: '청룡', emoji: '🐲', color: 'blue' as const },
  B: { name: '백호', emoji: '🐯', color: 'amber' as const },
};

export const TARGET_SCORES = [1, 2, 3, 4, 5] as const;
export const TIMER_OPTIONS = [10, 15, 20, 30, 45, 60] as const;

export const RPS_OPTIONS = ['rock', 'paper', 'scissors'] as const;
export type RPSChoice = (typeof RPS_OPTIONS)[number];

export const RPS_LABELS: Record<RPSChoice, string> = {
  rock: '✊ 바위',
  paper: '✋ 보',
  scissors: '✌️ 가위',
};

export const RPS_EMOJI: Record<RPSChoice, string> = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
};

export const CURRICULUM_UNITS: Record<string, Record<string, string[]>> = {
  '3': {
    '국어': [
      '1. 재미가 톡톡톡',
      '2. 문단의 짜임',
      '3. 알맞은 높임 표현',
      '4. 내 마음을 편지에 담아',
      '5. 중요한 내용을 적어요',
      '6. 작품을 읽고 느낌을 나눠요',
    ],
    '수학': [
      '1. 덧셈과 뺄셈',
      '2. 평면도형',
      '3. 나눗셈',
      '4. 곱셈',
      '5. 길이와 시간',
      '6. 분수와 소수',
    ],
    '사회': [
      '1. 우리 고장의 모습',
      '2. 우리가 알아보는 고장 이야기',
      '3. 교통과 통신 수단의 변화',
    ],
    '과학': [
      '1. 우리 생활과 물질',
      '2. 동물의 한살이',
      '3. 자석의 이용',
      '4. 지구의 모습',
      '5. 지표의 변화',
    ],
    '영어': [
      '1. Hello!',
      '2. What Is It?',
      '3. I Like Apples',
      '4. How Old Are You?',
    ],
    '도덕': [
      '1. 나와 너, 우리 함께',
      '2. 우리 모두 소중해요',
      '3. 생명을 존중해요',
    ],
  },
  '4': {
    '국어': [
      '1. 생각과 느낌을 나눠요',
      '2. 내용을 간추려요',
      '3. 느낌을 살려 말해요',
      '4. 이야기 속 세상',
      '5. 의견이 드러나는 글',
      '6. 회의를 해요',
    ],
    '수학': [
      '1. 큰 수',
      '2. 각도',
      '3. 곱셈과 나눗셈',
      '4. 삼각형',
      '5. 혼합 계산',
      '6. 막대그래프',
      '7. 규칙 찾기',
      '8. 분수의 덧셈과 뺄셈',
      '9. 사각형',
      '10. 다각형',
    ],
    '사회': [
      '1. 지역의 위치와 특성',
      '2. 우리 지역의 어제와 오늘',
      '3. 지역의 공공 기관과 주민 참여',
      '4. 촌락과 도시의 생활 모습',
    ],
    '과학': [
      '1. 식물의 한살이',
      '2. 물의 상태 변화',
      '3. 그림자와 거울',
      '4. 화산과 지진',
      '5. 물의 여행',
      '6. 식물의 생활',
    ],
    '영어': [
      '1. I Have a Pencil',
      "2. Let's Play Soccer",
      "3. It's Under the Table",
      '4. Do You Like Music?',
      "5. How's the Weather?",
    ],
    '도덕': [
      '1. 참된 아름다움을 찾아서',
      '2. 공정한 생활',
      '3. 아름다운 사람이 되는 길',
    ],
  },
  '5': {
    '국어': [
      '1. 대화와 공감',
      '2. 작품을 감상해요',
      '3. 글을 요약해요',
      '4. 글쓰기의 과정',
      '5. 글쓴이의 주장',
      '6. 토의하여 해결해요',
      '7. 기행문을 써요',
      '8. 아는 것과 새로 안 것',
      '9. 여러 가지 매체 자료',
      '10. 주인공이 되어',
    ],
    '수학': [
      '1. 자연수의 혼합 계산',
      '2. 약수와 배수',
      '3. 규칙과 대응',
      '4. 약분과 통분',
      '5. 분수의 덧셈과 뺄셈',
      '6. 다각형의 둘레와 넓이',
      '7. 수의 범위와 어림하기',
      '8. 분수의 곱셈',
      '9. 합동과 대칭',
      '10. 소수의 곱셈',
    ],
    '사회': [
      '1. 국토와 우리 생활',
      '2. 인권 존중과 정의로운 사회',
      '3. 우리 경제의 성장과 발전',
      '4. 우리 사회의 과제와 문화의 발전',
    ],
    '과학': [
      '1. 과학자는 어떻게 탐구할까요',
      '2. 온도와 열',
      '3. 태양계와 별',
      '4. 용해와 용액',
      '5. 다양한 생물과 우리 생활',
      '6. 물체의 운동',
    ],
    '영어': [
      '1. Hello, How Are You?',
      '2. What Day Is It?',
      '3. How Many Apples?',
      '4. I Like Spring',
      '5. Where Is My Bag?',
      '6. What Time Is It?',
      '7. She Is My Mom',
      '8. I Can Swim',
    ],
    '도덕': [
      '1. 도덕적 상상력, 나를 돌아보다',
      '2. 내 안의 소중한 친구, 자존감',
      '3. 긍정의 힘으로 극복하기',
      '4. 함께 만들어가는 사이버 세상',
    ],
  },
  '6': {
    '국어': [
      '1. 비유하는 표현',
      '2. 이야기를 간추려요',
      '3. 짜임새 있게 구성해요',
      '4. 효과적으로 발표해요',
      '5. 글에 담긴 생각과 비평',
      '6. 타당성을 생각하며 토론해요',
      '7. 우리말을 가꾸어요',
      '8. 인물의 삶을 찾아서',
    ],
    '수학': [
      '1. 분수의 나눗셈',
      '2. 각기둥과 각뿔',
      '3. 소수의 나눗셈',
      '4. 비와 비율',
      '5. 원의 넓이',
      '6. 직육면체의 부피와 겉넓이',
      '7. 여러 가지 그래프',
      '8. 비례식과 비례배분',
      '9. 원기둥, 원뿔, 구',
      '10. 경우의 수',
    ],
    '사회': [
      '1. 우리나라의 정치 발전',
      '2. 우리나라의 경제 발전',
      '3. 세계 여러 나라의 자연과 문화',
      '4. 통일 한국의 미래와 지구촌의 평화',
    ],
    '과학': [
      '1. 과학자처럼 탐구해 볼까요',
      '2. 지구와 달의 운동',
      '3. 여러 가지 기체',
      '4. 식물의 구조와 기능',
      '5. 빛과 렌즈',
      '6. 전기의 이용',
    ],
    '영어': [
      '1. What Grade Are You In?',
      '2. Is This Your Cap?',
      '3. What Are You Doing?',
      '4. When Is Your Birthday?',
      '5. How Much Is It?',
      '6. I Want to Be a Chef',
    ],
    '도덕': [
      '1. 내가 할 수 있는 것과 할 수 없는 것',
      '2. 마음을 열면 보이는 것들',
      '3. 함께 꿈꾸는 우리 사회',
      '4. 세계 속의 우리',
    ],
  },
};
