# MongoDB URL 확인 방법

## 방법 1: Vercel 대시보드에서 확인 (가장 쉬운 방법)

### 1-1. Vercel 대시보드 접속
1. https://vercel.com/dashboard 접속
2. 로그인 후 프로젝트 선택
   - 백엔드: `hyeyeon-portfolio-admin`
   - 프론트엔드: `hyeyeon-portfolio` (같은 프로젝트로 통합된 경우)

### 1-2. Environment Variables 확인
1. 프로젝트 페이지에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 클릭
3. `MONGODB_URI` 변수 찾기
4. **Value** 열에서 연결 문자열 확인
   - 형식: `mongodb+srv://사용자명:비밀번호@클러스터주소/데이터베이스명?retryWrites=true&w=majority`
   - 예시: `mongodb+srv://janghyeyeon57_db_user:****@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority`

### 1-3. 환경 변수 편집 (필요시)
- `MONGODB_URI` 변수 옆의 **⋯** (점 3개) 메뉴 클릭
- **Edit** 클릭하여 값 확인/수정
- **Save** 클릭

---

## 방법 2: Health Check API 사용 (실시간 확인)

### 2-1. Health Check API 접속
브라우저에서 다음 URL 접속:
```
https://hyeyeon-portfolio-admin.vercel.app/bo-api/health
```
또는 (같은 프로젝트로 통합된 경우)
```
https://hyeyeon-portfolio.vercel.app/bo-api/health
```

### 2-2. 응답 확인
성공 시 응답 예시:
```json
{
  "success": true,
  "mongodb": {
    "connected": true,
    "state": 1,
    "stateText": "connected",
    "host": "ac-fm0smb3-shard-00-01.tctdejk.mongodb.net",
    "database": "vibe-coding-portfolio",
    "hasMongoURI": true  ← 이 값이 true면 환경 변수가 설정되어 있음
  },
  "vercel": true,
  "timestamp": "2025-11-27T..."
}
```

**확인 포인트:**
- `hasMongoURI: true` → 환경 변수 설정됨 ✅
- `hasMongoURI: false` → 환경 변수 미설정 ❌
- `connected: true` → MongoDB 연결 성공 ✅
- `connected: false` → MongoDB 연결 실패 ❌

---

## 방법 3: Vercel 로그에서 확인

### 3-1. Vercel 로그 접속
1. Vercel 대시보드 → 프로젝트 선택
2. **Deployments** 탭 클릭
3. 최신 배포 클릭
4. **Functions** 탭 클릭
5. `api/index.js` 함수 클릭

### 3-2. 로그에서 확인
로그에서 다음 메시지 찾기:
```
🔍 MongoDB 연결 시도:
   - Vercel 환경: 예
   - MONGODB_URI 설정: 예  ← 이 값 확인
   - 연결 문자열: mongodb+srv://janghyeyeon57_db_user:****@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
```

**확인 포인트:**
- `MONGODB_URI 설정: 예` → 환경 변수 설정됨 ✅
- `MONGODB_URI 설정: 아니오` → 환경 변수 미설정 ❌
- `연결 문자열: 없음 (기본값 사용)` → 환경 변수 미설정 ❌

---

## 방법 4: MongoDB Atlas에서 연결 문자열 확인

### 4-1. MongoDB Atlas 접속
1. https://cloud.mongodb.com 접속
2. 로그인 후 프로젝트 선택

### 4-2. 연결 문자열 복사
1. 왼쪽 사이드바에서 **Database** 클릭
2. **Connect** 버튼 클릭
3. **Connect your application** 선택
4. **Driver**: Node.js 선택
5. **Version**: 최신 버전 선택
6. 연결 문자열 복사
   - 예: `mongodb+srv://janghyeyeon57_db_user:<password>@hyeyeon.tctdejk.mongodb.net/?retryWrites=true&w=majority`

### 4-3. 연결 문자열 완성
1. `<password>` 부분을 실제 비밀번호로 교체
2. 데이터베이스 이름 추가: `/vibe-coding-portfolio`
3. 최종 형식:
   ```
   mongodb+srv://janghyeyeon57_db_user:실제비밀번호@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
   ```

---

## 방법 5: 로컬 개발 환경에서 확인

### 5-1. .env 파일 확인
프로젝트 루트에 `.env` 또는 `.env.local` 파일이 있다면:
```bash
# Windows (CMD)
type .env | findstr MONGODB_URI

# Windows (PowerShell)
Get-Content .env | Select-String MONGODB_URI

# Mac/Linux
cat .env | grep MONGODB_URI
```

### 5-2. 환경 변수 직접 확인
```bash
# Windows (CMD)
echo %MONGODB_URI%

# Windows (PowerShell)
$env:MONGODB_URI

# Mac/Linux
echo $MONGODB_URI
```

---

## 빠른 확인 체크리스트

### ✅ 환경 변수 설정 확인
- [ ] Vercel 대시보드 → Settings → Environment Variables
- [ ] `MONGODB_URI` 변수가 있는지 확인
- [ ] Production, Preview, Development 모두 체크되어 있는지 확인

### ✅ 연결 상태 확인
- [ ] Health Check API 접속: `/bo-api/health`
- [ ] `hasMongoURI: true` 확인
- [ ] `connected: true` 확인

### ✅ 로그 확인
- [ ] Vercel 로그에서 `MONGODB_URI 설정: 예` 확인
- [ ] 연결 문자열이 올바른 형식인지 확인

---

## 문제 해결

### 문제 1: `hasMongoURI: false`
**원인**: Vercel 환경 변수가 설정되지 않음
**해결**:
1. Vercel → Settings → Environment Variables
2. `MONGODB_URI` 추가
3. 재배포 (Redeploy)

### 문제 2: `connected: false`
**원인**: MongoDB 연결 실패
**가능한 원인**:
- MongoDB Atlas Network Access 설정 문제
- 연결 문자열 오류
- 비밀번호 오류
- 클러스터 일시 중지

**해결**:
1. MongoDB Atlas → Network Access → `0.0.0.0/0` 추가 확인
2. 연결 문자열 형식 확인
3. 비밀번호 확인
4. 클러스터 상태 확인

---

## 참고

- **보안**: MongoDB URL에는 비밀번호가 포함되어 있으므로 절대 공개하지 마세요
- **형식**: `mongodb+srv://` 형식은 MongoDB Atlas 전용입니다
- **로컬 개발**: 로컬 MongoDB를 사용하는 경우 `mongodb://localhost:27017/데이터베이스명` 형식을 사용합니다

