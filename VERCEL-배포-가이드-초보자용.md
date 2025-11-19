# 🚀 Vercel 배포 가이드 (초보자용)

백오피스를 Vercel에 배포하는 방법을 단계별로 쉽게 설명합니다.

## 📌 준비사항

✅ GitHub에 코드가 올라가 있어야 합니다 (이미 완료됨)  
✅ Vercel 계정이 있어야 합니다 (없으면 무료로 만들 수 있습니다)

---

## 1단계: Vercel 계정 만들기

1. **브라우저에서 Vercel 사이트 열기**
   - 주소: https://vercel.com
   - "Sign Up" 또는 "Get Started" 버튼 클릭

2. **GitHub로 로그인하기**
   - "Continue with GitHub" 버튼 클릭
   - GitHub 계정으로 로그인

3. **완료!** 이제 Vercel 대시보드가 보입니다

---

## 2단계: 프로젝트 가져오기 (Import)

1. **Vercel 대시보드에서 "Add New..." 클릭**
   - 또는 "Import Project" 버튼 클릭

2. **GitHub 저장소 선택**
   - "Import Git Repository" 섹션에서
   - `hyeyeon57/Hyeyeon-Portfolio` 저장소 찾기
   - "Import" 버튼 클릭

3. **프로젝트 설정 확인**
   - Framework Preset: **Next.js** (자동 감지됨)
   - Root Directory: `./` (그대로 두기)
   - Build Command: `npm run build` (자동 설정됨)
   - Output Directory: `.next` (자동 설정됨)
   - Install Command: `npm install` (자동 설정됨)

4. **"Deploy" 버튼 클릭하지 마세요!** (아직 환경 변수 설정이 필요합니다)

---

## 3단계: 환경 변수 설정 (중요!)

배포 전에 반드시 환경 변수를 설정해야 합니다.

### 3-1. 환경 변수 추가하기

1. **"Environment Variables" 섹션 찾기**
   - 프로젝트 설정 화면에서 스크롤 다운
   - "Environment Variables" 섹션 클릭

2. **다음 변수들을 하나씩 추가하세요:**

   #### 변수 1: MONGODB_URI
   - **Name**: `MONGODB_URI`
   - **Value**: `mongodb+srv://username:password@cluster.mongodb.net/database`
     - ⚠️ 실제 MongoDB Atlas 연결 주소로 변경하세요!
   - **Environment**: Production, Preview, Development 모두 선택
   - "Add" 버튼 클릭

   #### 변수 2: SESSION_SECRET
   - **Name**: `SESSION_SECRET`
   - **Value**: `vibe-coding-portfolio-secret-key-2025`
   - **Environment**: Production, Preview, Development 모두 선택
   - "Add" 버튼 클릭

   #### 변수 3: ADMIN_USERNAME
   - **Name**: `ADMIN_USERNAME`
   - **Value**: `hing0915`
   - **Environment**: Production, Preview, Development 모두 선택
   - "Add" 버튼 클릭

   #### 변수 4: ADMIN_PASSWORD
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: `dpffla525!`
   - **Environment**: Production, Preview, Development 모두 선택
   - "Add" 버튼 클릭

   #### 변수 5: FRONTEND_URL (선택사항)
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://hyeyeon-portfolio.vercel.app`
   - **Environment**: Production만 선택
   - "Add" 버튼 클릭

### 3-2. 환경 변수 확인

추가한 변수들이 목록에 보이는지 확인하세요:
- ✅ MONGODB_URI
- ✅ SESSION_SECRET
- ✅ ADMIN_USERNAME
- ✅ ADMIN_PASSWORD
- ✅ FRONTEND_URL (선택사항)

---

## 4단계: 배포하기

1. **"Deploy" 버튼 클릭**
   - 모든 설정이 완료되면 오른쪽 하단의 "Deploy" 버튼 클릭

2. **배포 진행 상황 확인**
   - "Building" 단계가 진행됩니다
   - 약 2-5분 정도 소요됩니다
   - 진행 상황이 화면에 표시됩니다

3. **배포 완료!**
   - "Ready" 메시지가 나타나면 완료입니다
   - 배포된 URL이 표시됩니다

---

## 5단계: 배포 확인하기

### 5-1. 배포된 URL 확인

배포가 완료되면 다음과 같은 URL이 생성됩니다:
- **프론트엔드**: `https://hyeyeon-portfolio.vercel.app`
- **백오피스 뷰어**: `https://hyeyeon-portfolio.vercel.app/admin/viewer`
- **백오피스 로그인**: `https://hyeyeon-portfolio.vercel.app/admin/login`

### 5-2. 사이트 테스트하기

1. **프론트엔드 확인**
   - `https://hyeyeon-portfolio.vercel.app` 접속
   - 포트폴리오 사이트가 정상적으로 보이는지 확인

2. **백오피스 뷰어 확인**
   - `https://hyeyeon-portfolio.vercel.app/admin/viewer` 접속
   - 프로젝트 목록이 보이는지 확인

3. **백오피스 로그인 확인**
   - `https://hyeyeon-portfolio.vercel.app/admin/login` 접속
   - 로그인 화면이 보이는지 확인
   - 아이디: `hing0915`, 비밀번호: `dpffla525!`로 로그인 테스트

---

## 6단계: MongoDB 연결 확인 (중요!)

백오피스가 작동하려면 MongoDB가 연결되어 있어야 합니다.

### MongoDB Atlas 사용하는 경우:

1. **MongoDB Atlas 대시보드 접속**
   - https://cloud.mongodb.com 접속

2. **Network Access 설정**
   - 왼쪽 메뉴에서 "Network Access" 클릭
   - "Add IP Address" 버튼 클릭
   - "Allow Access from Anywhere" 선택 (또는 `0.0.0.0/0` 입력)
   - "Confirm" 클릭

3. **Database Access 확인**
   - 사용자 계정이 올바르게 설정되어 있는지 확인

4. **Connection String 확인**
   - "Database" → "Connect" 클릭
   - "Connect your application" 선택
   - Connection String 복사
   - Vercel의 `MONGODB_URI` 환경 변수에 이 값이 들어가 있어야 합니다

---

## ❌ 문제 해결

### 배포가 실패하는 경우

1. **로그 확인**
   - Vercel 대시보드 → 프로젝트 → "Deployments" 탭
   - 실패한 배포 클릭
   - "Build Logs" 확인
   - 에러 메시지 확인

2. **일반적인 문제들**

   **문제**: "MongoDB connection failed"
   - **해결**: `MONGODB_URI` 환경 변수가 올바른지 확인
   - MongoDB Atlas의 Network Access 설정 확인

   **문제**: "Module not found"
   - **해결**: `package.json`에 필요한 패키지가 모두 있는지 확인
   - Vercel이 `npm install`을 자동으로 실행합니다

   **문제**: "Build failed"
   - **해결**: 로컬에서 `npm run build`가 성공하는지 확인
   - 빌드 에러를 먼저 해결하세요

### 백오피스가 작동하지 않는 경우

1. **환경 변수 확인**
   - Vercel 대시보드 → Settings → Environment Variables
   - 모든 변수가 올바르게 설정되어 있는지 확인

2. **MongoDB 연결 확인**
   - MongoDB Atlas에서 연결 상태 확인
   - Vercel Functions 로그에서 MongoDB 연결 에러 확인

3. **URL 확인**
   - `/admin/viewer` 경로가 올바른지 확인
   - 브라우저 개발자 도구(F12) → Console 탭에서 에러 확인

---

## 🔄 업데이트 배포하기

코드를 수정한 후 다시 배포하는 방법:

### 방법 1: 자동 배포 (권장)
- GitHub에 `git push`하면 자동으로 배포됩니다
- Vercel이 변경사항을 감지하고 자동으로 재배포합니다

### 방법 2: 수동 배포
1. Vercel 대시보드 → 프로젝트
2. "Deployments" 탭
3. 최신 배포 옆의 "..." 메뉴
4. "Redeploy" 클릭

---

## 📝 체크리스트

배포 전 확인사항:

- [ ] Vercel 계정 생성 완료
- [ ] GitHub 저장소 Import 완료
- [ ] MONGODB_URI 환경 변수 설정 완료
- [ ] SESSION_SECRET 환경 변수 설정 완료
- [ ] ADMIN_USERNAME 환경 변수 설정 완료
- [ ] ADMIN_PASSWORD 환경 변수 설정 완료
- [ ] MongoDB Atlas Network Access 설정 완료
- [ ] 배포 완료 확인
- [ ] 프론트엔드 사이트 정상 작동 확인
- [ ] 백오피스 뷰어 정상 작동 확인
- [ ] 백오피스 로그인 정상 작동 확인

---

## 💡 팁

1. **첫 배포는 시간이 걸립니다**
   - 처음 배포는 3-5분 정도 소요될 수 있습니다
   - 인내심을 가지세요!

2. **환경 변수는 민감한 정보입니다**
   - 절대 GitHub에 커밋하지 마세요
   - Vercel 환경 변수로만 관리하세요

3. **MongoDB Atlas 무료 티어**
   - 무료로 사용할 수 있습니다
   - 512MB 저장공간 제공

4. **Vercel 무료 티어**
   - 개인 프로젝트는 무료로 사용 가능
   - 월 100GB 대역폭 제공

---

## 🆘 도움이 필요하신가요?

문제가 발생하면:
1. Vercel 대시보드의 "Deployments" → "Build Logs" 확인
2. 브라우저 개발자 도구(F12) → Console 탭 확인
3. 에러 메시지를 복사해서 검색해보세요

행운을 빕니다! 🍀

