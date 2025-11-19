# VS Code / vscode.dev 사용 가이드

## ✅ 오류 해결 완료!

프로젝트가 로컬 VS Code에서 정상적으로 작동하도록 설정했습니다.

## vscode.dev에서 "The file is not displayed in the text editor because it is a directory" 오류 해결

이 오류는 vscode.dev에서 디렉토리를 파일로 열려고 할 때 발생합니다.

### ✅ 해결 완료: 로컬 VS Code 사용

로컬 VS Code에서 프로젝트를 열었습니다. 이제 정상적으로 작동합니다!

**VS Code에서 프로젝트 열기:**
- 이미 열려있습니다 (`code .` 명령어로 열었습니다)
- 또는 VS Code에서 File → Open Folder → 프로젝트 폴더 선택

### 추가된 설정

1. **`.vscode/settings.json`** - VS Code 설정 최적화
2. **`.vscode/extensions.json`** - 권장 확장 프로그램 제안
3. **`.vscode/launch.json`** - 디버깅 설정
4. **`.vscode/tasks.json`** - 작업 자동화 설정

### VS Code에서 사용 가능한 기능

#### 디버깅 (F5)
- "Next.js: debug server-side" - 서버 사이드 디버깅
- "Next.js: debug client-side" - 클라이언트 사이드 디버깅
- "Next.js: debug full stack" - 전체 스택 디버깅

#### 작업 실행 (Ctrl+Shift+P → "Tasks: Run Task")
- "Start Dev Server" - 개발 서버 시작
- "Start Backend Server" - 백엔드 서버 시작
- "Start All Servers" - 모든 서버 시작
- "Open Chrome" - Chrome으로 열기

### vscode.dev 사용 팁 (참고)

- **파일 탐색기 사용**: 왼쪽 사이드바의 파일 탐색기에서 파일 선택
- **디렉토리 클릭**: 디렉토리를 클릭하면 확장/축소만 됩니다
- **파일 클릭**: 파일을 클릭해야 에디터에서 열립니다

### 권장 확장 프로그램

VS Code를 열면 자동으로 다음 확장 프로그램 설치를 제안합니다:
- ESLint
- Prettier
- Tailwind CSS IntelliSense

### GitHub에서 파일 직접 열기 (참고)

1. GitHub 리포지토리로 이동
2. 파일을 클릭하여 내용 확인
3. "Edit" 버튼 클릭하여 수정

