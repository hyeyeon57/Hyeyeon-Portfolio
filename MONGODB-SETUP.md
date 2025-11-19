# MongoDB 연결 설정 가이드

## 현재 설정

`.env` 파일에 다음이 설정되어 있습니다:
```
MONGODB_URI=mongodb://localhost:27017/vibe-coding-portfolio
```

## 옵션 1: 로컬 MongoDB 사용 (현재 설정)

### MongoDB 설치 및 실행

1. **MongoDB Community Edition 다운로드**
   - https://www.mongodb.com/try/download/community
   - Windows용 설치 파일 다운로드

2. **MongoDB 설치**
   - 설치 마법사를 따라 설치
   - "Install MongoDB as a Service" 옵션 선택 (권장)

3. **MongoDB 서비스 확인**
   ```powershell
   # Windows 서비스에서 MongoDB 확인
   Get-Service | Where-Object {$_.Name -like "*mongo*"}
   ```

4. **MongoDB 서비스 시작** (필요한 경우)
   ```powershell
   Start-Service MongoDB
   ```

5. **연결 테스트**
   - 서버를 실행하면 자동으로 연결됩니다
   - 연결 성공 시: `✅ MongoDB 연결 성공: localhost`
   - 연결 실패 시: `❌ MongoDB 연결 실패` (서버는 계속 실행됨)

## 옵션 2: MongoDB Atlas 사용 (클라우드, 추천)

### 1. MongoDB Atlas 계정 생성
1. https://www.mongodb.com/cloud/atlas 접속
2. 무료 계정 생성 (Free Tier 사용 가능)

### 2. 클러스터 생성
1. "Build a Database" 클릭
2. "Free" 플랜 선택
3. 클라우드 제공자 및 리전 선택 (가장 가까운 리전 선택)
4. 클러스터 이름 설정 (예: `Cluster0`)
5. "Create" 클릭

### 3. 데이터베이스 사용자 생성
1. "Database Access" 메뉴로 이동
2. "Add New Database User" 클릭
3. 사용자명과 비밀번호 설정 (기억해두세요!)
4. "Database User Privileges"는 "Atlas admin" 선택
5. "Add User" 클릭

### 4. 네트워크 액세스 설정
1. "Network Access" 메뉴로 이동
2. "Add IP Address" 클릭
3. "Allow Access from Anywhere" 선택 (개발용) 또는 현재 IP 주소 입력
4. "Confirm" 클릭

### 5. 연결 문자열 가져오기
1. "Database" 메뉴로 이동
2. "Connect" 버튼 클릭
3. "Connect your application" 선택
4. 드라이버는 "Node.js", 버전은 "5.5 or later" 선택
5. 연결 문자열 복사 (예: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

### 6. .env 파일 업데이트
`.env` 파일을 열고 `MONGODB_URI`를 Atlas 연결 문자열로 변경:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
PORT=3005
CLIENT_URL=http://localhost:3001
```

**중요**: `username`과 `password`를 실제 값으로 변경하고, 데이터베이스 이름(`vibe-coding-portfolio`)을 추가하세요.

## 초기 데이터 마이그레이션

MongoDB 연결 후, 초기 프로젝트 데이터를 추가하려면:

```bash
npm run migrate
```

이 명령어는 `data/projects.json` 파일의 데이터를 MongoDB로 마이그레이션합니다.

## 연결 확인

서버를 실행하면 콘솔에 다음 메시지가 표시됩니다:

- **연결 성공**: `✅ MongoDB 연결 성공: [호스트명]`
- **연결 실패**: `❌ MongoDB 연결 실패: [에러 메시지]` (서버는 계속 실행됨)

## 문제 해결

### MongoDB 연결 실패
1. MongoDB 서비스가 실행 중인지 확인
2. `.env` 파일의 `MONGODB_URI`가 올바른지 확인
3. 방화벽 설정 확인 (로컬 MongoDB의 경우)
4. MongoDB Atlas를 사용하는 경우:
   - 네트워크 액세스에 현재 IP가 허용되어 있는지 확인
   - 사용자명과 비밀번호가 올바른지 확인
   - 연결 문자열에 데이터베이스 이름이 포함되어 있는지 확인

### 포트 충돌
- 포트 27017 (MongoDB 기본 포트)이 사용 중인 경우 다른 포트 사용
- `.env` 파일에서 포트 번호 변경

