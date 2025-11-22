# 기존 Vercel 프로젝트에 Git 연결하기

## 목표
새로 배포하지 않고 기존 프로젝트(`hyeyeon-portfolio`)에 Git 저장소만 연결

## 현재 상황
- **기존 프로젝트**: `hyeyeon-portfolio`
- **Git 저장소**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **목표**: 기존 프로젝트에 Git 연결만 추가

## 해결 방법

### 방법 1: Settings → Git에서 직접 연결 (가장 간단)

1. **Vercel Dashboard 접속**
   ```
   https://vercel.com/dashboard
   ```

2. **기존 프로젝트 선택**
   - `hyeyeon-portfolio` 프로젝트 클릭

3. **Settings → Git 이동**
   - Settings 탭 클릭
   - Git 섹션으로 스크롤

4. **Connect Git Repository 클릭**
   - "Connect Git Repository" 버튼 클릭
   - GitHub 선택

5. **저장소 검색 및 선택**
   - 검색창에 `Hyeyeon-Portfolio` 입력
   - `hyeyeon57/Hyeyeon-Portfolio` 선택
   - Branch: `main` 선택
   - Connect 클릭

6. **연결 완료**
   - 기존 프로젝트에 Git 연결만 추가됨
   - 새 배포는 생성되지 않음
   - 이후 Git 푸시 시 자동 배포 시작

### 방법 2: Vercel CLI 사용

1. **터미널에서 실행**
   ```bash
   cd C:\Users\USER\Desktop\vibe-coding
   
   # Vercel 로그인 (브라우저에서 인증)
   vercel login
   
   # 기존 프로젝트에 연결
   vercel link
   ```
   
2. **vercel link 실행 시**
   - 기존 프로젝트 목록이 표시됨
   - `hyeyeon-portfolio` 선택
   - Git 연결 자동 설정

### 방법 3: Settings → General에서 확인

1. **프로젝트 Settings → General**
   - 현재 프로젝트 설정 확인

2. **Git 연결 확인**
   - Git 섹션에서 연결 상태 확인
   - "Connect Git Repository" 버튼이 보이면 클릭

## 주의사항

- **새 Import는 하지 말 것**: 새로 Import하면 새로운 프로젝트가 생성됨
- **기존 프로젝트 사용**: `hyeyeon-portfolio` 프로젝트에만 Git 연결 추가
- **자동 배포**: Git 연결 후 푸시하면 자동으로 배포됨

## 확인 방법

Git 연결 후:
1. Settings → Git에서 Repository 확인
2. Deployments 탭에서 자동 배포 확인
3. GitHub 푸시 시 자동 배포되는지 확인

## 현재 프로젝트 정보

- **기존 프로젝트명**: `hyeyeon-portfolio`
- **Git 저장소**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **브랜치**: `main`
- **최신 커밋**: `d92164b`

