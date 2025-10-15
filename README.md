# 포트폴리오 웹사이트

Figma 디자인 가이드를 기반으로 제작한 현대적이고 아름다운 포트폴리오 웹사이트입니다.

## 주요 기능

✨ **대표 프로젝트 전시**
- 대표 프로젝트 3개 하이라이트 표시
- 전체 프로젝트 목록 보기 기능
- 각 프로젝트의 상세 정보 및 미리보기 모달

👤 **개인 정보 섹션**
- 이름, 직함, 연락처 정보
- 프로필 소개
- 소셜 미디어 링크

🎓 **학력 및 경력**
- 시각적 타임라인 디자인
- 경력 사항 및 주요 성과
- 학력 정보

💼 **스킬 및 툴 활용도**
- 카테고리별 스킬 분류
- 각 툴의 숙련도 시각화 (1-5 레벨)
- 애니메이션 프로그레스 바

📱 **반응형 디자인**
- 모바일, 태블릿, 데스크톱 최적화
- 다크/라이트 모드 대응 준비
- 부드러운 스크롤 및 애니메이션

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
npm run build
```

### 프로덕션 실행

```bash
npm start
```

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx          # 메인 레이아웃 (Header, Footer 포함)
│   ├── page.tsx            # 홈 페이지
│   └── globals.css         # 글로벌 스타일
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # 네비게이션 헤더
│   │   └── Footer.tsx      # 푸터
│   ├── sections/
│   │   ├── HeroSection.tsx         # 히어로 섹션
│   │   ├── ProjectsSection.tsx     # 프로젝트 섹션
│   │   ├── ExperienceSection.tsx   # 경력/학력 섹션
│   │   ├── SkillsSection.tsx       # 스킬 섹션
│   │   └── ContactSection.tsx      # 연락처 섹션
│   └── ui/
│       ├── Button.tsx      # 버튼 컴포넌트
│       └── Input.tsx       # 입력 컴포넌트
├── data/
│   └── portfolio.ts        # 포트폴리오 데이터
├── types/
│   └── portfolio.ts        # TypeScript 타입 정의
└── lib/
    └── utils.ts            # 유틸리티 함수
```

## 커스터마이징

### 개인 정보 수정

`src/data/portfolio.ts` 파일에서 다음 내용을 수정하세요:

- `personalInfo`: 이름, 직함, 이메일, 연락처, 소개 등
- `projects`: 프로젝트 목록 및 상세 정보
- `education`: 학력 정보
- `experience`: 경력 정보
- `skills`: 스킬 및 툴 활용도

### 디자인 커스터마이징

- `src/app/globals.css`: 전역 스타일 및 테마 색상
- `tailwind.config.ts`: Tailwind CSS 설정
- 각 섹션 컴포넌트에서 색상, 레이아웃, 애니메이션 수정 가능

## 디자인 가이드

이 프로젝트는 **실제 Figma 디자인 시스템**을 기반으로 제작되었습니다:

### 📊 Figma Color System (실제 적용됨)

#### 브랜드 컬러
- **Main**: `#6100FF` (보라색) - 주요 CTA 및 포인트 색상
- **Sub 1**: `#39C3B6` (청록색) - 보조 액센트 색상
- **Sub 2**: `#F59917` (주황색) - 강조 포인트 색상

#### 시스템 컬러
- **텍스트**
  - Primary: `#111111` (메인 텍스트)
  - Secondary: `#505050` (서브 텍스트)
  - Tertiary: `#767676` (보조 텍스트)
  - Disabled: `#999999` (비활성 텍스트)

- **라인**
  - Light: `#F1F1F5` (연한 라인)
  - Medium: `#E5E5EC` (중간 라인)
  - Dark: `#111111` (진한 라인)

- **배경**
  - Light: `#F7F7FB` (연한 배경)
  - Medium: `#F1F1F5` (진한 배경)

- **상태**
  - Danger: `#DC0000` (위험/실패)
  - Success: `#04B014` (성공/안전)
  - Warning: `#FFAA00` (주의/경고)

### 디자인 가이드 구성
- **Color Guide**: Figma에서 추출한 실제 색상 시스템
- **Typography Guide**: 체계적인 텍스트 스타일 (Pretendard 폰트)
- **Button Guide**: 브랜드 색상을 활용한 버튼 디자인
- **Input Box Guide**: 상태별 색상이 적용된 폼 요소
- **Icon Guide**: 통일된 아이콘 시스템 (Lucide React)

## 배포

### Vercel (권장)

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel
```

### 다른 플랫폼

Next.js는 다양한 플랫폼에 배포 가능합니다:
- Netlify
- AWS Amplify
- Docker

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참조하세요.

## 라이선스

MIT

## 연락처

프로젝트에 대한 문의사항이 있으시면 연락주세요!
