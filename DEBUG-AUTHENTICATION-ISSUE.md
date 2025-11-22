# 인증 문제 디버깅 가이드

## 1. Vercel 로그 확인 방법

### 방법 1: Deployments 탭에서 로그 확인 (가장 쉬운 방법)

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard 접속
   - 로그인

2. **프로젝트 선택**
   - `hyeyeon-portfolio-admin` 프로젝트 클릭

3. **Deployments 탭으로 이동**
   - 상단 메뉴에서 **"Deployments"** 탭 클릭
   - 또는 왼쪽 사이드바에서 **"Deployments"** 클릭

4. **최신 배포 선택**
   - 목록에서 가장 최근 배포 클릭
   - (상태가 "Ready" 또는 "Building"인 것)

5. **로그 확인**
   - 배포 상세 페이지에서 **"Logs"** 탭 클릭
   - 또는 페이지 하단의 로그 섹션 확인

6. **실시간 로그 확인**
   - 최신 배포의 로그 확인
   - 필터링: 시간 범위, 로그 레벨 선택 가능
   - 검색: "인증", "JWT", "쿠키" 등으로 검색

### 방법 2: 상단 메뉴의 Logs 탭 (직접 접근)

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard 접속

2. **프로젝트 선택**
   - `hyeyeon-portfolio-admin` 프로젝트 클릭

3. **Logs 탭으로 이동**
   - 상단 메뉴에서 **"Logs"** 탭 직접 클릭
   - (Functions 탭 옆에 있을 수 있음)

4. **로그 확인**
   - 실시간 로그 스트리밍 확인
   - 필터링 및 검색 가능

### 방법 3: Functions 탭 (Next.js 프로젝트의 경우)

**참고**: Next.js 프로젝트에서는 Functions 탭이 다르게 표시될 수 있습니다.

1. **프로젝트 선택**
   - `hyeyeon-portfolio-admin` 프로젝트 클릭

2. **Settings → Functions 확인**
   - Settings 탭 → Functions 섹션
   - 또는 Deployments → 특정 배포 → Functions 탭

3. **로그 확인**
   - Functions 목록에서 `/api/index.js` 선택
   - 로그 확인

### 방법 4: Vercel CLI로 확인 (터미널 사용)

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 로그인
vercel login

# 프로젝트 디렉토리에서 로그 확인
vercel logs

# 실시간 로그 스트리밍
vercel logs --follow

# 특정 함수의 로그만 확인
vercel logs --function api/index.js
```

### 확인할 로그 메시지

다음과 같은 로그 메시지를 찾아보세요:

- `🔐 인증 체크:` - 인증 미들웨어 실행 시
- `✅ JWT 인증 성공:` - JWT 토큰 검증 성공
- `❌ JWT 토큰 검증 실패:` - JWT 토큰 검증 실패
- `🔐 인증 실패 - 리다이렉트:` - 인증 실패로 로그인 페이지로 리다이렉트
- `🍪 JWT 쿠키 설정:` - 로그인 시 쿠키 설정 정보
- `✅ 쿠키 설정 완료:` - 쿠키 설정 완료 확인

## 2. 브라우저 개발자 도구 확인

### Chrome/Edge 개발자 도구 열기

1. **개발자 도구 열기**
   - `F12` 키 누르기
   - 또는 `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac)
   - 또는 우클릭 → "검사" 선택

2. **Application 탭으로 이동**
   - 상단 탭에서 **"Application"** 클릭
   - (한국어: "애플리케이션")

3. **Cookies 확인**
   - 왼쪽 사이드바에서 **"Cookies"** 확장
   - `https://hyeyeon-portfolio-admin.vercel.app` 클릭
   - 또는 `https://hyeyeon-portfolio-admin.vercel.app/admin` 클릭

4. **admin_token 쿠키 확인**
   - 쿠키 목록에서 `admin_token` 찾기
   - 없으면: 쿠키가 설정되지 않았거나 삭제됨
   - 있으면: 다음 속성 확인

### 쿠키 속성 확인

`admin_token` 쿠키가 있으면 다음 속성을 확인하세요:

| 속성 | 예상 값 | 설명 |
|------|---------|------|
| **Name** | `admin_token` | 쿠키 이름 |
| **Value** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | JWT 토큰 (긴 문자열) |
| **Domain** | `.hyeyeon-portfolio-admin.vercel.app` 또는 `hyeyeon-portfolio-admin.vercel.app` | 도메인 |
| **Path** | `/` | 모든 경로에서 사용 가능 |
| **Expires / Max-Age** | `24시간 후` 또는 `Session` | 만료 시간 |
| **Size** | 약 200-500 bytes | 쿠키 크기 |
| **HttpOnly** | ✅ (체크됨) | JavaScript에서 접근 불가 (보안) |
| **Secure** | ✅ (체크됨) | HTTPS에서만 전송 |
| **SameSite** | `Lax` | 같은 사이트 간 쿠키 전달 |

### 문제 진단

#### 쿠키가 없는 경우
- 로그인 API가 제대로 호출되지 않음
- 쿠키 설정이 실패함
- 브라우저가 쿠키를 차단함

#### 쿠키는 있지만 Secure가 체크되지 않은 경우
- `secure: false`로 설정됨 (개발 환경)
- Vercel에서는 항상 `secure: true`여야 함

#### 쿠키는 있지만 SameSite가 None인 경우
- CORS 문제 가능성
- `sameSite: 'lax'`로 설정되어야 함

## 3. 네트워크 탭 확인

### 네트워크 요청 확인

1. **Network 탭으로 이동**
   - 개발자 도구에서 **"Network"** 탭 클릭
   - (한국어: "네트워크")

2. **페이지 새로고침**
   - `F5` 또는 `Ctrl + R` (Windows) / `Cmd + R` (Mac)
   - 또는 브라우저 새로고침 버튼 클릭

3. **/admin/create 요청 찾기**
   - 필터에 `create` 입력
   - 또는 요청 목록에서 `/admin/create` 찾기
   - 클릭하여 상세 정보 확인

### Request Headers 확인

`/admin/create` 요청을 클릭하면:

1. **Headers 탭** 클릭
2. **Request Headers** 섹션 확장
3. **Cookie** 헤더 확인

#### 예상 Cookie 헤더

```
Cookie: admin_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; admin.sid=s%3A...
```

- `admin_token`: JWT 토큰 (필수)
- `admin.sid`: 세션 ID (선택적)

#### Cookie 헤더가 없는 경우
- 브라우저가 쿠키를 전송하지 않음
- 쿠키가 설정되지 않았거나 삭제됨
- 도메인/경로 불일치

#### Cookie 헤더는 있지만 admin_token이 없는 경우
- 쿠키 이름 불일치
- 쿠키가 만료됨
- 쿠키 경로 불일치

### Response Headers 확인

1. **Response Headers** 섹션 확인
2. **Set-Cookie** 헤더 확인

#### 로그인 시 Set-Cookie 헤더

로그인 API (`/api/bo/auth/login`) 응답에서:

```
Set-Cookie: admin_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400
```

- `Path=/`: 모든 경로에서 사용 가능
- `HttpOnly`: JavaScript 접근 불가
- `Secure`: HTTPS에서만 전송
- `SameSite=Lax`: 같은 사이트 간 전달
- `Max-Age=86400`: 24시간 유효

## 4. 문제 해결 체크리스트

### 쿠키가 설정되지 않는 경우

- [ ] 로그인 API가 성공적으로 호출되었는지 확인
- [ ] 응답에 `Set-Cookie` 헤더가 있는지 확인
- [ ] 브라우저가 쿠키를 차단하지 않는지 확인 (설정 → 개인정보 보호 → 쿠키)
- [ ] 서드파티 쿠키 차단 설정 확인

### 쿠키는 있지만 인증이 실패하는 경우

- [ ] JWT 토큰이 유효한지 확인 (만료되지 않았는지)
- [ ] JWT_SECRET이 일치하는지 확인
- [ ] Vercel 환경 변수에 JWT_SECRET이 설정되어 있는지 확인
- [ ] 쿠키의 `Path` 속성이 `/`인지 확인
- [ ] 쿠키의 `Domain` 속성이 올바른지 확인

### 인증은 성공하지만 리다이렉트되는 경우

- [ ] `requireAuth` 미들웨어가 올바르게 실행되는지 확인
- [ ] 라우트 순서가 올바른지 확인 (정적 파일 서빙보다 라우트가 먼저)
- [ ] Vercel `vercel.json`의 rewrites 설정 확인

## 5. 추가 디버깅 방법

### 브라우저 콘솔에서 쿠키 확인

개발자 도구의 **Console** 탭에서:

```javascript
// 쿠키 확인 (HttpOnly 쿠키는 document.cookie로 확인 불가)
document.cookie

// 특정 쿠키 확인 (HttpOnly 쿠키는 확인 불가)
document.cookie.split(';').find(c => c.includes('admin_token'))
```

**주의**: `HttpOnly` 쿠키는 JavaScript에서 접근할 수 없으므로, Application 탭에서만 확인 가능합니다.

### Vercel 환경 변수 확인

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 다음 변수들이 설정되어 있는지 확인:
   - `JWT_SECRET` 또는 `SESSION_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `MONGODB_URI`

### 로컬에서 테스트

로컬 환경에서도 동일한 문제가 발생하는지 확인:

```bash
# 백엔드 서버 실행
npm run dev:server

# 프론트엔드 실행 (별도 터미널)
npm run dev
```

로컬에서 작동하면 Vercel 환경 설정 문제일 가능성이 높습니다.

## 6. 문제 보고 시 포함할 정보

문제가 지속되면 다음 정보를 포함하여 보고해주세요:

1. **Vercel 로그 스크린샷**
   - 인증 체크 로그
   - 쿠키 설정 로그
   - 에러 메시지

2. **브라우저 개발자 도구 스크린샷**
   - Application → Cookies 탭
   - Network → /admin/create 요청의 Headers

3. **브라우저 정보**
   - 브라우저 종류 및 버전
   - 확장 프로그램 (광고 차단기, 프라이버시 도구 등)

4. **재현 단계**
   - 정확한 단계별 재현 방법

