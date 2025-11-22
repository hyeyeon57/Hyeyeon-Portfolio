# Vercel MongoDB 환경 변수 설정 가이드

## 문제 상황
- ✅ 로컬에서는 정상 작동
- ❌ Vercel 배포 환경에서 503 에러 발생
- ❌ "MongoDB가 연결되지 않았습니다" 오류 메시지

## 원인
Vercel 배포 환경에 `MONGODB_URI` 환경 변수가 설정되지 않았습니다.

## 해결 방법

### 1. MongoDB Atlas 연결 문자열 준비

MongoDB Atlas를 사용 중이라면:
1. MongoDB Atlas 대시보드 접속: https://cloud.mongodb.com
2. **Database** 메뉴 클릭
3. **Connect** 버튼 클릭
4. **Connect your application** 선택
5. 연결 문자열 복사
   - 예: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. 데이터베이스 이름 추가: `vibe-coding-portfolio`
   - 최종: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority`

**중요**: `<password>` 부분을 실제 비밀번호로 변경하세요!

### 2. Vercel 환경 변수 설정

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택 (`hyeyeon-portfolio` 또는 해당 프로젝트)

2. **Settings 메뉴 클릭**
   - 프로젝트 페이지에서 **Settings** 탭 클릭

3. **Environment Variables 섹션으로 이동**
   - 왼쪽 메뉴에서 **Environment Variables** 클릭

4. **환경 변수 추가**
   - **Name**: `MONGODB_URI`
   - **Value**: MongoDB Atlas 연결 문자열
     - 예: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority`
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - (모두 체크 권장)

5. **Save 클릭**

### 3. 추가로 설정할 환경 변수 (선택사항)

다른 환경 변수도 필요하면 추가 설정:

#### 관리자 계정 (선택사항)
- **Name**: `ADMIN_USERNAME`
- **Value**: 관리자 사용자명 (기본값: `hing0915`)

- **Name**: `ADMIN_PASSWORD`
- **Value**: 관리자 비밀번호 (기본값: `dpffla525!`)

#### 세션 시크릿 (선택사항)
- **Name**: `SESSION_SECRET`
- **Value**: 세션 시크릿 키 (기본값 사용 가능)

### 4. 배포 다시 실행

환경 변수를 설정한 후:

#### 방법 1: 자동 재배포
- 환경 변수를 저장하면 자동으로 재배포가 시작됩니다
- Vercel 대시보드에서 배포 상태 확인

#### 방법 2: 수동 재배포
1. **Deployments** 탭 클릭
2. 최신 배포 항목의 **...** 메뉴 클릭
3. **Redeploy** 선택
4. **Use existing Build Cache** 체크 해제 (환경 변수 반영을 위해)
5. **Redeploy** 클릭

### 5. 연결 확인

배포 완료 후:

1. **프로젝트 목록 조회**
   - `https://hyeyeon-portfolio.vercel.app/projects` 접속
   - 프로젝트 목록이 표시되면 연결 성공 ✅

2. **Vercel 로그 확인**
   - Vercel 대시보드 > **Deployments** > 최신 배포 > **Functions** 탭
   - 로그에서 `✅ MongoDB 연결 성공` 메시지 확인

3. **마이그레이션 확인**
   - 로그에서 `📦 프로젝트가 없어 자동 마이그레이션을 실행합니다...` 메시지 확인
   - `✨ 마이그레이션 완료!` 메시지 확인

## 문제 해결

### 여전히 연결 실패하는 경우

1. **MongoDB Atlas 네트워크 액세스 확인**
   - MongoDB Atlas > **Network Access** 메뉴
   - `0.0.0.0/0` (모든 IP 허용) 추가되어 있는지 확인
   - 또는 Vercel 서버 IP 주소 추가

2. **연결 문자열 확인**
   - 사용자명/비밀번호가 올바른지 확인
   - 특수문자가 있으면 URL 인코딩 필요
   - 데이터베이스 이름이 포함되어 있는지 확인

3. **Vercel 환경 변수 확인**
   - Settings > Environment Variables에서 값이 올바른지 확인
   - Production, Preview, Development 모두 설정되어 있는지 확인

4. **재배포 확인**
   - 환경 변수 설정 후 재배포가 완료되었는지 확인
   - Build Cache를 사용하지 않고 재배포

5. **로그 확인**
   - Vercel 대시보드 > Functions 탭에서 상세 오류 메시지 확인
   - MongoDB 연결 오류 메시지 확인

## 테스트

배포 완료 후 다음 엔드포인트로 테스트:

- 프로젝트 목록: `https://hyeyeon-portfolio.vercel.app/api/projects`
- 방문자 통계: `https://hyeyeon-portfolio.vercel.app/api/bo/visitors/stats`

성공하면 JSON 응답이 반환됩니다! 🎉

