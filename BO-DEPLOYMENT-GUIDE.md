# 백오피스(BO) Vercel 배포 가이드

백오피스 화면을 Vercel에 배포하는 방법입니다.

## 📋 배포 전 확인사항

### 1. 파일 구조 확인
다음 파일들이 올바르게 설정되어 있는지 확인하세요:
- ✅ `api/index.js` - Vercel 서버리스 함수로 Express 서버 래핑
- ✅ `vercel.json` - 라우팅 설정 (`/api/bo/*`, `/admin/*`)
- ✅ `server/admin/*.html` - 백오피스 HTML 파일들

### 2. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정해야 합니다:

#### 필수 환경 변수
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
SESSION_SECRET=vibe-coding-portfolio-secret-key-2025
ADMIN_USERNAME=hing0915
ADMIN_PASSWORD=dpffla525!
```

#### 선택적 환경 변수
```
FRONTEND_URL=https://hyeyeon-portfolio.vercel.app
NODE_ENV=production
```

## 🚀 배포 방법

### 방법 1: Vercel CLI 사용 (권장)

1. **Vercel CLI 설치**
```bash
npm install -g vercel
```

2. **Vercel 로그인**
```bash
vercel login
```

3. **프로젝트 배포**
```bash
vercel
```

4. **프로덕션 배포**
```bash
vercel --prod
```

### 방법 2: GitHub 연동 (자동 배포)

1. **GitHub에 푸시**
```bash
git add .
git commit -m "백오피스 배포 준비 완료"
git push origin main
```

2. **Vercel 대시보드에서 설정**
   - https://vercel.com/dashboard 접속
   - 프로젝트 선택 또는 새 프로젝트 Import
   - GitHub 저장소 연결
   - 환경 변수 설정 (위의 환경 변수 섹션 참고)
   - Deploy 클릭

## 🔧 배포 후 접속 URL

배포가 완료되면 다음 URL로 접속할 수 있습니다:

- **프론트엔드 (FO)**: `https://hyeyeon-portfolio.vercel.app`
- **백오피스 뷰어**: `https://hyeyeon-portfolio.vercel.app/admin/viewer`
- **백오피스 로그인**: `https://hyeyeon-portfolio.vercel.app/admin/login`
- **백오피스 관리자**: `https://hyeyeon-portfolio.vercel.app/admin` (로그인 필요)

## 📝 주요 변경사항

### API 경로 변경
- **개발 환경**: `http://localhost:3005/api/*`
- **프로덕션**: `/api/bo/*` (같은 도메인 사용)

### 백오피스 HTML 파일
- `server/admin/index.html` - API URL 자동 감지
- `server/admin/create.html` - API URL 자동 감지
- `server/admin/login.html` - 상대 경로 사용

### Vercel 설정
- `vercel.json`에서 `/api/bo/*`와 `/admin/*` 경로를 `api/index.js`로 라우팅
- 서버리스 함수로 Express 서버 실행

## ⚠️ 주의사항

1. **MongoDB 연결**
   - MongoDB Atlas를 사용하는 경우, IP 화이트리스트에 Vercel의 IP를 추가해야 합니다
   - 또는 `0.0.0.0/0`으로 모든 IP 허용 (보안상 권장하지 않음)

2. **세션 저장소**
   - Vercel 서버리스 환경에서는 `memorystore`를 사용합니다
   - 서버리스 함수는 상태를 유지하지 않으므로, 세션이 일시적으로 유지될 수 있습니다
   - 프로덕션에서는 Redis 등 외부 세션 저장소 사용을 권장합니다

3. **파일 업로드**
   - Vercel의 `/tmp` 디렉토리는 임시 저장소입니다
   - 파일은 영구 저장소(S3, Cloudinary 등)에 업로드하는 것을 권장합니다

4. **환경 변수**
   - 민감한 정보(비밀번호, MongoDB URI 등)는 반드시 Vercel 환경 변수로 설정하세요
   - `.env` 파일을 Git에 커밋하지 마세요

## 🔍 문제 해결

### 배포 후 백오피스가 작동하지 않는 경우

1. **환경 변수 확인**
   - Vercel 대시보드 → Settings → Environment Variables
   - 모든 필수 환경 변수가 설정되어 있는지 확인

2. **로그 확인**
   - Vercel 대시보드 → 프로젝트 → Functions 탭
   - 에러 로그 확인

3. **MongoDB 연결 확인**
   - MongoDB Atlas에서 연결 상태 확인
   - IP 화이트리스트 확인

### API 호출 실패

1. **CORS 설정 확인**
   - `api/index.js`의 CORS 설정 확인
   - 프론트엔드 URL이 허용 목록에 있는지 확인

2. **라우팅 확인**
   - `vercel.json`의 rewrites 설정 확인
   - `/api/bo/*` 경로가 올바르게 설정되어 있는지 확인

## 📚 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Vercel 서버리스 함수](https://vercel.com/docs/functions)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

