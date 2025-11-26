# Vercel 환경 변수 설정 가이드

## 환경 변수 사용 위치

### 백엔드 (서버리스 함수) - `api/index.js`에서 사용

다음 환경 변수들은 **백엔드에서만** 사용되며, 프론트엔드에는 **필요 없습니다**:

#### 1. ADMIN_USERNAME
- **용도**: 관리자 로그인 아이디
- **사용 위치**: `api/index.js` (로그인 인증)
- **프론트엔드 필요**: ❌ 불필요
- **설정 값**: `hing0915`

#### 2. ADMIN_PASSWORD
- **용도**: 관리자 로그인 비밀번호
- **사용 위치**: `api/index.js` (로그인 인증)
- **프론트엔드 필요**: ❌ 불필요
- **설정 값**: `dpffla525!`

#### 3. SESSION_SECRET
- **용도**: JWT 토큰 및 세션 암호화 키
- **사용 위치**: `api/index.js` (JWT 토큰 생성/검증, 세션 관리)
- **프론트엔드 필요**: ❌ 불필요
- **설정 값**: `vibe-coding-portfolio-secret-key-2025`

#### 4. MONGODB_URI
- **용도**: MongoDB 데이터베이스 연결 문자열
- **사용 위치**: `api/index.js`, `server/config/database.cjs` (데이터베이스 연결)
- **프론트엔드 필요**: ❌ 불필요
- **설정 값**: `mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority`

### 프론트엔드 (Next.js) - `src/`에서 사용

프론트엔드에서 사용하는 환경 변수:

#### 1. RESEND_API_KEY (선택적)
- **용도**: 이메일 전송 서비스 API 키
- **사용 위치**: `src/app/api/send-email/route.ts`
- **프론트엔드 필요**: ✅ 필요 (이메일 전송 기능 사용 시)
- **설정 방법**: Vercel 환경 변수에 추가

#### 2. NEXT_PUBLIC_BACKOFFICE_URL (선택적)
- **용도**: 백오피스 서버 URL (다른 도메인 사용 시)
- **사용 위치**: `src/app/api/projects/route.ts`, `src/app/api/send-email/route.ts`
- **프론트엔드 필요**: ⚠️ 선택적 (같은 프로젝트면 불필요)
- **설정 방법**: 같은 프로젝트면 설정 불필요

## Vercel 환경 변수 설정 방법

### 같은 Vercel 프로젝트에 배포하는 경우

프론트엔드와 백엔드가 같은 Vercel 프로젝트에 배포되므로, **같은 환경 변수를 공유**합니다.

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings → Environment Variables**

3. **필수 환경 변수 설정** (백엔드용)
   ```
   ADMIN_USERNAME = hing0915
   ADMIN_PASSWORD = dpffla525!
   SESSION_SECRET = vibe-coding-portfolio-secret-key-2025
   MONGODB_URI = mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
   ```

4. **선택적 환경 변수** (프론트엔드용)
   ```
   RESEND_API_KEY = (이메일 전송 기능 사용 시)
   ```

5. **Environment 선택**
   - Production ✅
   - Preview ✅
   - Development ✅

### 프론트엔드와 백엔드를 별도 프로젝트로 배포하는 경우

#### 백엔드 프로젝트 (`hyeyeon-portfolio-admin`)
```
ADMIN_USERNAME = hing0915
ADMIN_PASSWORD = dpffla525!
SESSION_SECRET = vibe-coding-portfolio-secret-key-2025
MONGODB_URI = mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
```

#### 프론트엔드 프로젝트 (`hyeyeon-portfolio`)
```
RESEND_API_KEY = (이메일 전송 기능 사용 시)
NEXT_PUBLIC_BACKOFFICE_URL = https://hyeyeon-portfolio-admin.vercel.app (백엔드 URL)
```

## 현재 프로젝트 구조

현재 프로젝트는 **프론트엔드와 백엔드가 같은 Vercel 프로젝트**에 배포됩니다:

- **프론트엔드**: Next.js (`src/`)
- **백엔드**: Express 서버리스 함수 (`api/index.js`)

따라서 **같은 환경 변수를 공유**하며, 프론트엔드에는 백엔드 환경 변수가 필요 없습니다.

## 환경 변수 접근 규칙

### 서버 사이드 (Next.js API Routes, 서버리스 함수)
- 모든 환경 변수 접근 가능
- `process.env.VARIABLE_NAME`

### 클라이언트 사이드 (브라우저)
- `NEXT_PUBLIC_` 접두사가 붙은 환경 변수만 접근 가능
- `process.env.NEXT_PUBLIC_VARIABLE_NAME`

### 보안 주의사항

⚠️ **절대 클라이언트 사이드에 노출되면 안 되는 변수:**
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `MONGODB_URI`

이 변수들은 모두 서버 사이드에서만 사용되며, `NEXT_PUBLIC_` 접두사를 붙이면 안 됩니다.

## 요약

### 프론트엔드에 필요한 환경 변수
- ❌ **없음** (현재 구조에서는)

### 백엔드에 필요한 환경 변수
- ✅ `ADMIN_USERNAME`
- ✅ `ADMIN_PASSWORD`
- ✅ `SESSION_SECRET`
- ✅ `MONGODB_URI`

### 선택적 환경 변수
- `RESEND_API_KEY` (이메일 전송 기능 사용 시)

## 확인 방법

Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인:

1. Settings → Environment Variables
2. 각 환경 변수가 Production, Preview, Development에 모두 체크되어 있는지 확인
3. 재배포 후 로그에서 환경 변수 로드 확인







