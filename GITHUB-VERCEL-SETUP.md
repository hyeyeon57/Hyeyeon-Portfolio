# GitHub ↔ Vercel 연결 설정 가이드

## 현재 프로젝트 정보

### Git 저장소
- **URL**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **브랜치**: `main`
- **최신 커밋**: `513749f`

### Vercel 프로젝트
- **프로젝트명**: `hyeyeon-portfolio`
- **도메인**: `hyeyeon-portfolio.vercel.app`
- **프레임워크**: Next.js

## GitHub App 권한 업데이트 (필수)

### 1. GitHub Installed Apps 페이지
```
https://github.com/settings/installations
```

### 2. Vercel 찾기 및 Configure
- 목록에서 "Vercel" 검색
- "Configure" 버튼 클릭

### 3. Repository Access 설정
```yaml
Repository access:
  - All repositories (권장)
  또는
  - Only select repositories:
    - hyeyeon57/Hyeyeon-Portfolio ✓
    - hyeyeon57/hyeyeon-portfolio-admin ✓
```

### 4. Save 클릭

## Vercel 프로젝트 Git 연결 확인

### Vercel Dashboard 설정
```
프로젝트: hyeyeon-portfolio
Settings → Git:
  Repository: hyeyeon57/Hyeyeon-Portfolio
  Production Branch: main
  Auto-deploy: Enabled
```

### Git 연결 재설정 (필요시)
1. Settings → Git
2. "Disconnect Git Repository" 클릭
3. "Connect Git Repository" 클릭
4. 저장소 선택: `hyeyeon57/Hyeyeon-Portfolio`
5. Branch: `main`
6. "Connect" 클릭

## 배포 확인 명령어

### 로컬에서 확인
```bash
# Git 상태 확인
git status

# 최신 커밋 확인
git log --oneline -1

# 원격 저장소 확인
git remote -v
```

### Vercel CLI로 확인 (로그인 필요)
```bash
# Vercel 로그인
vercel login

# 프로젝트 연결
vercel link

# 배포 상태 확인
vercel ls
```

## 현재 배포된 기능

### Footer Admin Login
- **파일**: `src/components/layout/Footer.tsx`
- **경로**: `/admin/login`
- **구현**: Next.js Link 컴포넌트 사용

### 관리자 로그인 페이지
- **파일**: `src/app/admin/login/page.tsx`
- **API**: 백오피스 `/api/bo/auth/login` 호출
- **리다이렉트**: 로그인 성공 시 백오피스 관리자 페이지로 이동

## 문제 해결 체크리스트

- [ ] GitHub App 권한 업데이트 완료
- [ ] Vercel 프로젝트에 Git 저장소 연결 확인
- [ ] Production Branch가 `main`인지 확인
- [ ] Auto-deploy가 활성화되어 있는지 확인
- [ ] 최신 커밋이 GitHub에 푸시되었는지 확인

