# 에디터 오류 설명

## ❓ "The file is not displayed in the text editor because it is a directory" 오류

### 원인
이 오류는 **디렉토리를 파일처럼 열려고 할 때** 발생합니다.

예를 들어:
- ❌ `src/data/portfolio` (디렉토리) - 이렇게 열려고 하면 오류 발생
- ✅ `src/data/portfolio.ts` (파일) - 이렇게 열어야 정상 작동

### 제가 삭제한 것
**빈 디렉토리만 삭제했습니다:**
- `src/data/portfolio/` (빈 디렉토리) - 삭제됨 ✅
- `src/app/api/contact/` (빈 디렉토리) - 삭제됨 ✅

### 삭제하지 않은 것 (모두 존재함)
**모든 중요한 파일은 그대로 있습니다:**
- ✅ `src/data/portfolio.ts` - **존재함** (포트폴리오 데이터)
- ✅ `src/app/api/send-email/route.ts` - **존재함** (이메일 API)
- ✅ `src/app/api/upload/route.ts` - **존재함** (업로드 API)

## 🔧 해결 방법

### VS Code/Cursor에서 파일 열기:
1. **파일 탐색기 사용** (왼쪽 사이드바)
2. **디렉토리가 아닌 파일을 선택**
3. 예: `portfolio.ts` 파일을 선택 (디렉토리 `portfolio`가 아님)

### 올바른 파일 경로:
```
✅ src/data/portfolio.ts          (파일 - 열 수 있음)
❌ src/data/portfolio             (디렉토리 - 열 수 없음)
```

## 📝 설정 완료

`.vscode/settings.json`에 빈 디렉토리를 제외하도록 설정했습니다.
이제 에디터에서 빈 디렉토리가 표시되지 않아 혼동이 줄어듭니다.

## 💡 요약

- **파일은 모두 안전합니다** ✅
- **빈 디렉토리만 삭제했습니다** (정상적인 정리 작업)
- **에디터에서 파일을 열 때는 파일을 선택하세요** (디렉토리 아님)

