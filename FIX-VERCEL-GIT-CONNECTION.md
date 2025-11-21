# Vercel Git 연결 문제 해결 방법

## 문제
- Vercel에서 Git 저장소 연결 시도
- 연결 후 다시 돌아오고 연결이 안 됨

## 원인
GitHub App 권한이 저장소에 제대로 부여되지 않았을 가능성

## 해결 방법

### 1단계: GitHub에서 Vercel App 완전히 제거 후 재설치

1. **GitHub Installed Apps 페이지**
   ```
   https://github.com/settings/installations
   ```

2. **Vercel 찾기**
   - 목록에서 "Vercel" 검색

3. **Configure 클릭**

4. **Uninstall 클릭** (완전히 제거)
   - "Uninstall Vercel" 확인

### 2단계: Vercel에서 GitHub 재연결

1. **Vercel Dashboard**
   ```
   https://vercel.com/dashboard
   ```

2. **Settings (우측 상단 프로필) → Connections**
   - Git 섹션에서 GitHub 확인
   - 문제가 있으면 Disconnect 후 다시 Connect

### 3단계: 프로젝트에서 Git 연결 재시도

1. **프로젝트 선택**: `hyeyeon-portfolio`

2. **Settings → Git**

3. **Disconnect Git Repository** (이미 연결되어 있다면)

4. **Connect Git Repository** 클릭

5. **GitHub 선택**

6. **저장소 검색 및 선택**
   - `hyeyeon57/Hyeyeon-Portfolio` 선택
   - Branch: `main` 선택

7. **Connect 클릭**

8. **GitHub 권한 승인 페이지에서**
   - `hyeyeon57` 계정 선택
   - "All repositories" 선택
   - "Install" 또는 "Authorize" 클릭

### 4단계: 저장소별 권한 확인

1. **저장소로 이동**
   ```
   https://github.com/hyeyeon57/Hyeyeon-Portfolio
   ```

2. **Settings → Integrations → GitHub Apps**

3. **Vercel 찾기**

4. **Configure 클릭**

5. **Repository access 확인**
   - 저장소가 선택되어 있는지 확인
   - Save 클릭

## 대안: 저장소를 Public으로 변경 (임시)

만약 위 방법이 작동하지 않으면:

1. **GitHub 저장소 Settings**
   ```
   https://github.com/hyeyeon57/Hyeyeon-Portfolio/settings
   ```

2. **General → Danger Zone**

3. **Change visibility → Make public** (임시)

4. **Vercel에서 다시 연결 시도**

5. **연결 후 다시 Private으로 변경 가능**

## 확인 사항

- [ ] GitHub에서 Vercel App이 설치되어 있는지
- [ ] 저장소 `hyeyeon57/Hyeyeon-Portfolio`에 대한 권한이 있는지
- [ ] Vercel Dashboard에서 GitHub 연결이 활성화되어 있는지
- [ ] 프로젝트의 Git 연결이 올바른 저장소를 가리키는지

## 현재 프로젝트 정보

- **Git 저장소**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **브랜치**: `main`
- **Vercel 프로젝트**: `hyeyeon-portfolio`

