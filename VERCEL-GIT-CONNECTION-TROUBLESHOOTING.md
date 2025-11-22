# Vercel Git 연결 문제 해결 가이드

## 문제
Vercel에서 "Connect Git Repository" 후에도 계속 연결이 안 됨

## 현재 프로젝트 정보
- **Git 저장소**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **브랜치**: `main`
- **Vercel 프로젝트**: `hyeyeon-portfolio`

## 해결 방법

### 방법 1: GitHub에서 Vercel App 완전히 제거 후 재설치 (권장)

1. **GitHub Installed Apps 페이지**
   ```
   https://github.com/settings/installations
   ```

2. **Vercel 찾기**
   - 목록에서 "Vercel" 검색
   - 또는 스크롤하여 찾기

3. **Configure 클릭**

4. **Uninstall 클릭** (완전히 제거)
   - "Uninstall Vercel" 확인
   - 모든 권한 제거

5. **Vercel Dashboard에서 다시 연결**
   - Vercel Dashboard 접속: https://vercel.com/dashboard
   - 프로젝트 `hyeyeon-portfolio` 선택
   - Settings → Git
   - "Connect Git Repository" 클릭
   - GitHub 선택
   - **중요**: `hyeyeon57` 계정으로 로그인되어 있는지 확인
   - 저장소 선택: `hyeyeon57/Hyeyeon-Portfolio`
   - Branch: `main` 선택
   - "Connect" 클릭

6. **GitHub 권한 승인 페이지**
   - `hyeyeon57` 계정 선택 (중요!)
   - "All repositories" 선택
   - 또는 "Only select repositories":
     - `hyeyeon57/Hyeyeon-Portfolio` ✓
     - `hyeyeon57/hyeyeon-portfolio-admin` ✓
   - "Install" 또는 "Authorize" 클릭

### 방법 2: Vercel Dashboard에서 GitHub 연결 확인

1. **Vercel Dashboard → Settings (우측 상단 프로필)**

2. **Connections (또는 Integrations) 클릭**

3. **Git 섹션 확인**
   - GitHub 연결 상태 확인
   - 문제가 있으면:
     - "Disconnect" 클릭
     - "Add New" 또는 "Connect" 클릭
     - GitHub 선택
     - 올바른 계정(`hyeyeon57`)으로 로그인
     - 권한 승인

### 방법 3: 저장소를 Public으로 임시 변경

만약 위 방법이 작동하지 않으면:

1. **GitHub 저장소 Settings**
   ```
   https://github.com/hyeyeon57/Hyeyeon-Portfolio/settings
   ```

2. **General → Danger Zone → Change visibility**

3. **"Make public" 선택** (임시)

4. **Vercel에서 Git 연결 재시도**

5. **연결 성공 후 다시 Private으로 변경 가능**

### 방법 4: Vercel CLI로 수동 연결 (대안)

```bash
# Vercel 로그인 (브라우저에서 인증 필요)
vercel login

# 프로젝트 연결
vercel link

# 배포
vercel --prod
```

## 체크리스트

연결 전 확인사항:
- [ ] GitHub에서 올바른 계정(`hyeyeon57`)으로 로그인되어 있는지
- [ ] 저장소가 `hyeyeon57/Hyeyeon-Portfolio`인지
- [ ] 저장소가 Private인 경우 Vercel App에 권한이 있는지
- [ ] 브라우저에서 GitHub와 Vercel 모두 같은 계정으로 로그인되어 있는지

## 오류 메시지별 해결 방법

### "Please accept Vercel's request to update the GitHub App permissions"
- GitHub에서 Vercel App 권한 업데이트 필요
- https://github.com/settings/installations 에서 Vercel 찾기 → Configure → Save

### "No Git Repositories Found"
- Vercel에 GitHub 연결이 안 되어 있음
- Settings → Connections → Git에서 GitHub 연결 확인

### "Repository not found"
- 저장소 이름이 잘못되었거나 권한이 없음
- 저장소 URL 확인: `hyeyeon57/Hyeyeon-Portfolio`
- 저장소가 Private인 경우 권한 부여 필요

## 참고 링크

- GitHub Installed Apps: https://github.com/settings/installations
- Vercel Dashboard: https://vercel.com/dashboard
- 저장소 Settings: https://github.com/hyeyeon57/Hyeyeon-Portfolio/settings

