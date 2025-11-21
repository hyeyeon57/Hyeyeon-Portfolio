# Vercel GitHub 권한 오류 해결 방법

## 문제
Redeploy 시 "Please accept Vercel's request to update the GitHub App permissions" 오류 발생

## 해결 방법

### 1단계: Vercel 프로젝트에서 Git 연결 완전히 재설정

1. **Vercel Dashboard 접속**
   ```
   https://vercel.com/dashboard
   ```

2. **프로젝트 선택**
   - `hyeyeon-portfolio` 프로젝트 클릭

3. **Settings → Git**
   - Settings 탭 클릭
   - Git 섹션으로 스크롤

4. **Git 연결 해제**
   - "Disconnect Git Repository" 버튼 클릭
   - 확인 메시지에서 "Disconnect" 클릭

5. **Git 연결 재설정**
   - "Connect Git Repository" 버튼 클릭
   - "GitHub" 선택
   - 저장소 검색: `hyeyeon57/Hyeyeon-Portfolio`
   - 저장소 선택
   - Branch: `main` 선택
   - "Connect" 클릭

### 2단계: GitHub에서 Vercel App 권한 재확인

1. **GitHub Installed Apps 페이지**
   ```
   https://github.com/settings/installations
   ```

2. **Vercel 찾기**
   - 목록에서 "Vercel" 검색 또는 스크롤

3. **Configure 클릭**

4. **Repository Access 설정**
   - "All repositories" 선택 (권장)
   - 또는 "Only select repositories":
     - `hyeyeon57/Hyeyeon-Portfolio` ✓
     - `hyeyeon57/hyeyeon-portfolio-admin` ✓

5. **Save 클릭**

### 3단계: Vercel에서 배포 재시도

1. **Vercel Dashboard로 돌아가기**

2. **Deployments 탭**
   - 최신 배포 확인
   - 또는 "Redeploy" 버튼 클릭

3. **배포 상태 확인**
   - Building: 정상 진행 중
   - Ready: 배포 완료
   - Error: 오류 발생 (로그 확인)

## 대안: Vercel CLI로 수동 배포 (로그인 필요)

```bash
# Vercel 로그인
vercel login

# 프로젝트 연결
vercel link

# 배포
vercel --prod
```

## 현재 프로젝트 정보

- **Git 저장소**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **브랜치**: `main`
- **최신 커밋**: `2a0c7eb`
- **Vercel 프로젝트**: `hyeyeon-portfolio`

