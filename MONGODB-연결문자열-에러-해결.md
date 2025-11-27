# MongoDB 연결 문자열 에러 해결 가이드

## ⚠️ 현재 받은 연결 문자열의 문제점

### 받은 연결 문자열:
```
mongodb+srv://janghyeyeon57_db_user:<db_password>@hyeyeon.tctdejk.mongodb.net/?appName=hyeyeon
```

### 문제점:
1. ❌ `<db_password>` 부분이 실제 비밀번호로 교체되지 않음
2. ❌ 데이터베이스 이름(`/vibe-coding-portfolio`)이 없음
3. ❌ `?appName=hyeyeon`만 있고 `retryWrites=true&w=majority`가 없음

---

## ✅ 올바른 연결 문자열 형식

### 수정 방법:

**1단계: 비밀번호 교체**
- `<db_password>` → 실제 비밀번호로 교체
- 예: `xQeEXQ6PYiHPnNKp`

**2단계: 데이터베이스 이름 추가**
- `@hyeyeon.tctdejk.mongodb.net/` 뒤에 `/vibe-coding-portfolio` 추가

**3단계: 쿼리 파라미터 수정**
- `?appName=hyeyeon` → `?retryWrites=true&w=majority`
- 또는 `?appName=hyeyeon&retryWrites=true&w=majority` (둘 다 포함 가능)

### 최종 올바른 연결 문자열:
```
mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
```

---

## 🔍 에러 확인 방법

### 방법 1: Health Check API로 확인
브라우저에서 다음 URL 접속:
```
https://hyeyeon-portfolio-admin.vercel.app/bo-api/health
```

응답에서 확인:
- `hasMongoURI: true` → 환경 변수 설정됨
- `hasMongoURI: false` → 환경 변수 미설정
- `connected: true` → 연결 성공
- `connected: false` → 연결 실패
- `error: "..."` → 에러 메시지 확인

### 방법 2: Vercel 로그 확인
1. Vercel 대시보드 → 프로젝트 선택
2. Deployments → 최신 배포 클릭
3. Functions → `api/index.js` 클릭
4. 로그에서 다음 확인:
   - `🔍 MongoDB 연결 시도:`
   - `MONGODB_URI 설정: 예/아니오`
   - `연결 문자열: ...`
   - `❌ MongoDB 연결 실패: ...`

---

## 🐛 일반적인 에러와 해결책

### 에러 1: "MongoAuthenticationError"
**원인**: 비밀번호 오류 또는 `<db_password>`가 그대로 있음
**해결**:
- `<db_password>`를 실제 비밀번호로 교체
- 비밀번호에 특수문자가 있으면 URL 인코딩

### 에러 2: "MongoServerSelectionError"
**원인**: 네트워크 접근 차단
**해결**:
- MongoDB Atlas → Network Access → `0.0.0.0/0` 추가

### 에러 3: "ENOTFOUND" 또는 "getaddrinfo"
**원인**: 클러스터 주소 오류
**해결**:
- 연결 문자열의 클러스터 주소 확인
- `hyeyeon.tctdejk.mongodb.net`이 올바른지 확인

### 에러 4: "hasMongoURI: false"
**원인**: 환경 변수가 로드되지 않음
**해결**:
- Vercel 환경 변수 재설정
- 재배포 (캐시 없이)

---

## 📝 체크리스트

연결 문자열을 설정할 때 확인할 사항:

- [ ] `<db_password>`가 실제 비밀번호로 교체되었는가?
- [ ] 데이터베이스 이름(`/vibe-coding-portfolio`)이 추가되었는가?
- [ ] `?retryWrites=true&w=majority`가 포함되었는가?
- [ ] Vercel 환경 변수에 올바르게 설정되었는가?
- [ ] Production, Preview, Development 모두 체크되었는가?
- [ ] 재배포를 했는가?

---

## 🎯 빠른 해결 방법

### Step 1: 연결 문자열 복사
MongoDB Atlas에서 받은 연결 문자열:
```
mongodb+srv://janghyeyeon57_db_user:<db_password>@hyeyeon.tctdejk.mongodb.net/?appName=hyeyeon
```

### Step 2: 수정
1. `<db_password>` → `xQeEXQ6PYiHPnNKp` (실제 비밀번호)
2. `/` 뒤에 `vibe-coding-portfolio` 추가
3. `?appName=hyeyeon` → `?retryWrites=true&w=majority`

### Step 3: 최종 결과
```
mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
```

### Step 4: Vercel에 설정
1. Vercel → Settings → Environment Variables
2. `MONGODB_URI` Edit
3. 위의 최종 연결 문자열 붙여넣기
4. Save
5. Redeploy

