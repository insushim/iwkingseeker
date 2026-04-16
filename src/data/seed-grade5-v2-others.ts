import type { QuestionSeed } from './questions-seed';

const out: QuestionSeed[] = [];

// ============================================================
// 국어
// ============================================================
{
  const push = (q: Omit<QuestionSeed, 'grade' | 'subject'>) =>
    out.push({ grade: 5, subject: '국어', ...q });

  // 속담과 뜻
  const proverbs = [
    { p: '가는 말이 고와야 오는 말이 곱다', m: '내가 남에게 말을 곱게 해야 남도 나에게 곱게 한다' },
    { p: '구슬이 서 말이라도 꿰어야 보배', m: '아무리 좋은 것도 쓸모 있게 해야 가치가 있다' },
    { p: '낮말은 새가 듣고 밤말은 쥐가 듣는다', m: '아무리 비밀스럽게 한 말도 남이 듣게 된다' },
    { p: '돌다리도 두들겨 보고 건너라', m: '잘 아는 일이라도 신중하게 해야 한다' },
    { p: '등잔 밑이 어둡다', m: '가까이 있는 것을 오히려 잘 모른다' },
    { p: '말 한마디로 천 냥 빚을 갚는다', m: '말을 잘하면 큰 문제도 해결할 수 있다' },
    { p: '백지장도 맞들면 낫다', m: '쉬운 일이라도 함께 하면 더 낫다' },
    { p: '벼는 익을수록 고개를 숙인다', m: '훌륭한 사람일수록 겸손하다' },
    { p: '소 잃고 외양간 고친다', m: '일이 이미 잘못된 뒤에 뒤늦게 대책을 세운다' },
    { p: '우물 안 개구리', m: '넓은 세상을 모르고 좁은 소견만 가진 사람' },
    { p: '원숭이도 나무에서 떨어진다', m: '아무리 잘하는 사람도 실수할 때가 있다' },
    { p: '천 리 길도 한 걸음부터', m: '아무리 큰일도 작은 시작에서부터 이루어진다' },
    { p: '티끌 모아 태산', m: '작은 것도 모이면 큰 것이 된다' },
    { p: '호랑이 굴에 가야 호랑이 새끼를 잡는다', m: '원하는 것을 얻으려면 위험을 무릅써야 한다' },
    { p: '세 살 버릇 여든까지 간다', m: '어릴 때 몸에 밴 습관은 오래 간다' },
    { p: '가재는 게 편', m: '비슷한 처지의 사람끼리 서로 편을 든다' },
    { p: '믿는 도끼에 발등 찍힌다', m: '믿었던 것에서 오히려 해를 입는다' },
    { p: '발 없는 말이 천 리 간다', m: '말은 빠르게 널리 퍼진다' },
    { p: '사공이 많으면 배가 산으로 간다', m: '주장하는 사람이 많으면 일이 엉뚱하게 된다' },
    { p: '호미로 막을 것을 가래로 막는다', m: '일이 작을 때 해결하지 않으면 나중에 크게 고생한다' },
  ];
  for (const pr of proverbs) {
    push({
      unit: '속담과 관용 표현',
      unit_code: null,
      question_type: 'short_answer',
      question_text: `속담 "${pr.p}"의 뜻으로 알맞은 것은?`,
      options: null,
      correct_answer: pr.m,
      explanation: `"${pr.p}"은(는) ${pr.m}는 뜻입니다.`,
      difficulty: 2,
    });
  }

  // 높임말
  const hon = [
    { base: '밥', high: '진지' },
    { base: '말', high: '말씀' },
    { base: '나이', high: '연세' },
    { base: '이', high: '치아' },
    { base: '생일', high: '생신' },
    { base: '집', high: '댁' },
    { base: '이름', high: '성함' },
    { base: '묻다', high: '여쭙다' },
    { base: '먹다', high: '드시다(잡수시다)' },
    { base: '주다', high: '드리다' },
    { base: '자다', high: '주무시다' },
    { base: '있다', high: '계시다' },
    { base: '죽다', high: '돌아가시다' },
    { base: '아프다', high: '편찮으시다' },
  ];
  for (const h of hon) {
    push({
      unit: '높임 표현',
      unit_code: null,
      question_type: 'short_answer',
      question_text: `"${h.base}"을(를) 높여 이르는 말은?`,
      options: null,
      correct_answer: h.high,
      explanation: `"${h.base}"의 높임말은 "${h.high}"입니다.`,
      difficulty: 2,
    });
  }

  // 한자어 뜻
  const hanja = [
    { w: '독서(讀書)', m: '책을 읽음' },
    { w: '일기(日記)', m: '날마다 그날그날 겪은 일을 적은 기록' },
    { w: '학교(學校)', m: '학생이 배우는 곳' },
    { w: '공부(工夫)', m: '학문이나 기술을 배우고 익힘' },
    { w: '친구(親舊)', m: '가깝고 오래 사귄 사람' },
    { w: '부모(父母)', m: '아버지와 어머니' },
    { w: '형제(兄弟)', m: '형과 아우' },
    { w: '가족(家族)', m: '혈연으로 이루어진 한집안' },
    { w: '국어(國語)', m: '나라의 말' },
    { w: '외국(外國)', m: '다른 나라' },
    { w: '신문(新聞)', m: '새로운 소식을 전하는 인쇄물' },
    { w: '교실(敎室)', m: '수업을 하는 방' },
    { w: '식당(食堂)', m: '음식을 먹는 곳' },
    { w: '역사(歷史)', m: '과거에 일어난 일을 적은 것' },
    { w: '음악(音樂)', m: '소리로 이루어진 예술' },
  ];
  for (const h of hanja) {
    push({
      unit: '낱말의 뜻',
      unit_code: null,
      question_type: 'short_answer',
      question_text: `"${h.w}"의 뜻으로 알맞은 것은?`,
      options: null,
      correct_answer: h.m,
      explanation: `${h.w}은(는) ${h.m}을(를) 뜻합니다.`,
      difficulty: 2,
    });
  }

  // 유의어/반대말
  const opposites = [
    { a: '크다', b: '작다' },
    { a: '길다', b: '짧다' },
    { a: '빠르다', b: '느리다' },
    { a: '높다', b: '낮다' },
    { a: '많다', b: '적다' },
    { a: '쉽다', b: '어렵다' },
    { a: '가볍다', b: '무겁다' },
    { a: '기쁘다', b: '슬프다' },
    { a: '뜨겁다', b: '차갑다' },
    { a: '멀다', b: '가깝다' },
    { a: '두껍다', b: '얇다' },
    { a: '열다', b: '닫다' },
    { a: '오다', b: '가다' },
    { a: '서다', b: '앉다' },
    { a: '주다', b: '받다' },
    { a: '사다', b: '팔다' },
  ];
  for (const p of opposites) {
    push({
      unit: '반대말',
      unit_code: null,
      question_type: 'short_answer',
      question_text: `"${p.a}"의 반대말은?`,
      options: null,
      correct_answer: p.b,
      explanation: `"${p.a}"의 반대말은 "${p.b}"입니다.`,
      difficulty: 1,
    });
    push({
      unit: '반대말',
      unit_code: null,
      question_type: 'short_answer',
      question_text: `"${p.b}"의 반대말은?`,
      options: null,
      correct_answer: p.a,
      explanation: `"${p.b}"의 반대말은 "${p.a}"입니다.`,
      difficulty: 1,
    });
  }

  // 문법: 품사 구별 (명사/동사/형용사/부사만 사용)
  const words = [
    { w: '사과', pos: '명사' },
    { w: '달리다', pos: '동사' },
    { w: '예쁘다', pos: '형용사' },
    { w: '빨리', pos: '부사' },
    { w: '책상', pos: '명사' },
    { w: '먹다', pos: '동사' },
    { w: '아름답다', pos: '형용사' },
    { w: '천천히', pos: '부사' },
    { w: '학교', pos: '명사' },
    { w: '뛰다', pos: '동사' },
    { w: '높다', pos: '형용사' },
    { w: '매우', pos: '부사' },
    { w: '친구', pos: '명사' },
    { w: '공부하다', pos: '동사' },
    { w: '크다', pos: '형용사' },
    { w: '자주', pos: '부사' },
  ];
  for (const w of words) {
    push({
      unit: '품사',
      unit_code: null,
      question_type: 'multiple_choice',
      question_text: `"${w.w}"의 품사는?`,
      options: ['명사', '동사', '형용사', '부사'],
      correct_answer: w.pos,
      explanation: `"${w.w}"은(는) ${w.pos}입니다.`,
      difficulty: 2,
    });
  }

  // 문장 호응 OX
  const sentOX = [
    { s: '"절대로 가겠다."는 올바른 호응이다.', a: 'X' },
    { s: '"만약 내일 비가 오면 소풍을 가지 않을 것이다."는 올바른 호응이다.', a: 'O' },
    { s: '"비록 힘들지만 포기하지 않겠다."는 올바른 호응이다.', a: 'O' },
    { s: '"결코 그런 일은 없을 것이다."는 올바른 호응이다.', a: 'O' },
    { s: '"아마 그럴 것이다."는 올바른 호응이다.', a: 'O' },
    { s: '"왜냐하면 비가 왔다."는 올바른 호응이다.', a: 'X' },
    { s: '"마치 꿈처럼 느껴진다."는 올바른 호응이다.', a: 'O' },
    { s: '"반드시 성공하지 않는다."는 올바른 호응이다.', a: 'X' },
  ];
  for (const s of sentOX) {
    push({
      unit: '문장의 호응',
      unit_code: null,
      question_type: 'ox',
      question_text: s.s,
      options: ['O', 'X'],
      correct_answer: s.a,
      explanation: s.a === 'O' ? '올바른 호응입니다.' : '호응이 맞지 않는 문장입니다.',
      difficulty: 3,
    });
  }
}

// ============================================================
// 사회
// ============================================================
{
  const push = (q: Omit<QuestionSeed, 'grade' | 'subject'>) =>
    out.push({ grade: 5, subject: '사회', ...q });

  const historyFigures = [
    { name: '세종대왕', era: '조선', deed: '훈민정음(한글)을 창제하였다' },
    { name: '이순신', era: '조선', deed: '임진왜란 때 거북선으로 일본 수군을 무찔렀다' },
    { name: '정약용', era: '조선', deed: '실학을 집대성하고 거중기를 만들었다' },
    { name: '김구', era: '일제강점기', deed: '대한민국 임시정부에서 독립운동을 이끌었다' },
    { name: '안중근', era: '일제강점기', deed: '하얼빈역에서 이토 히로부미를 저격하였다' },
    { name: '유관순', era: '일제강점기', deed: '3·1 운동에 참여해 독립을 외쳤다' },
    { name: '왕건', era: '고려', deed: '고려를 세웠다' },
    { name: '대조영', era: '발해', deed: '발해를 세웠다' },
    { name: '주몽', era: '고구려', deed: '고구려를 세웠다' },
    { name: '온조', era: '백제', deed: '백제를 세웠다' },
    { name: '박혁거세', era: '신라', deed: '신라를 세웠다' },
    { name: '광개토대왕', era: '고구려', deed: '고구려의 영토를 크게 넓혔다' },
    { name: '장영실', era: '조선', deed: '자격루 등 과학 기기를 만들었다' },
    { name: '김정호', era: '조선', deed: '대동여지도를 만들었다' },
    { name: '신사임당', era: '조선', deed: '학문과 예술에 뛰어났으며 이이의 어머니이다' },
    { name: '이이', era: '조선', deed: '"성학집요" 등을 지은 조선의 대표적 유학자이다' },
    { name: '이황', era: '조선', deed: '성리학을 집대성하였다' },
    { name: '김유신', era: '신라', deed: '삼국 통일에 큰 공을 세웠다' },
  ];
  for (const f of historyFigures) {
    push({
      unit: '우리나라의 역사 인물',
      unit_code: null,
      question_type: 'short_answer',
      question_text: `${f.deed} ${f.era} 시대의 인물은 누구인가요?`,
      options: null,
      correct_answer: f.name,
      explanation: `${f.name}은(는) ${f.era}의 인물로 ${f.deed}.`,
      difficulty: 2,
    });
  }

  const events = [
    { e: '3·1 운동', y: '1919년', d: '일제의 무단 통치에 맞서 독립을 외친 민족 운동' },
    { e: '한글 창제', y: '1443년', d: '세종대왕이 백성을 위해 훈민정음을 만들었다' },
    { e: '임진왜란', y: '1592년', d: '일본이 조선을 침략한 전쟁' },
    { e: '병자호란', y: '1636년', d: '청나라가 조선을 침략한 전쟁' },
    { e: '6·25 전쟁', y: '1950년', d: '북한의 남침으로 시작된 한국 전쟁' },
    { e: '광복', y: '1945년', d: '일제로부터 독립한 해방' },
    { e: '대한민국 정부 수립', y: '1948년', d: '대한민국 정부가 공식 출범하였다' },
    { e: '5·18 민주화 운동', y: '1980년', d: '광주에서 일어난 민주화 운동' },
  ];
  for (const ev of events) {
    push({
      unit: '우리나라의 역사 사건',
      unit_code: null,
      question_type: 'short_answer',
      question_text: `${ev.y}에 일어난 "${ev.d}"은(는) 어떤 사건인가요?`,
      options: null,
      correct_answer: ev.e,
      explanation: `${ev.e}은(는) ${ev.y}에 일어났습니다.`,
      difficulty: 3,
    });
  }

  // 지역 특성 OX
  const regions = [
    { q: '제주도는 한라산이 있는 섬이다.', a: 'O' },
    { q: '독도는 우리나라 동쪽 끝에 있다.', a: 'O' },
    { q: '마라도는 우리나라 남쪽 끝에 있다.', a: 'O' },
    { q: '백두산은 우리나라에서 가장 높은 산이다.', a: 'O' },
    { q: '부산은 우리나라 최대 항구 도시이다.', a: 'O' },
    { q: '경주는 신라의 옛 수도이다.', a: 'O' },
    { q: '공주와 부여는 백제의 옛 수도였다.', a: 'O' },
    { q: '평양은 고구려의 옛 수도이다.', a: 'O' },
    { q: '제주도는 화산 활동으로 생긴 섬이다.', a: 'O' },
    { q: '우리나라는 삼면이 바다로 둘러싸여 있다.', a: 'O' },
    { q: '우리나라의 수도는 서울이다.', a: 'O' },
    { q: '한강은 북쪽에서 남쪽으로 흐른다.', a: 'X' },
    { q: '낙동강은 영남 지방의 큰 강이다.', a: 'O' },
    { q: '대전은 우리나라 중부의 교통 중심지이다.', a: 'O' },
    { q: '인천에는 국제공항이 있다.', a: 'O' },
  ];
  for (const r of regions) {
    push({
      unit: '우리나라의 국토',
      unit_code: null,
      question_type: 'ox',
      question_text: r.q,
      options: ['O', 'X'],
      correct_answer: r.a,
      explanation: r.a === 'O' ? '맞는 설명입니다.' : '틀린 설명입니다.',
      difficulty: 2,
    });
  }

  // 인권/법/민주주의
  const civics = [
    { q: '모든 사람은 태어날 때부터 인간답게 살 권리가 있다.', a: 'O' },
    { q: '법은 국민 모두가 지켜야 할 사회의 약속이다.', a: 'O' },
    { q: '국민의 대표를 뽑는 것을 선거라고 한다.', a: 'O' },
    { q: '우리나라는 삼권 분립 제도를 따른다.', a: 'O' },
    { q: '국회는 법을 만드는 일을 한다.', a: 'O' },
    { q: '법원은 법에 따라 재판을 하는 곳이다.', a: 'O' },
    { q: '대통령은 국민이 직접 뽑는다.', a: 'O' },
    { q: '헌법은 우리나라의 기본 법이다.', a: 'O' },
    { q: '민주주의는 국민이 주인이 되는 정치 방식이다.', a: 'O' },
    { q: '투표는 일정 나이가 되면 할 수 있는 국민의 권리이다.', a: 'O' },
  ];
  for (const c of civics) {
    push({
      unit: '인권과 민주주의',
      unit_code: null,
      question_type: 'ox',
      question_text: c.q,
      options: ['O', 'X'],
      correct_answer: c.a,
      explanation: '맞는 설명입니다.',
      difficulty: 2,
    });
  }
}

// ============================================================
// 도덕
// ============================================================
{
  const push = (q: Omit<QuestionSeed, 'grade' | 'subject'>) =>
    out.push({ grade: 5, subject: '도덕', ...q });

  const ethics = [
    { q: '약속은 지켜야 한다.', a: 'O' },
    { q: '다른 사람의 감정을 존중해야 한다.', a: 'O' },
    { q: '친구가 곤란할 때 도와주는 것은 좋은 행동이다.', a: 'O' },
    { q: '잘못을 했을 때 솔직하게 인정하는 것이 중요하다.', a: 'O' },
    { q: '다른 사람의 물건을 허락 없이 가져가도 된다.', a: 'X' },
    { q: '예의 바른 말과 행동은 상대방을 존중하는 태도이다.', a: 'O' },
    { q: '자기보다 약한 친구를 괴롭혀도 된다.', a: 'X' },
    { q: '가족과 이웃에게는 예의를 지키지 않아도 된다.', a: 'X' },
    { q: '자신의 꿈을 위해 꾸준히 노력하는 것이 중요하다.', a: 'O' },
    { q: '다른 사람의 의견도 존중할 줄 알아야 한다.', a: 'O' },
    { q: '공공장소에서는 규칙을 지켜야 한다.', a: 'O' },
    { q: '어려움에 빠진 사람을 모른 척해도 된다.', a: 'X' },
    { q: '친구와 갈등이 생기면 대화로 풀어야 한다.', a: 'O' },
    { q: '자신의 잘못을 남에게 떠넘기는 것은 옳지 않다.', a: 'O' },
    { q: '정직한 행동은 신뢰를 쌓는다.', a: 'O' },
    { q: '나와 다른 생각을 가진 사람을 무시해도 된다.', a: 'X' },
    { q: '가족 구성원은 서로 돕고 배려해야 한다.', a: 'O' },
    { q: '인터넷에서도 예의 있는 말을 사용해야 한다.', a: 'O' },
    { q: '자기의 일에 책임을 지는 태도가 필요하다.', a: 'O' },
    { q: '남에게 피해를 주더라도 내 목표만 이루면 된다.', a: 'X' },
  ];
  for (const e of ethics) {
    push({
      unit: '바르게 살아가는 우리',
      unit_code: null,
      question_type: 'ox',
      question_text: e.q,
      options: ['O', 'X'],
      correct_answer: e.a,
      explanation: e.a === 'O' ? '맞는 설명입니다.' : '옳지 않은 행동입니다.',
      difficulty: 1,
    });
  }
}

export const seedGrade5V2Others: QuestionSeed[] = out;
