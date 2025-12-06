# 왜 자꾸 에러가 나는가?

## 🔍 에러 원인 분석

### 1. `.next` 폴더 파일 잠금 에러 (가장 흔한 원인)

**에러 메시지:**
```
⨯ [Error: UNKNOWN: unknown error, open 'C:\Users\USER\Desktop\port\Hyeyeon-Portfolio\.next\static\chunks\app\layout.js']
```

**원인:**
- Windows에서 Next.js가 Hot Module Replacement (HMR)를 수행할 때 파일을 업데이트하려고 함
- 동시에 다른 프로세스(안티바이러스, Windows Defender, 파일 인덱싱)가 파일을 스캔 중
- 파일이 잠겨서 업데이트할 수 없음
- Fast Refresh가 실패하면서 500 에러 발생

**왜 자꾸 발생하는가:**
1. **코드 수정 시마다 Fast Refresh 실행** → 파일 업데이트 시도
2. **Windows Defender 실시간 스캔** → 파일 접근 시 잠금
3. **여러 Node 프로세스 실행** → 같은 파일에 동시 접근
4. **파일 시스템 레벨 문제** → Windows의 파일 잠금 메커니즘

### 2. 백엔드 서버 미실행

**에러 메시지:**
```
❌ 프로젝트 로드 실패: Error: 백엔드 API 호출 실패 (500: Internal Server Error)
```

**원인:**
- 백엔드 서버(포트 3005)가 실행되지 않음
- 프론트엔드가 백엔드 API를 호출할 수 없음

## ✅ 해결 방법

### 즉시 해결 (에러 발생 시)

```powershell
# 1. 모든 Node 프로세스 종료
taskkill /F /IM node.exe

# 2. 10초 대기 (파일 잠금 해제)
Start-Sleep -Seconds 10

# 3. 프로젝트 폴더로 이동
cd C:\Users\USER\Desktop\port\Hyeyeon-Portfolio

# 4. .next 폴더 완전 삭제
if (Test-Path .next) { 
  Get-ChildItem .next -Recurse -Force | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
  Remove-Item .next -Force -Recurse -ErrorAction SilentlyContinue 
}

# 5. 백엔드 서버 시작 (터미널 1)
npm run dev:server

# 6. 프론트엔드 서버 시작 (터미널 2)
npm run dev
```

### 근본적 해결 (재발 방지)

#### 1. Windows Defender 예외 목록 추가

1. **Windows 보안** 열기
2. **바이러스 및 위협 방지** → **설정 관리**
3. **제외** → **제외 추가 또는 제거**
4. **폴더** 선택 → `C:\Users\USER\Desktop\port\Hyeyeon-Portfolio` 추가

#### 2. 안티바이러스 실시간 스캔 비활성화 (개발 중에만)

- 프로젝트 폴더를 예외 목록에 추가

#### 3. 관리자 권한으로 실행

- 터미널을 **관리자 권한**으로 실행 후 서버 시작

## 📋 적용된 개선 사항

1. **Next.js 설정 개선** (`next.config.mjs`):
   - `aggregateTimeout: 500` (300ms → 500ms로 증가)
   - `followSymlinks: false` 추가
   - 파일 시스템 캐시 설정 개선

2. **에러 처리 강화**:
   - 상세한 에러 로깅
   - 타입별 에러 메시지 제공

## 🎯 권장 사항

1. **코드 수정 후 자동 새로고침이 실패하면**:
   - 브라우저에서 수동 새로고침 (`Ctrl + F5`)
   - 서버를 재시작하지 않아도 됨

2. **에러가 계속 발생하면**:
   - `.next` 폴더 삭제 후 서버 재시작
   - Windows Defender 예외 목록 확인

3. **개발 중에는**:
   - Windows Defender 예외 목록에 프로젝트 폴더 추가
   - 불필요한 안티바이러스 스캔 비활성화

## 💡 핵심 포인트

**에러가 자꾸 나는 이유:**
- Windows의 파일 잠금 메커니즘 + Next.js의 Fast Refresh = 충돌
- 코드 수정 → Fast Refresh → 파일 업데이트 시도 → 파일 잠금 → 에러

**해결책:**
- Windows Defender 예외 목록 추가 (가장 중요!)
- `.next` 폴더 정기적 삭제
- 서버 재시작 순서 준수

