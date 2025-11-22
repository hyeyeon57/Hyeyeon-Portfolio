# 프론트엔드-백엔드 별도 배포 환경 변수 가이드

## 현재 배포 구조

프론트엔드와 백엔드가 **별도 Vercel 프로젝트**로 배포되어 있습니다:

- **프론트엔드**: `https://hyeyeon-portfolio.vercel.app`
- **백엔드**: `https://hyeyeon-portfolio-admin.vercel.app`

## 환경 변수 설정

### 백엔드 프로젝트 (`hyeyeon-portfolio-admin`)

Vercel 대시보드 → `hyeyeon-portfolio-admin` 프로젝트 → Settings → Environment Variables

#### 필수 환경 변수
```
ADMIN_USERNAME = hing0915
ADMIN_PASSWORD = dpffla525!
SESSION_SECRET = vibe-coding-portfolio-secret-key-2025
MONGODB_URI = mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
```

#### 선택적 환경 변수
```
FRONTEND_URL = https://hyeyeon-portfolio.vercel.app
BACKOFFICE_URL = https://hyeyeon-portfolio-admin.vercel.app
```

**Environment**: Production ✅, Preview ✅, Development ✅

### 프론트엔드 프로젝트 (`hyeyeon-portfolio`)

Vercel 대시보드 → `hyeyeon-portfolio` 프로젝트 → Settings → Environment Variables

#### 필수 환경 변수
```
NEXT_PUBLIC_BACKOFFICE_URL = https://hyeyeon-portfolio-admin.vercel.app
```

또는

```
BACKOFFICE_API_URL = https://hyeyeon-portfolio-admin.vercel.app
```

#### 선택적 환경 변수
```
RESEND_API_KEY = (이메일 전송 기능 사용 시)
```

**Environment**: Production ✅, Preview ✅, Development ✅

## 환경 변수 사용 위치

### 프론트엔드에서 백엔드 연결

프론트엔드 코드는 다음 파일에서 백엔드 URL을 사용합니다:

1. **`src/app/api/projects/route.ts`**
   - `NEXT_PUBLIC_BACKOFFICE_URL` 또는 `BACKOFFICE_API_URL` 사용
   - 없으면 같은 프로젝트 내 API 사용 (현재는 별도 프로젝트이므로 설정 필요)

2. **`src/app/api/send-email/route.ts`**
   - `NEXT_PUBLIC_BACKOFFICE_URL` 또는 `BACKOFFICE_API_URL` 사용
   - 연락처 정보를 백엔드에 저장

3. **`src/app/page.tsx`**
   - 방문자 로그를 백엔드에 저장
   - `NEXT_PUBLIC_BACKOFFICE_URL` 사용

4. **`src/app/admin/login/page.tsx`**
   - 관리자 로그인
   - `NEXT_PUBLIC_BACKOFFICE_URL` 사용

## 설정 방법

### 1. 프론트엔드 프로젝트 환경 변수 설정

1. Vercel 대시보드 접속
2. `hyeyeon-portfolio` 프로젝트 선택
3. Settings → Environment Variables
4. 다음 환경 변수 추가:
   ```
   Key: NEXT_PUBLIC_BACKOFFICE_URL
   Value: https://hyeyeon-portfolio-admin.vercel.app
   Environment: Production, Preview, Development 모두 체크
   ```
5. Add 클릭

### 2. 백엔드 프로젝트 환경 변수 확인

1. Vercel 대시보드 접속
2. `hyeyeon-portfolio-admin` 프로젝트 선택
3. Settings → Environment Variables
4. 다음 환경 변수들이 설정되어 있는지 확인:
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
   - `MONGODB_URI`

### 3. 재배포

환경 변수 설정 후:
- 프론트엔드 프로젝트 재배포
- 백엔드 프로젝트 재배포 (필요 시)

## 확인 방법

### 프론트엔드에서 백엔드 연결 확인

1. 브라우저 개발자 도구 → Network 탭
2. `/api/projects` 요청 확인
3. Request URL이 `https://hyeyeon-portfolio-admin.vercel.app/api/bo/projects`로 가는지 확인

### 환경 변수 로드 확인

프론트엔드 빌드 로그에서:
- `NEXT_PUBLIC_BACKOFFICE_URL`이 올바르게 로드되었는지 확인

## 문제 해결

### 프론트엔드에서 백엔드 API 호출 실패

1. **환경 변수 확인**
   - `NEXT_PUBLIC_BACKOFFICE_URL`이 설정되어 있는지 확인
   - Production, Preview, Development 모두 체크되어 있는지 확인

2. **CORS 확인**
   - 백엔드 `api/index.js`의 CORS 설정에 프론트엔드 도메인이 포함되어 있는지 확인
   - `https://hyeyeon-portfolio.vercel.app`이 CORS origin에 포함되어 있어야 함

3. **재배포 확인**
   - 환경 변수 설정 후 재배포가 완료되었는지 확인

## 요약

### 프론트엔드 프로젝트에 필요한 환경 변수
- ✅ `NEXT_PUBLIC_BACKOFFICE_URL = https://hyeyeon-portfolio-admin.vercel.app`
- ⚠️ `RESEND_API_KEY` (이메일 전송 기능 사용 시)

### 백엔드 프로젝트에 필요한 환경 변수
- ✅ `ADMIN_USERNAME`
- ✅ `ADMIN_PASSWORD`
- ✅ `SESSION_SECRET`
- ✅ `MONGODB_URI`
- ⚠️ `FRONTEND_URL` (선택적)
- ⚠️ `BACKOFFICE_URL` (선택적)

