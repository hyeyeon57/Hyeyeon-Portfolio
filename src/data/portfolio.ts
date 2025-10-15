import { PersonalInfo, Project, Education, Experience, Skill } from '@/types/portfolio';

export const personalInfo: PersonalInfo = {
  name: '장혜연',
  englishName: 'Hyeyeon Jang',
  title: '내비게이션 같은 기획자',
  bio: '문제 속에서도 길을 찾아 해결하는, 내비게이션 같은 기획자 장혜연입니다.',
  description: '사용자의 여정 속 문제를 정의하고, 더 나은 방향을 설계합니다.',
  email: 'janghaeyo0507@gmail.com',
  phone: '010-2807-5250',
  location: '경기도 용인시 구갈동 377',
  social: {
    github: '#',
    linkedin: '#',
    instagram: '#',
    notion: '#'
  },
  availableDate: '채용 확정 후 즉시 가능',
  resumeUrl: '/resume.pdf',
  coverLetterUrl: '/cover-letter.pdf'
};

export const projects: Project[] = [
  {
    id: '1',
    title: '화해 앱 리뉴얼 제안서',
    subtitle: '화장품 추천 및 리뷰 플랫폼 리뉴얼',
    description: '사용자 피드백 분석을 통한 화해 앱의 사용성 개선 및 새로운 기능 제안',
    fullDescription: '화해 앱의 기존 사용자 피드백을 분석하고, 사용성 문제점을 파악하여 리뉴얼 방향을 제시했습니다. 화장품 추천 알고리즘 개선과 리뷰 시스템 최적화에 중점을 두었습니다.',
    image: '/projects/hwahae.jpg',
    tags: ['리뉴얼', '사용성 개선', '추천 시스템'],
    category: 'app-web',
    date: '2024',
    role: 'UX 기획자',
    duration: '2개월',
    team: '3명',
    achievements: [
      '사용자 피드백 분석 완료',
      '추천 알고리즘 개선안 제시',
      '리뷰 시스템 UX 개선'
    ],
    link: '#',
    featured: true
  },
  {
    id: '2',
    title: '맘으로',
    subtitle: '육아정책 통합 앱 신규 기획',
    description: '복잡한 육아정책 정보를 쉽게 찾을 수 있는 통합 플랫폼 설계',
    fullDescription: '산모와 영유아 부모를 위한 육아정책 통합 앱을 기획했습니다. 복잡한 정책 정보를 사용자 중심으로 재구성하여 접근성을 크게 향상시켰습니다.',
    image: '/projects/momro.jpg',
    tags: ['신규 기획', '정책 정보', '사용자 중심 설계'],
    category: 'app-web',
    date: '2024',
    role: 'UX 기획자',
    duration: '3개월',
    team: '4명',
    achievements: [
      '정책 정보 접근성 향상',
      '사용자 탐색 효율 개선',
      '맞춤형 추천 시스템 설계'
    ],
    link: '#',
    featured: true
  },
  {
    id: '3',
    title: 'SRT 승차권 예매 편의성 개선',
    subtitle: '예매 프로세스 최적화 프로젝트',
    description: 'IA 설계 및 화면 설계서 작성으로 예매 단계를 7단계에서 4단계로 축소',
    fullDescription: 'SRT 예매 시스템의 복잡한 프로세스를 분석하고 재설계했습니다. IA 설계와 UX 플로우 재구성을 통해 예매 단계를 축소하고 접근성 및 사용성을 개선했습니다.',
    image: '/projects/srt.jpg',
    tags: ['IA 설계', '화면설계서', 'UX 플로우'],
    category: 'app-web',
    date: '2024',
    role: 'UX 기획자',
    duration: '3개월',
    team: '3명',
    achievements: [
      '예매 단계 7→4단계 축소',
      '접근성 및 사용성 개선',
      '화면설계서 작성 및 개발 전달'
    ],
    link: '#',
    featured: true
  },
  {
    id: '4',
    title: '밀리의 서재 사용성 개선',
    subtitle: '사용자 중심 UX 리서치 및 개선 프로젝트',
    description: '사용자 인터뷰와 아이트래킹 분석을 통해 책장 관리 성공률을 60%에서 96%로 향상',
    fullDescription: '밀리의 서재 앱의 사용성 문제를 발견하고 개선했습니다. 사용자 인터뷰와 아이트래킹 분석을 통해 핵심 문제를 정의하고, UI 개선 제안으로 책장 관리 성공률을 크게 향상시켰습니다.',
    image: '/projects/millie.jpg',
    tags: ['사용자 인터뷰', '아이트래킹', 'UI 개선'],
    category: 'usability',
    date: '2024',
    role: 'UX 리서처',
    duration: '2개월',
    team: '2명',
    achievements: [
      '책장 관리 성공률 60% → 96% 향상',
      '아이트래킹 데이터 기반 인사이트 도출',
      'UI 개선안 제시 및 검증'
    ],
    link: '#',
    featured: true
  },
  {
    id: '5',
    title: '계원예술대학교 웹사이트 리뉴얼',
    subtitle: '대학 웹사이트 사용성 개선 프로젝트',
    description: '대학 웹사이트의 정보 구조 개선 및 사용자 경험 최적화',
    fullDescription: '계원예술대학교 웹사이트의 사용성 문제를 분석하고 리뉴얼 방향을 제시했습니다. 정보 구조 개선과 사용자 중심의 네비게이션 설계에 중점을 두었습니다.',
    image: '/projects/kaywon.jpg',
    tags: ['웹사이트 리뉴얼', '정보 구조', '사용성 개선'],
    category: 'web-app',
    date: '2024',
    role: 'UX 기획자',
    duration: '2개월',
    team: '3명',
    achievements: [
      '정보 구조 개선안 제시',
      '사용자 네비게이션 최적화',
      '웹사이트 사용성 향상'
    ],
    link: '#',
    featured: true
  },
  {
    id: '6',
    title: 'ART-LANG',
    subtitle: '신진 작가와 아트슈머를 잇는 온라인 전시 플랫폼',
    description: 'IA 설계, UX 구조 기획, 감정 기반 피드 디자인을 통해 전시 참여 프로세스를 획기적으로 개선',
    fullDescription: '신진 작가와 아트슈머를 연결하는 온라인 전시 플랫폼 ArtLang의 사용자 경험을 설계했습니다. 복잡했던 전시 참여 프로세스를 3단계에서 1단계로 단축하여 사용자 참여율을 크게 향상시켰습니다.',
    image: '/projects/artlang.jpg',
    tags: ['IA 설계', 'UX 기획', '감정 기반 디자인'],
    category: 'app-web',
    date: '2024',
    role: 'UX 기획자',
    duration: '3개월',
    team: '4명',
    achievements: [
      '전시 참여 프로세스 3단계 → 1단계 단축',
      '사용자 참여율 향상',
      '감정 기반 피드 시스템 설계'
    ],
    link: '#',
    featured: true
  },
  {
    id: '7',
    title: '쿠팡 리뉴얼 프로젝트',
    subtitle: '이커머스 플랫폼 사용성 개선',
    description: '쿠팡 앱의 구매 프로세스 최적화 및 사용자 경험 개선 제안',
    fullDescription: '쿠팡 앱의 구매 프로세스를 분석하고 사용성 개선 방안을 제시했습니다. 복잡한 구매 단계를 단순화하고 사용자 만족도를 향상시키는 방향으로 기획했습니다.',
    image: '/projects/coupang.jpg',
    tags: ['이커머스', '구매 프로세스', '사용성 개선'],
    category: 'app-web',
    date: '2024',
    role: 'UX 기획자',
    duration: '2개월',
    team: '3명',
    achievements: [
      '구매 프로세스 단순화',
      '사용자 만족도 향상',
      '구매 전환율 개선'
    ],
    link: '#',
    featured: false
  },
  {
    id: '8',
    title: '데이터 시각화 프로젝트',
    subtitle: 'Data Storytelling & 대시보드 UX',
    description: '복잡한 데이터를 사용자가 직관적으로 이해할 수 있는 대시보드 및 인터랙티브 시각화 설계',
    fullDescription: '복잡한 데이터를 사용자가 직관적으로 이해할 수 있는 대시보드와 인터랙티브 시각화를 기획했습니다. 데이터의 흐름과 관계를 쉽게 파악할 수 있도록 시각적 인사이트를 제공하는 시스템을 설계했습니다.',
    image: '/projects/dataviz.jpg',
    tags: ['Data Storytelling', '대시보드 UX', '시각적 인사이트'],
    category: 'proposal',
    date: '2024',
    role: '데이터 분석 기획',
    duration: '3개월',
    team: '4명',
    achievements: [
      '데이터 맵 설계 완료',
      '시각화 IA 구조 설계',
      '대시보드 와이어프레임 제작'
    ],
    link: '#',
    featured: false
  },
  {
    id: '9',
    title: 'Portfolio Website',
    subtitle: 'Cursor AI × Figma MCP 연동 제작',
    description: '기획자의 시선으로 디자인부터 코드까지 직접 설계하며, AI를 활용한 사고 확장과 문서화 중심의 제작 프로세스 구축',
    fullDescription: '기획자로서 AI를 활용해 포트폴리오 웹사이트를 직접 기획하고 제작했습니다. Cursor AI와 Figma MCP를 연동하여 디자인 시스템부터 코드까지 일관성 있게 구현했습니다.',
    image: '/projects/portfolio.jpg',
    tags: ['AI 활용', 'Cursor', 'Figma MCP', '웹 기획'],
    category: 'web',
    date: '2025',
    role: '기획자 & 개발자',
    duration: '1개월',
    team: '1명',
    achievements: [
      'AI를 활용한 효율적 기획 프로세스',
      'Figma 디자인 시스템 완벽 구현',
      '문서화 중심의 체계적 제작'
    ],
    link: '#',
    featured: false
  }
];

export const education: Education[] = [
  {
    id: '1',
    school: '계원예술대학교',
    degree: '디지털미디어디자인과 (기획 전공)',
    period: '2020.03 - 2025.02',
    description: 'UX/UI 기획 및 디지털 미디어 디자인 전공'
  }
];

export const experience: Experience[] = [
  {
    id: '1',
    company: 'KOC 기획 동아리',
    position: '콘텐츠 기획',
    period: '2025.09 - 2026.03',
    description: '콘텐츠 기획 및 아이디어 시각화, 멘토링 카드뉴스 제작',
    achievements: [
      '협업 및 아이디어 구체화 능력 향상',
      '멘토링 콘텐츠 기획 및 제작',
      '팀 프로젝트 리딩'
    ]
  },
  {
    id: '2',
    company: 'CU 편의점',
    position: '매장 관리 (파트타이머)',
    period: '2024.09 - 2025.09',
    description: 'POS 운영, 재고·마감 프로세스 관리, 고객 응대 및 서비스 개선',
    achievements: [
      '사용자 중심 사고 및 대응력 향상',
      '프로세스 관리 및 최적화',
      '고객 서비스 개선'
    ]
  },
  {
    id: '3',
    company: 'MASCO',
    position: '내비게이션 QA',
    period: '2023.04 - 2024.09',
    description: '화면설계서 기반 오류 검증, Mcols 이슈 등록 및 품질 표준화',
    achievements: [
      '문제 정의 및 UX 검증 능력 습득',
      '화면설계서 기반 품질 관리',
      '이슈 트래킹 및 커뮤니케이션'
    ]
  },
  {
    id: '4',
    company: '라라코스트 레스토랑',
    position: '서비스 매니저',
    period: '2022.01 - 2022.10',
    description: '매장 내 고객 응대 및 서비스 관리, 문제 상황 대응 및 협업 경험',
    achievements: [
      '고객 대응 및 문제 해결',
      '서비스 프로세스 개선',
      '팀 협업 경험'
    ]
  }
];

export const skills: Skill[] = [
  {
    id: '1',
    name: 'Figma',
    category: '기획 도구',
    level: 5,
    description: '서비스 구조 설계, 프로토타이핑'
  },
  {
    id: '2',
    name: 'Excel',
    category: '분석 도구',
    level: 4.5,
    description: '리서치 데이터 분석 및 인사이트 정리'
  },
  {
    id: '3',
    name: 'Google Spreadsheet',
    category: '협업 도구',
    level: 4,
    description: '팀 단위 협업, 실시간 관리'
  },
  {
    id: '4',
    name: 'PowerPoint',
    category: '문서화',
    level: 4.5,
    description: '기획서 시각화 및 스토리테링'
  },
  {
    id: '5',
    name: 'AI Tools (Cursor·GPT·Gemini·UXpilot)',
    category: 'AI 활용',
    level: 5,
    description: '아이디어 확장, 기획 문서화, 효율적 협업'
  },
  {
    id: '6',
    name: 'Notion',
    category: '협업 도구',
    level: 4,
    description: '협업, 일정, 프로젝트 관리'
  },
  {
    id: '7',
    name: 'Eye-Tracking (Tobii Pro)',
    category: '리서치',
    level: 4.5,
    description: '시선 데이터 기반 UX 검증'
  },
  {
    id: '8',
    name: 'MS Word / 한글(HWP)',
    category: '문서화',
    level: 4,
    description: '기획 문서 작성'
  },
  {
    id: '9',
    name: 'Illustrator',
    category: '디자인 보조',
    level: 3,
    description: '아이콘 및 그래픽 작업'
  },
  {
    id: '10',
    name: 'Photoshop',
    category: '디자인 보조',
    level: 3,
    description: '이미지 편집'
  },
  {
    id: '11',
    name: 'Premiere Pro',
    category: '영상 편집',
    level: 3,
    description: '영상 콘텐츠 제작'
  }
];
