# Hyeyeon Portfolio Admin (백오피스)

포트폴리오 백오피스 관리 시스템입니다.

## 기능

- 프로젝트 관리 (CRUD)
- 연락 관리
- 방문자 통계 및 로그
- MongoDB 연동
- Vercel 배포 지원

## 설치

```bash
npm install
```

## 환경 변수 설정

`.env` 파일을 생성하고 다음 변수를 설정하세요:

```env
MONGODB_URI=mongodb://localhost:27017/vibe-coding-portfolio
PORT=3005
ADMIN_USERNAME=hing0915
ADMIN_PASSWORD=dpffla525!
SESSION_SECRET=vibe-coding-portfolio-secret-key-2025
```

## 실행

### 로컬 개발 서버

```bash
npm run dev
```

서버가 `http://localhost:3005`에서 실행됩니다.

### 관리자 페이지

- 로그인: `http://localhost:3005/admin/login`
- 대시보드: `http://localhost:3005/admin`
- 뷰어 모드: `http://localhost:3005/admin/viewer`

## 배포

Vercel에 배포하려면 `vercel.json` 설정을 확인하세요.

## 구조

```
├── server/
│   ├── admin/          # 관리자 페이지 HTML
│   ├── config/         # 데이터베이스 설정
│   ├── models/         # MongoDB 모델
│   └── index.cjs        # Express 서버
├── api/
│   └── index.js         # Vercel 서버리스 함수
└── vercel.json          # Vercel 배포 설정
```
