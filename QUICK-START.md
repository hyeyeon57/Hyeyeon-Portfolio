# 빠른 시작 가이드

## 🚀 서버 시작 (오류 없이)

### 방법 1: 자동 정리 및 시작 (추천 ⭐)

**`fix-and-start.bat` 파일을 더블클릭하세요!**

이 파일은 다음을 자동으로 처리합니다:
- ✅ 포트 3000, 3005 정리
- ✅ 모든 Node 프로세스 종료
- ✅ 빌드 캐시 (.next) 삭제
- ✅ 빈 디렉토리 정리
- ✅ 서버 시작
- ✅ Chrome으로 자동 열기

### 방법 2: 수동 시작

```bash
# 1. 포트 정리
taskkill /F /IM node.exe

# 2. 빌드 캐시 삭제
rmdir /s /q .next

# 3. 서버 시작
npm run dev
```

## 🔧 에디터 오류 해결

### "The file is not displayed in the text editor because it is a directory" 오류

**해결 완료!** 다음 설정이 적용되었습니다:

1. **`.vscode/settings.json`** - 빈 디렉토리 제외 설정
2. **`.cursorignore`** - Cursor에서 불필요한 파일 제외
3. **빈 디렉토리 삭제** - `src/data/portfolio/` 등 빈 디렉토리 정리

**이제 정상적으로 작동합니다!**

## 📝 사용 팁

### VS Code/Cursor에서:
- **파일만 열기**: 디렉토리가 아닌 파일을 선택하세요
- **파일 탐색기 사용**: 왼쪽 사이드바에서 파일 선택
- **작업 실행**: `Ctrl+Shift+P` → "Tasks: Run Task"

### 서버 실행:
- **FO 서버**: `http://localhost:3000` (Next.js)
- **BO 서버**: `http://localhost:3005/admin` (Express + MongoDB)

## ⚠️ 문제 해결

### 포트 충돌 오류
```bash
# fix-and-start.bat 실행 또는
taskkill /F /IM node.exe
```

### 빌드 오류
```bash
rmdir /s /q .next
npm run dev
```

### 에디터 오류
- 빈 디렉토리는 자동으로 제외됩니다
- 파일만 선택하여 열어주세요

