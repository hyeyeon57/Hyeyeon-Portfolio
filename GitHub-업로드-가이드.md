# 📤 GitHub에 코드 올리기 (초보자용)

코드를 GitHub에 올리는 방법을 단계별로 쉽게 설명합니다.

---

## 1단계: 현재 상태 확인

먼저 현재 Git 상태를 확인해봅시다.

### 터미널에서 확인하기

1. **프로젝트 폴더 열기**
   - `C:\Users\USER\Desktop\vibe-coding` 폴더

2. **Git 상태 확인**
   - 이미 Git 저장소가 연결되어 있는지 확인

---

## 2단계: 변경사항 확인하기

### 방법 1: 터미널 사용 (CMD 또는 PowerShell)

```bash
git status
```

이 명령어로 변경된 파일들을 확인할 수 있습니다.

---

## 3단계: 파일 추가하기 (Staging)

변경된 모든 파일을 Git에 추가합니다.

```bash
git add .
```

또는 특정 파일만 추가하려면:
```bash
git add 파일이름
```

---

## 4단계: 커밋하기 (Commit)

변경사항을 저장합니다.

```bash
git commit -m "변경사항 설명"
```

예시:
```bash
git commit -m "백오피스 Vercel 배포 준비 완료"
```

---

## 5단계: GitHub에 올리기 (Push)

GitHub 저장소에 업로드합니다.

```bash
git push origin main
```

---

## 📋 전체 과정 (한 번에)

터미널에서 다음 명령어들을 순서대로 실행하세요:

```bash
# 1. 현재 상태 확인
git status

# 2. 모든 변경사항 추가
git add .

# 3. 커밋 (변경사항 저장)
git commit -m "백오피스 배포 준비 완료"

# 4. GitHub에 업로드
git push origin main
```

---

## ⚠️ 주의사항

### 1. `.env` 파일은 올리지 마세요!
- `.gitignore` 파일에 이미 설정되어 있어서 자동으로 제외됩니다
- 민감한 정보(비밀번호, API 키 등)가 들어있습니다

### 2. `node_modules` 폴더는 올리지 마세요!
- 이미 `.gitignore`에 설정되어 있습니다
- 용량이 너무 큽니다

### 3. 커밋 메시지는 명확하게!
- 나중에 무엇을 변경했는지 알 수 있도록 설명을 작성하세요
- 예: "백오피스 API URL 동적 변경", "프로젝트 목록 기능 추가" 등

---

## 🔍 문제 해결

### "fatal: not a git repository" 에러가 나는 경우

Git 저장소가 초기화되지 않았습니다. 다음 명령어로 초기화:

```bash
git init
git remote add origin https://github.com/hyeyeon57/Hyeyeon-Portfolio.git
```

### "Permission denied" 에러가 나는 경우

GitHub 인증이 필요합니다. 다음 중 하나를 사용:

1. **Personal Access Token 사용** (권장)
   - GitHub → Settings → Developer settings → Personal access tokens
   - 새 토큰 생성 후 비밀번호 대신 사용

2. **GitHub Desktop 사용**
   - GUI 프로그램으로 더 쉽게 사용 가능

### "Everything up-to-date" 메시지가 나오는 경우

이미 모든 변경사항이 GitHub에 올라가 있습니다. 정상입니다!

---

## 💡 팁

### 커밋 메시지 작성 팁

좋은 예:
- ✅ "백오피스 Vercel 배포 준비 완료"
- ✅ "프로젝트 목록 API 수정"
- ✅ "로그인 기능 추가"

나쁜 예:
- ❌ "수정"
- ❌ "변경"
- ❌ "asdf"

### 자주 사용하는 Git 명령어

```bash
# 현재 상태 확인
git status

# 변경사항 확인 (어떤 파일이 어떻게 변경되었는지)
git diff

# 커밋 히스토리 보기
git log

# 마지막 커밋 취소 (파일은 그대로 유지)
git reset --soft HEAD~1
```

---

## 🎯 체크리스트

GitHub에 올리기 전 확인:

- [ ] `.env` 파일이 커밋되지 않았는지 확인
- [ ] `node_modules` 폴더가 커밋되지 않았는지 확인
- [ ] 커밋 메시지가 명확한지 확인
- [ ] 변경사항을 다시 한 번 확인 (`git status`)

---

## 📚 추가 학습

더 자세한 Git 사용법:
- [Git 공식 문서](https://git-scm.com/doc)
- [GitHub 가이드](https://guides.github.com/)

