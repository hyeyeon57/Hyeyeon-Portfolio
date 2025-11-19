# 백오피스 서버 상태 ✅

## 현재 상태

✅ **서버 실행 중**: 포트 3005에서 정상 작동
✅ **HTTP 응답**: 상태 코드 200 (정상)
✅ **관리자 페이지**: `http://localhost:3005/admin` 접속 가능

## 접속 방법

### 방법 1: 자동 시작 (추천)
```bash
start-backoffice.bat  # 더블클릭
```

### 방법 2: 수동 시작
```bash
npm run dev:server
```

그 다음 브라우저에서:
```
http://localhost:3005/admin
```

## 문제 해결

### 접속이 안 될 때:

1. **서버가 실행 중인지 확인**
   ```bash
   netstat -ano | findstr ":3005"
   ```
   - LISTENING 상태여야 합니다

2. **서버 재시작**
   ```bash
   # 기존 프로세스 종료
   taskkill /F /IM node.exe
   
   # 서버 시작
   npm run dev:server
   ```

3. **브라우저 캐시 삭제**
   - Chrome: `Ctrl + Shift + Delete`
   - 또는 시크릿 모드로 접속: `Ctrl + Shift + N`

4. **포트 확인**
   - 포트 3005가 다른 프로그램에서 사용 중인지 확인

## 서버 정보

- **포트**: 3005
- **관리자 페이지**: `http://localhost:3005/admin`
- **프로젝트 생성**: `http://localhost:3005/admin/create`
- **API 엔드포인트**: `http://localhost:3005/api/projects`

## MongoDB 연결

MongoDB가 연결되지 않아도 서버는 실행됩니다.
하지만 프로젝트 관리 기능을 사용하려면 MongoDB 연결이 필요합니다.

```bash
# MongoDB 마이그레이션 (초기 데이터 입력)
npm run migrate
```

