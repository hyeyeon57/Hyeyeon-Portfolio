# Vercel MongoDB 연결 실패 해결 가이드

## 문제 상황
- ✅ Vercel 환경 변수 설정 완료
- ❌ 배포 후 MongoDB 연결 실패
- ❌ "MongoDB가 연결되지 않았습니다" 오류

## 확인 사항

### 1. 환경 변수 설정 확인

Vercel 대시보드에서 확인:
1. **Settings** → **Environment Variables**
2. 다음 변수들이 모두 있는지 확인:
   - `MONGODB_URI`
   - `SESSION_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`

3. 각 변수의 **Environment** 설정 확인:
   - ✅ Production 체크되어 있는지
   - ✅ Preview 체크되어 있는지
   - ✅ Development 체크되어 있는지

### 2. 재배포 확인

**중요**: 환경 변수를 추가/수정한 후에는 **반드시 재배포**해야 합니다!

1. **Deployments** 탭으로 이동
2. 최신 배포 항목의 **...** (점 3개) 메뉴 클릭
3. **Redeploy** 선택
4. ⚠️ **"Use existing Build Cache" 체크 해제** (중요!)
5. **Redeploy** 클릭

### 3. MongoDB Atlas 네트워크 액세스 확인

MongoDB Atlas에서:
1. **Network Access** 메뉴로 이동
2. **IP Access List** 확인
3. 다음 중 하나가 있어야 함:
   - `0.0.0.0/0` (모든 IP 허용) - 개발용 권장
   - 또는 Vercel 서버 IP 주소

4. 없으면 **"Add IP Address"** 클릭
   - **"Allow Access from Anywhere"** 선택
   - 또는 **"Add Current IP Address"** 클릭

### 4. 연결 문자열 확인

Vercel 환경 변수 `MONGODB_URI` 값 확인:
```
mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
```

**확인 사항**:
- ✅ 사용자명: `janghyeyeon57_db_user`
- ✅ 비밀번호: `xQeEXQ6PYiHPnNKp` (특수문자 없음)
- ✅ 클러스터 주소: `hyeyeon.tctdejk.mongodb.net`
- ✅ 데이터베이스 이름: `vibe-coding-portfolio`

### 5. Vercel 로그 확인

배포 후 로그에서 확인:
1. **Deployments** → 최신 배포 클릭
2. **Functions** 탭 클릭
3. `api/index.js` 함수 클릭
4. 로그에서 다음 메시지 확인:

**성공 시**:
```
🔍 MongoDB 연결 시도:
   - Vercel 환경: 예
   - MONGODB_URI 설정: 예
   - 연결 문자열: mongodb+srv://janghyeyeon57_db_user:****@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
✅ MongoDB 연결 성공: ...
```

**실패 시**:
```
🔍 MongoDB 연결 시도:
   - Vercel 환경: 예
   - MONGODB_URI 설정: 아니오  ← 문제!
   - 연결 문자열: 없음 (기본값 사용)
❌ MongoDB 연결 실패: ...
```

## 문제 해결 단계

### 단계 1: 환경 변수 재확인
1. Vercel → Settings → Environment Variables
2. `MONGODB_URI` 값이 정확한지 확인
3. Production, Preview, Development 모두 체크되어 있는지 확인

### 단계 2: 환경 변수 재설정 (필요시)
1. 기존 `MONGODB_URI` 삭제
2. 새로 추가:
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority`
   - Environment: Production, Preview, Development 모두 체크

### 단계 3: 재배포 (캐시 없이)
1. Deployments → 최신 배포 → ... → Redeploy
2. **"Use existing Build Cache" 체크 해제** (중요!)
3. Redeploy 클릭

### 단계 4: MongoDB Atlas 확인
1. Network Access에 `0.0.0.0/0` 추가되어 있는지 확인
2. Database Access에서 사용자 권한 확인

### 단계 5: 로그 확인
1. 배포 완료 후 Functions 로그 확인
2. MongoDB 연결 성공 메시지 확인
3. 마이그레이션 성공 메시지 확인

## 일반적인 오류와 해결책

### 오류 1: "MONGODB_URI 설정: 아니오"
**원인**: 환경 변수가 제대로 로드되지 않음
**해결**: 
- 환경 변수 재설정
- 재배포 (캐시 없이)

### 오류 2: "MongoServerSelectionError"
**원인**: 네트워크 액세스 문제
**해결**: 
- MongoDB Atlas → Network Access → `0.0.0.0/0` 추가

### 오류 3: "MongoAuthenticationError"
**원인**: 사용자명/비밀번호 오류
**해결**: 
- MongoDB Atlas → Database Access에서 사용자 확인
- 연결 문자열의 사용자명/비밀번호 확인

### 오류 4: "ENOTFOUND" 또는 "getaddrinfo"
**원인**: 클러스터 주소 오류
**해결**: 
- MongoDB Atlas에서 올바른 클러스터 주소 확인
- 연결 문자열의 클러스터 주소 확인

## 테스트

배포 완료 후:
1. https://hyeyeon-portfolio-admin.vercel.app/admin 접속
2. 로그인 시도
3. 프로젝트 목록 확인: `/api/bo/projects` 엔드포인트 테스트

성공하면 프로젝트 목록이 표시됩니다! 🎉


