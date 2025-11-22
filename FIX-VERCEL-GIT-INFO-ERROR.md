# Vercel "unable to fetch required git information" 오류 해결

## 오류 내용
```
We were unable to fetch required git information required to complete the deployment. 
Please check settings and authentication and try again.
```

## 원인
Vercel이 GitHub 저장소에서 필요한 Git 정보를 가져올 수 없음
- Git 연결이 제대로 되어 있지 않음
- GitHub App 권한 문제
- 인증 문제

## 해결 방법

### 방법 1: Vercel Dashboard에서 Git 연결 확인 및 재설정

1. **Vercel Dashboard 접속**
   ```
   https://vercel.com/dashboard
   ```

2. **프로젝트 선택**
   - `hyeyeon-portfolio` 프로젝트 클릭

3. **Settings → Git 이동**
   - Settings 탭 클릭
   - Git 섹션으로 스크롤

4. **Git 연결 상태 확인**
   - Repository가 표시되어 있는지 확인
   - Production Branch가 `main`인지 확인

5. **연결이 안 되어 있다면**
   - "Disconnect Git Repository" 버튼이 보이면 클릭
   - 그 후 "Connect Git Repository" 클릭
   - GitHub 선택
   - 저장소 검색: `Hyeyeon-Portfolio`
   - `hyeyeon57/Hyeyeon-Portfolio` 선택
   - Branch: `main` 선택
   - Connect 클릭

### 방법 2: GitHub App 권한 재확인

1. **GitHub Installed Apps**
   ```
   https://github.com/settings/installations
   ```

2. **Vercel 찾기 → Configure 클릭**

3. **Repository Access 확인**
   - "All repositories" 선택
   - 또는 "Only select repositories":
     - `hyeyeon57/Hyeyeon-Portfolio` ✓ 체크
   - Save 클릭

### 방법 3: Vercel Dashboard에서 GitHub 연결 재설정

1. **Vercel Dashboard → Settings (우측 상단 프로필)**

2. **Connections (또는 Integrations) 클릭**

3. **Git 섹션 확인**
   - GitHub 연결이 있는지 확인
   - 문제가 있으면:
     - "Disconnect" 클릭
     - "Add New" 또는 "Connect" 클릭
     - GitHub 선택
     - `hyeyeon57` 계정으로 로그인 확인
     - "All repositories" 권한 부여
     - "Authorize" 클릭

### 방법 4: 새로 Import (최후의 수단)

1. **기존 프로젝트 삭제 (선택사항)**
   - Settings → General → Delete Project

2. **새 프로젝트 Import**
   ```
   https://vercel.com/new
   ```
   - GitHub 선택
   - `hyeyeon57/Hyeyeon-Portfolio` 선택
   - Import 클릭

## 확인 체크리스트

- [ ] Vercel Dashboard에서 Git 연결이 되어 있는지
- [ ] Repository가 `hyeyeon57/Hyeyeon-Portfolio`인지
- [ ] Production Branch가 `main`인지
- [ ] GitHub에서 Vercel App 권한이 올바르게 설정되어 있는지
- [ ] 브라우저에서 GitHub와 Vercel 모두 `hyeyeon57` 계정으로 로그인되어 있는지

## 현재 프로젝트 정보

- **Git 저장소**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **브랜치**: `main`
- **Vercel 프로젝트**: `hyeyeon-portfolio`

