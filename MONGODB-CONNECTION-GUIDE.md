# MongoDB 연결 가이드

## 현재 상태
- `.env` 파일에 로컬 MongoDB 설정이 되어 있습니다: `mongodb://localhost:27017/vibe-coding-portfolio`
- 로컬 MongoDB 서비스가 설치되어 있지 않습니다.

## 옵션 1: MongoDB Atlas 사용 (추천) ⭐

### 장점
- 무료 티어 제공 (512MB 저장공간)
- 설치 불필요
- 클라우드에서 자동 관리
- 어디서나 접근 가능

### 설정 방법

1. **MongoDB Atlas 계정 생성**
   - https://www.mongodb.com/cloud/atlas 접속
   - "Try Free" 클릭하여 무료 계정 생성

2. **클러스터 생성**
   - "Build a Database" 클릭
   - "Free" 플랜 선택 (M0)
   - 클라우드 제공자 및 리전 선택 (가장 가까운 리전, 예: `Seoul (ap-northeast-2)`)
   - 클러스터 이름 설정 (기본값 `Cluster0` 사용 가능)
   - "Create" 클릭

3. **데이터베이스 사용자 생성**
   - "Database Access" 메뉴로 이동
   - "Add New Database User" 클릭
   - Authentication Method: "Password" 선택
   - Username과 Password 설정 (기억해두세요!)
   - Database User Privileges: "Atlas admin" 선택
   - "Add User" 클릭

4. **네트워크 액세스 설정**
   - "Network Access" 메뉴로 이동
   - "Add IP Address" 클릭
   - 개발용이므로 "Allow Access from Anywhere" 선택 (0.0.0.0/0)
   - 또는 현재 IP 주소만 허용하려면 "Add Current IP Address" 클릭
   - "Confirm" 클릭

5. **연결 문자열 가져오기**
   - "Database" 메뉴로 이동
   - "Connect" 버튼 클릭
   - "Connect your application" 선택
   - Driver: "Node.js", Version: "5.5 or later" 선택
   - 연결 문자열 복사
   - 예: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **`.env` 파일 업데이트**
   - 연결 문자열에서 `<password>`를 실제 비밀번호로 변경
   - 데이터베이스 이름 추가: `vibe-coding-portfolio`
   - 예: `mongodb+srv://username:실제비밀번호@cluster0.xxxxx.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority`

## 옵션 2: 로컬 MongoDB 설치

### Windows 설치 방법

1. **MongoDB Community Edition 다운로드**
   - https://www.mongodb.com/try/download/community
   - Windows용 MSI 설치 파일 다운로드
   - "Complete" 설치 선택

2. **MongoDB 설치**
   - 설치 마법사를 따라 설치
   - "Install MongoDB as a Service" 옵션 선택 (권장)
   - "Run service as Network Service user" 선택
   - "Install MongoDB Compass" 옵션은 선택 해제 가능 (GUI 도구)

3. **MongoDB 서비스 확인 및 시작**
   ```powershell
   # 서비스 확인
   Get-Service -Name "*mongo*"
   
   # 서비스 시작 (필요한 경우)
   Start-Service MongoDB
   ```

4. **연결 테스트**
   - 서버를 실행하면 자동으로 연결됩니다
   - 연결 성공 시: `✅ MongoDB 연결 성공: localhost`

## 연결 확인

서버를 실행하면 자동으로:
1. MongoDB 연결 시도
2. 연결 성공 시 정적 프로젝트 데이터 자동 마이그레이션
3. 콘솔에 연결 상태 표시

### 성공 메시지
```
✅ MongoDB 연결 성공: [호스트명]
📦 9개의 정적 프로젝트를 MongoDB로 마이그레이션합니다...
✨ 마이그레이션 완료!
```

### 실패 메시지
```
❌ MongoDB 연결 실패: [에러 메시지]
⚠️  MongoDB 연결 없이 서버를 시작합니다.
```

## 문제 해결

### MongoDB Atlas 연결 실패
- 네트워크 액세스에 현재 IP가 허용되어 있는지 확인
- 사용자명과 비밀번호가 올바른지 확인
- 연결 문자열에 데이터베이스 이름이 포함되어 있는지 확인
- 연결 문자열의 특수문자(비밀번호에 포함된 경우)를 URL 인코딩

### 로컬 MongoDB 연결 실패
- MongoDB 서비스가 실행 중인지 확인: `Get-Service MongoDB`
- 포트 27017이 사용 중인지 확인
- 방화벽 설정 확인

