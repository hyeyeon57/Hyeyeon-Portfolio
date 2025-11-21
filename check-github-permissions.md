# GitHub App 권한 확인 및 업데이트 가이드

## 현재 프로젝트 정보

### Git 저장소
- **URL**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **브랜치**: `main`
- **최신 커밋**: `513749f`

### Vercel 프로젝트
- **프로젝트명**: `hyeyeon-portfolio`
- **도메인**: `hyeyeon-portfolio.vercel.app`

## GitHub App 권한 업데이트 방법

### 방법 1: GitHub 웹 UI (권장)

1. **직접 링크로 이동**:
   ```
   https://github.com/settings/installations
   ```

2. **Vercel 찾기**:
   - 목록에서 "Vercel" 검색
   - 또는 스크롤하여 찾기

3. **Configure 클릭**:
   - Vercel 옆의 "Configure" 버튼 클릭

4. **Repository access 설정**:
   - "All repositories" 선택 (권장)
   - 또는 "Only select repositories" 선택 후:
     - `hyeyeon57/Hyeyeon-Portfolio` 체크
     - `hyeyeon57/hyeyeon-portfolio-admin` 체크

5. **Save 클릭**

### 방법 2: 저장소별 설정

1. **저장소 설정으로 이동**:
   ```
   https://github.com/hyeyeon57/Hyeyeon-Portfolio/settings/installations
   ```

2. **Vercel 찾기 → Configure 클릭**

3. **권한 확인 후 Save**

## Vercel에서 Git 연결 확인

### Vercel 대시보드
1. **프로젝트 선택**: `hyeyeon-portfolio`
2. **Settings → Git**:
   - Repository: `hyeyeon57/Hyeyeon-Portfolio`
   - Production Branch: `main`
   - Auto-deploy: 활성화 확인

### Git 연결이 잘못된 경우
1. **Disconnect Git Repository** 클릭
2. **Connect Git Repository** 클릭
3. **저장소 선택**: `hyeyeon57/Hyeyeon-Portfolio`
4. **Branch 선택**: `main`
5. **Connect** 클릭

## 배포 확인

### 배포 상태 확인
- **Vercel Dashboard**: https://vercel.com/dashboard
- **프로젝트**: `hyeyeon-portfolio`
- **Deployments 탭**에서 최신 배포 상태 확인

### 배포 완료 후 확인 사항
- Footer에 "Admin Login" 링크 표시
- `/admin/login` 페이지 정상 작동
- 관리자 로그인 기능 정상 작동

