# MongoDB + Vercel 연결 설정 가이드

## 1. Vercel 환경 변수 설정

### 1-1. Vercel 대시보드 접속
1. https://vercel.com/dashboard 접속
2. 로그인 후 `hyeyeon-portfolio-admin` 프로젝트 선택

### 1-2. Environment Variables 설정
1. 프로젝트 페이지에서 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Environment Variables** 클릭

### 1-3. MONGODB_URI 추가
1. **Add New** 버튼 클릭
2. 다음 정보 입력:
   - **Name**: `MONGODB_URI`
   - **Value**: MongoDB Atlas 연결 문자열
     - 형식: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority`
     - 예시: `mongodb+srv://janghyeyeon57_db_user:yourpassword@cluster0.xxxxx.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority`
   - **Environment**: 
     - ✅ **Production** 체크
     - ✅ **Preview** 체크
     - ✅ **Development** 체크 (선택사항)
3. **Save** 버튼 클릭

### 1-4. 다른 필요한 환경 변수 확인
다음 환경 변수들도 설정되어 있는지 확인:
- `ADMIN_USERNAME` (예: `hing0915`)
- `ADMIN_PASSWORD` (예: `dpffla525`)
- `SESSION_SECRET` (예: `vibe-coding-portfolio-secret-key-2025`)

### 1-5. 환경 변수 적용
- 환경 변수를 추가/수정한 후에는 **반드시 재배포**해야 합니다
- Deployments 탭 → 최신 배포의 **⋯** 메뉴 → **Redeploy** 클릭

---

## 2. MongoDB Atlas 네트워크 접근 설정

### 2-1. MongoDB Atlas 접속 및 프로젝트 선택

**⚠️ 중요: Network Access는 프로젝트 레벨에서 설정합니다!**

1. https://cloud.mongodb.com 접속
2. 로그인

**3. 프로젝트 선택 (중요!)**
   - 현재 화면이 "Organization Settings"라면 프로젝트로 이동해야 합니다
   - 상단 오른쪽의 **"ORGANIZATION"** 드롭다운 옆에 있는 **"Projects"** 메뉴 클릭
   - 또는 왼쪽 사이드바에서 **"All Projects"** 클릭
   - 사용 중인 프로젝트 선택 (예: "My Project" 또는 프로젝트 이름)
   
**4. 프로젝트 대시보드 확인**
   - 프로젝트를 선택하면 "Deployments" 또는 "Database" 페이지로 이동
   - 왼쪽 사이드바에 "Security" 섹션이 보여야 함

### 2-2. Network Access 설정 (상세 가이드)

#### 단계별 화면 설명

**1단계: MongoDB Atlas 대시보드 접속**
- https://cloud.mongodb.com 접속
- 로그인 후 프로젝트 선택
- 왼쪽 사이드바 메뉴 확인

**2단계: Network Access 메뉴 찾기**

⚠️ **현재 "Organization Settings" 페이지에 있다면:**
- 상단의 **"Projects"** 메뉴를 클릭하여 프로젝트로 이동해야 합니다
- Network Access는 프로젝트 레벨 설정이므로 Organization 레벨에서는 보이지 않습니다

**프로젝트 페이지에서:**
- 왼쪽 사이드바에서 **"Security"** 섹션 찾기
  - Security 섹션은 프로젝트 페이지에서만 보입니다
  - Organization Settings 페이지에는 Security 섹션이 없습니다
- **"Network Access"** 클릭
  - 위치: Security → Network Access
  - 또는 상단 검색창에 "Network Access" 입력하여 검색

**3단계: Network Access 페이지 확인**
- 페이지 상단에 **"IP Access List"** 제목 확인
- 현재 허용된 IP 주소 목록 표시
- 오른쪽 상단에 **"+ ADD IP ADDRESS"** 또는 **"Add IP Address"** 버튼 확인

**4단계: IP 주소 추가 버튼 클릭**
- **"+ ADD IP ADDRESS"** 또는 **"Add IP Address"** 버튼 클릭
- 모달 창 또는 새 페이지가 열림

**참고:**
- 이미 IP 주소가 추가되어 있으면 목록에 표시됨
- `0.0.0.0/0`이 있으면 모든 IP가 허용됨 (이미 설정 완료)
- IP 주소가 없으면 빨간색 경고 메시지가 표시될 수 있음

### 2-3. IP 주소 추가 방법 (상세 단계)

#### 방법 1: 모든 IP 허용 (Vercel 사용 시 권장)

**왜 이 방법을 사용하나요?**
- Vercel은 서버리스 환경으로 동적 IP를 사용합니다
- Vercel의 IP 주소는 계속 변경되므로 특정 IP를 지정하기 어렵습니다
- 따라서 모든 IP를 허용하는 것이 실용적입니다

**단계별 설정:**

1. **IP 주소 추가 모달 창 열기**
   - "+ ADD IP ADDRESS" 버튼 클릭
   - 모달 창이 열림

2. **IP 주소 입력 방법 선택**
   - **"Add Current IP Address"** 버튼이 보이면 클릭 (현재 IP 자동 추가)
   - 또는 **"IP Access List"** 입력 필드에 직접 입력

3. **모든 IP 허용 설정**
   - 입력 필드에 `0.0.0.0/0` 입력
     - `0.0.0.0` = 모든 IP 주소
     - `/0` = 모든 서브넷 마스크
   - 또는 드롭다운에서 "Allow Access from Anywhere" 선택 (있는 경우)

4. **설명 추가 (선택사항)**
   - **"Comment"** 또는 **"Description"** 필드에 입력:
     - 예: `Allow all IPs (Vercel deployment)`
     - 예: `Vercel 서버리스 함수 접근 허용`

5. **확인 및 저장**
   - **"Confirm"** 또는 **"Add"** 버튼 클릭
   - 설정이 저장되고 목록에 추가됨

6. **설정 확인**
   - IP Access List에 `0.0.0.0/0`이 표시되는지 확인
   - 상태가 **"Active"**인지 확인
   - 설정은 즉시 적용됨 (재시작 불필요)

⚠️ **보안 주의사항**: 
- `0.0.0.0/0`은 모든 IP를 허용하므로 보안상 위험할 수 있습니다
- 하지만 Vercel 서버리스 환경에서는 실용적인 선택입니다
- MongoDB Atlas는 인증(사용자명/비밀번호)으로 추가 보안을 제공합니다

#### 방법 2: 현재 IP만 추가 (개발/테스트용)

**단계:**
1. "+ ADD IP ADDRESS" 버튼 클릭
2. **"Add Current IP Address"** 버튼 클릭
3. 현재 컴퓨터의 IP 주소가 자동으로 추가됨
4. **"Confirm"** 클릭

**주의:** 
- 이 방법은 현재 컴퓨터에서만 접근 가능
- Vercel 배포 환경에서는 작동하지 않음
- 로컬 개발 환경에서만 사용 권장

### 2-4. 설정 확인
- 추가한 IP 주소가 목록에 표시되는지 확인
- 상태가 **Active**인지 확인
- 설정 변경 후 즉시 적용됩니다 (재시작 불필요)

---

## 3. MongoDB Atlas 데이터베이스 사용자 확인

### 3-1. Database Access 설정
1. 왼쪽 메뉴에서 **Database Access** 클릭
2. 사용자 목록 확인

### 3-2. 사용자 확인/생성
1. 기존 사용자가 있는지 확인
2. 없으면 **Add New Database User** 클릭

### 3-3. 사용자 생성 (필요한 경우)
1. **Authentication Method**: `Password` 선택
2. **Username**: 사용자명 입력 (예: `janghyeyeon57_db_user`)
3. **Password**: 
   - **Autogenerate Secure Password** 클릭 (권장)
   - 또는 직접 비밀번호 입력
   - ⚠️ **비밀번호를 반드시 저장하세요!** (나중에 볼 수 없음)
4. **Database User Privileges**: 
   - **Atlas admin** 선택 (모든 권한)
   - 또는 **Read and write to any database** 선택
5. **Add User** 클릭

### 3-4. 연결 문자열 확인
1. 왼쪽 메뉴에서 **Database** 클릭
2. **Connect** 버튼 클릭
3. **Connect your application** 선택
4. **Driver**: `Node.js` 선택
5. **Version**: 최신 버전 선택
6. 연결 문자열 복사:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```
7. `<username>`과 `<password>`를 실제 값으로 교체
8. `<database>`를 실제 데이터베이스 이름으로 교체 (예: `vibe-coding-portfolio`)

---

## 4. 연결 테스트

### 4-1. Vercel 로그 확인
1. Vercel 대시보드 → `hyeyeon-portfolio-admin` 프로젝트
2. **Deployments** 탭 클릭
3. 최신 배포 클릭
4. **Functions** 탭 클릭
5. `/bo-api/projects` 함수 선택
6. 로그에서 다음 메시지 확인:
   - ✅ `✅ MongoDB 연결 성공: ...`
   - ❌ `❌ MongoDB 연결 실패: ...`

### 4-2. Health Check API 테스트
1. 브라우저에서 다음 URL 접속:
   ```
   https://hyeyeon-portfolio-admin.vercel.app/bo-api/health
   ```
2. 응답 확인:
   ```json
   {
     "success": true,
     "mongodb": {
       "connected": true,
       "host": "...",
       "dbName": "...",
       "hasMongoURI": true
     }
   }
   ```

### 4-3. 프로젝트 API 테스트
1. 브라우저에서 다음 URL 접속:
   ```
   https://hyeyeon-portfolio-admin.vercel.app/bo-api/projects
   ```
2. 응답 확인:
   - 성공: `{"success": true, "data": [...]}`
   - 실패: `{"success": false, "error": "..."}`

---

## 5. 문제 해결 (Troubleshooting)

### 5-1. "MongoDB 연결 실패" 오류

#### 원인 1: 환경 변수 미설정
**해결 방법:**
- Vercel 환경 변수에 `MONGODB_URI`가 설정되어 있는지 확인
- 모든 환경(Production, Preview, Development)에 설정되어 있는지 확인
- 환경 변수 추가 후 **재배포** 필요

#### 원인 2: 네트워크 접근 차단
**해결 방법:**
- MongoDB Atlas → Network Access에서 `0.0.0.0/0` 추가
- 또는 현재 IP 주소 추가
- 설정 후 몇 분 대기 (즉시 적용되지만 확인 시간 필요)

#### 원인 3: 잘못된 연결 문자열
**해결 방법:**
- MongoDB Atlas → Database → Connect → Connect your application
- 연결 문자열 복사
- `<username>`, `<password>`, `<database>`를 실제 값으로 교체
- 특수문자가 포함된 비밀번호는 URL 인코딩 필요
  - 예: `password@123` → `password%40123`

#### 원인 4: 사용자 권한 부족
**해결 방법:**
- MongoDB Atlas → Database Access
- 사용자 권한이 **Atlas admin** 또는 **Read and write**인지 확인
- 권한이 없으면 사용자 편집 또는 새 사용자 생성

### 5-2. "MongoServerSelectionError" 오류

**원인**: 네트워크 연결 문제

**해결 방법:**
1. MongoDB Atlas → Network Access 확인
2. Vercel 서버 IP가 허용 목록에 있는지 확인
3. `0.0.0.0/0` 추가 (모든 IP 허용)

### 5-3. "MongoAuthenticationError" 오류

**원인**: 인증 실패 (사용자명/비밀번호 오류)

**해결 방법:**
1. MongoDB Atlas → Database Access
2. 사용자명과 비밀번호 확인
3. 연결 문자열의 `<username>`과 `<password>`가 올바른지 확인
4. 비밀번호에 특수문자가 있으면 URL 인코딩 확인

### 5-4. "ENOTFOUND" 또는 "getaddrinfo" 오류

**원인**: DNS 조회 실패 (클러스터 주소 오류)

**해결 방법:**
1. MongoDB Atlas → Database → Connect
2. 올바른 클러스터 주소 확인
3. 연결 문자열의 클러스터 주소가 올바른지 확인

---

## 6. 보안 권장사항

### 6-1. 환경 변수 보안
- ✅ Vercel 환경 변수에 민감한 정보 저장 (코드에 하드코딩 금지)
- ✅ Production, Preview, Development 환경별로 다른 값 사용 가능
- ✅ 환경 변수는 암호화되어 저장됨

### 6-2. 네트워크 접근 보안
- ⚠️ `0.0.0.0/0`은 모든 IP를 허용하므로 보안상 위험
- ✅ 프로덕션 환경에서는 특정 IP만 허용 권장
- ✅ MongoDB Atlas IP Access List에서 불필요한 IP 제거

### 6-3. 데이터베이스 사용자 보안
- ✅ 강력한 비밀번호 사용
- ✅ 최소 권한 원칙 적용 (필요한 권한만 부여)
- ✅ 정기적으로 비밀번호 변경

---

## 7. 체크리스트

배포 전 확인 사항:
- [ ] Vercel 환경 변수 `MONGODB_URI` 설정 완료
- [ ] Production, Preview 환경에 모두 설정
- [ ] MongoDB Atlas Network Access에 `0.0.0.0/0` 추가
- [ ] MongoDB Atlas Database Access에 사용자 생성/확인
- [ ] 연결 문자열의 `<username>`, `<password>`, `<database>` 교체 완료
- [ ] 환경 변수 추가 후 재배포 완료
- [ ] Health Check API 테스트 성공
- [ ] 프로젝트 API 테스트 성공

---

## 8. MongoDB Atlas 알림 해석

### 8-1. 일반적인 알림 (문제 없음)
다음 알림들은 **기본 알림 설정이 추가된 것**이며, 실제 문제가 발생한 것은 아닙니다:
- ✅ "Alert configuration added" - 알림 설정이 추가됨 (정상)
- ✅ "A Log Forwarder has failed and cannot be restarted" - Log Forwarder를 사용하지 않으면 무시 가능
- ✅ "A Sync process has failed and cannot be restarted" - Sync를 사용하지 않으면 무시 가능
- ✅ "A Trigger was automatically resumed" - Trigger가 자동으로 재개됨 (정상)
- ✅ "A Trigger has failed and cannot be restarted" - Trigger를 사용하지 않으면 무시 가능

### 8-2. 주의가 필요한 알림

#### "An overall request rate limit has been hit" (요청 속도 제한 도달)
**의미**: MongoDB Atlas의 요청 속도 제한에 도달했습니다.

**원인**:
- 너무 많은 API 요청
- Vercel 서버리스 함수가 너무 자주 호출됨
- 무한 루프나 과도한 재시도

**해결 방법**:
1. **Vercel 로그 확인**:
   - Vercel 대시보드 → Functions 탭
   - `/bo-api/projects` 함수 로그 확인
   - 과도한 호출이 있는지 확인

2. **재시도 로직 조정**:
   - 현재 코드에서 MongoDB 연결 재시도가 3회로 설정되어 있음
   - 필요시 재시도 횟수나 간격 조정

3. **캐싱 추가**:
   - 프로젝트 데이터를 일정 시간 캐싱하여 요청 수 감소

4. **MongoDB Atlas 플랜 확인**:
   - Free Tier는 요청 제한이 낮음
   - 필요시 플랜 업그레이드 고려

**임시 해결책**:
- 몇 분 후 자동으로 제한이 해제됨
- MongoDB Atlas는 요청 제한을 시간 단위로 관리

### 8-3. 알림 설정 관리
1. MongoDB Atlas → **Alerts** 탭
2. 불필요한 알림은 비활성화 가능
3. 중요한 알림만 활성화 권장:
   - ✅ "An overall request rate limit has been hit" (권장)
   - ✅ "Replica set member is down" (권장)
   - ✅ "Disk space is low" (권장)
   - ❌ Log Forwarder, Sync, Trigger 관련 알림 (사용하지 않으면 비활성화)

### 8-4. 요청 속도 제한 확인
1. MongoDB Atlas → **Metrics** 탭
2. **Operations** 그래프 확인
3. 요청 수가 급증하는 패턴 확인
4. 특정 시간대에 과도한 요청이 있는지 확인

---

## 9. 빠른 참조

### 연결 문자열 형식
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### Vercel 환경 변수 설정 위치
```
Vercel Dashboard → Project → Settings → Environment Variables
```

### MongoDB Atlas 설정 위치
- Network Access: `MongoDB Atlas → Network Access`
- Database Access: `MongoDB Atlas → Database Access`
- Connection String: `MongoDB Atlas → Database → Connect → Connect your application`

### 테스트 URL
- Health Check: `https://hyeyeon-portfolio-admin.vercel.app/bo-api/health`
- Projects API: `https://hyeyeon-portfolio-admin.vercel.app/bo-api/projects`

