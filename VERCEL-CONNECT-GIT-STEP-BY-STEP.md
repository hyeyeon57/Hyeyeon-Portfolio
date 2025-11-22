# Vercel Git 연결 단계별 가이드

## 문제
Vercel Dashboard에서 "Connect Git Repository"를 클릭해도 연결이 안 됨

## 현재 프로젝트 정보
- **프로젝트명**: `hyeyeon-portfolio`
- **Git 저장소**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **브랜치**: `main`

## 해결 방법 - 단계별

### 1단계: GitHub에서 Vercel App 확인 및 권한 업데이트

1. **GitHub Installed Apps 페이지로 이동**
   ```
   https://github.com/settings/installations
   ```

2. **Vercel 찾기**
   - 목록에서 "Vercel" 검색
   - 또는 스크롤하여 찾기

3. **Configure 클릭**

4. **Repository Access 확인**
   - "All repositories" 선택 (권장)
   - 또는 "Only select repositories":
     - `hyeyeon57/Hyeyeon-Portfolio` ✓ 체크
     - `hyeyeon57/hyeyeon-portfolio-admin` ✓ 체크

5. **Save 클릭**

### 2단계: Vercel Dashboard에서 Git 연결

1. **Vercel Dashboard 접속**
   ```
   https://vercel.com/dashboard
   ```

2. **프로젝트 선택**
   - `hyeyeon-portfolio` 프로젝트 클릭

3. **Settings → Git 이동**
   - Settings 탭 클릭
   - Git 섹션으로 스크롤

4. **Git 연결 해제 (이미 연결되어 있다면)**
   - "Disconnect Git Repository" 버튼이 보이면 클릭
   - 확인 메시지에서 "Disconnect" 클릭

5. **Git Repository 연결**
   - "Connect Git Repository" 버튼 클릭
   - GitHub 선택
   - **중요**: 올바른 계정(`hyeyeon57`)으로 로그인되어 있는지 확인

6. **저장소 검색 및 선택**
   - 검색창에 `Hyeyeon-Portfolio` 입력
   - 또는 `hyeyeon57` 입력하여 저장소 목록 확인
   - `hyeyeon57/Hyeyeon-Portfolio` 선택
   - Branch: `main` 선택
   - "Connect" 클릭

### 3단계: GitHub 권한 승인

1. **GitHub 권한 승인 페이지로 리다이렉트됨**
   - `hyeyeon57` 계정이 이미 선택되어 있는지 확인
   - 다른 계정(`gpdus5555`)이 선택되어 있다면 `hyeyeon57` 계정 선택

2. **저장소 권한 선택**
   - "All repositories" 선택 (권장)
   - 또는 "Only select repositories":
     - `hyeyeon57/Hyeyeon-Portfolio` 체크

3. **Install 또는 Authorize 클릭**

4. **Vercel로 자동 리다이렉트됨**
   - 연결 완료 메시지 확인

### 4단계: 연결 확인

1. **Vercel Dashboard → 프로젝트 → Settings → Git**
   - Repository: `hyeyeon57/Hyeyeon-Portfolio` 확인
   - Production Branch: `main` 확인
   - Auto-deploy: Enabled 확인

2. **Deployments 탭 확인**
   - 자동으로 새로운 배포가 시작되어야 함

## 문제가 계속되는 경우

### 방법 A: GitHub App 완전히 제거 후 재설치

1. **GitHub에서 Vercel App 제거**
   - https://github.com/settings/installations
   - Vercel 찾기 → Configure → Uninstall

2. **Vercel에서 GitHub 연결 해제**
   - Vercel Dashboard → Settings (우측 상단 프로필)
   - Connections → Git → GitHub Disconnect

3. **다시 위 1-3단계 반복**

### 방법 B: 저장소를 Public으로 임시 변경

1. **GitHub 저장소 Settings**
   ```
   https://github.com/hyeyeon57/Hyeyeon-Portfolio/settings
   ```

2. **General → Danger Zone → Change visibility**
   - "Make public" 선택 (임시)

3. **Vercel에서 Git 연결 재시도**

4. **연결 성공 후 다시 Private으로 변경**

### 방법 C: Vercel CLI 사용 (대안)

```bash
# Vercel 로그인
vercel login

# 프로젝트 연결
vercel link

# 배포
vercel --prod
```

## 확인 체크리스트

- [ ] GitHub에서 Vercel App이 설치되어 있는지
- [ ] 저장소 `hyeyeon57/Hyeyeon-Portfolio`에 대한 권한이 있는지
- [ ] Vercel Dashboard에서 `hyeyeon57` 계정으로 로그인되어 있는지
- [ ] 브라우저에서 GitHub와 Vercel 모두 같은 계정으로 로그인되어 있는지
- [ ] 저장소가 Private인 경우 명시적으로 권한이 부여되어 있는지

## 주의사항

- **계정 일치**: GitHub와 Vercel 모두 `hyeyeon57` 계정으로 로그인되어 있어야 함
- **권한 부여**: Private 저장소인 경우 Vercel App에 명시적으로 권한 부여 필요
- **브라우저 캐시**: 문제가 있으면 브라우저 캐시 삭제 후 다시 시도

