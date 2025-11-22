# Vercel Connect 버튼이 없을 때 해결 방법

## 문제
Vercel Dashboard에서 "Connect Git Repository" 버튼이 보이지 않음
전에는 잘 되었다가 갑자기 안 됨

## 가능한 원인

### 1. 이미 Git이 연결되어 있는 경우
- Git 연결이 이미 되어 있어서 Connect 버튼이 안 보일 수 있음
- Settings → Git에서 연결 상태 확인

### 2. 권한 문제
- GitHub App 권한이 부족할 수 있음
- 저장소 접근 권한 문제

### 3. UI 변경
- Vercel Dashboard UI가 업데이트되어 버튼 위치가 변경되었을 수 있음

## 해결 방법

### 방법 1: Settings → Git에서 직접 연결 확인

1. **Vercel Dashboard 접속**
   ```
   https://vercel.com/dashboard
   ```

2. **프로젝트 선택**
   - `hyeyeon-portfolio` 프로젝트 클릭

3. **Settings → Git 이동**
   - Settings 탭 클릭
   - Git 섹션으로 스크롤

4. **연결 상태 확인**
   - Repository: `hyeyeon57/Hyeyeon-Portfolio`가 표시되어 있는지 확인
   - Production Branch: `main`인지 확인
   - Auto-deploy: Enabled인지 확인

5. **연결이 안 되어 있다면**
   - "Disconnect Git Repository" 버튼이 보이면 클릭
   - 그 후 "Connect Git Repository" 버튼이 나타나야 함

### 방법 2: 프로젝트 카드에서 직접 연결

1. **Vercel Dashboard의 Projects 탭**
   - `hyeyeon-portfolio` 프로젝트 카드 확인

2. **프로젝트 카드 우측 상단 메뉴 (⋯) 클릭**
   - Settings 선택
   - 또는 프로젝트 카드를 직접 클릭

3. **Settings → Git 이동**
   - Git 섹션에서 연결 확인

### 방법 3: GitHub에서 Vercel App 권한 재확인

1. **GitHub Installed Apps**
   ```
   https://github.com/settings/installations
   ```

2. **Vercel 찾기 → Configure 클릭**

3. **Repository Access 확인**
   - "All repositories" 선택
   - 또는 `hyeyeon57/Hyeyeon-Portfolio` 체크
   - Save 클릭

### 방법 4: Vercel CLI로 연결 (대안)

```bash
# Vercel 로그인
vercel login

# 프로젝트 디렉토리로 이동
cd C:\Users\USER\Desktop\vibe-coding

# 프로젝트 연결
vercel link

# 배포
vercel --prod
```

### 방법 5: 새 프로젝트로 Import (최후의 수단)

1. **Vercel Dashboard → Add New → Import Git Repository**
   - GitHub 선택
   - `hyeyeon57/Hyeyeon-Portfolio` 검색
   - Import 클릭

2. **프로젝트 설정**
   - Framework: Next.js
   - Root Directory: `.` (기본값)
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables 설정**
   - 기존 프로젝트에서 복사

4. **Deploy 클릭**

## 확인 사항

- [ ] Vercel Dashboard에서 프로젝트가 보이는지
- [ ] Settings → Git 섹션이 보이는지
- [ ] GitHub와 Vercel 모두 같은 계정으로 로그인되어 있는지
- [ ] 브라우저 캐시 문제는 아닌지 (시크릿 모드에서 확인)

## 현재 프로젝트 정보

- **프로젝트명**: `hyeyeon-portfolio`
- **Git 저장소**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **브랜치**: `main`
- **최신 커밋**: `a2696ae`

