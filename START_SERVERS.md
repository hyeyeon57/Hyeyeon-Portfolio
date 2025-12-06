# 서버 시작 가이드

## ⚠️ 중요: 서버 시작 순서

**반드시 백엔드 서버를 먼저 실행한 후 프론트엔드 서버를 실행하세요!**

## 1단계: 백엔드 서버 시작 (터미널 1)

```bash
cd C:\Users\USER\Desktop\port\Hyeyeon-Portfolio
npm run dev:server
```

**정상 실행 시:**
- `✅ MongoDB 연결 성공: localhost` 메시지가 보여야 합니다
- `서버가 포트 3005에서 실행 중입니다` 메시지가 보여야 합니다

## 2단계: 프론트엔드 서버 시작 (터미널 2)

백엔드 서버가 정상 실행된 후:

```bash
cd C:\Users\USER\Desktop\port\Hyeyeon-Portfolio
npm run dev
```

**정상 실행 시:**
- `Ready in X.Xs` 메시지가 보여야 합니다
- `Local: http://localhost:3000` 메시지가 보여야 합니다

## 문제 해결

### 백엔드 서버가 시작되지 않으면:
1. MongoDB가 실행 중인지 확인
2. `.env` 파일에 `MONGODB_URI`가 설정되어 있는지 확인
3. 포트 3005가 사용 중인지 확인

### 프론트엔드에서 500 에러가 나면:
1. **백엔드 서버가 실행 중인지 확인** (가장 중요!)
2. 백엔드 서버 터미널에서 에러 메시지 확인
3. `http://localhost:3005/bo-api/health` 접속해서 서버 상태 확인

### `.next` 폴더 에러가 나면:
```powershell
# 모든 Node 프로세스 종료
taskkill /F /IM node.exe

# 잠시 대기
Start-Sleep -Seconds 3

# 캐시 삭제
cd C:\Users\USER\Desktop\port\Hyeyeon-Portfolio
if (Test-Path .next) { Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue }
if (Test-Path node_modules\.cache) { Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue }
```

## 체크리스트

- [ ] 백엔드 서버 실행 중 (포트 3005)
- [ ] MongoDB 연결 성공
- [ ] 프론트엔드 서버 실행 중 (포트 3000)
- [ ] 브라우저에서 `http://localhost:3000` 접속 가능

