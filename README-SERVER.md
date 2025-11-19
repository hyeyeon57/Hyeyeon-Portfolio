# 서버 실행 가이드

## 환경 설정

### 1. .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# MongoDB 연결 URI
# 로컬 MongoDB: mongodb://localhost:27017/vibe-coding-portfolio
# MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/vibe-coding-portfolio
# MongoDB가 설치되지 않은 경우 이 줄을 주석 처리하세요
MONGODB_URI=mongodb://localhost:27017/vibe-coding-portfolio

# 서버 포트
PORT=3005

# 클라이언트 URL (CORS 설정용)
CLIENT_URL=http://localhost:3001
```

### 2. MongoDB 설치 및 실행

#### 옵션 1: 로컬 MongoDB 설치
1. [MongoDB Community Edition](https://www.mongodb.com/try/download/community) 다운로드 및 설치
2. MongoDB 서비스 시작

#### 옵션 2: MongoDB Atlas 사용 (클라우드)
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에서 무료 계정 생성
2. 클러스터 생성 후 연결 문자열 복사
3. `.env` 파일의 `MONGODB_URI`에 연결 문자열 설정

#### 옵션 3: MongoDB 없이 실행 (개발용)
- `.env` 파일에서 `MONGODB_URI` 줄을 주석 처리하거나 삭제
- 서버는 실행되지만 프로젝트 관리 기능은 사용할 수 없습니다

## 서버 실행

### 방법 1: 두 서버 동시 실행 (추천)

```bash
npm run dev:all
```

이 명령어는 다음을 실행합니다:
- FO 서버: `http://localhost:3000` (Next.js)
- BO 서버: `http://localhost:3005` (Express + MongoDB)

### 방법 2: 각각 따로 실행

#### FO 서버만 실행
```bash
npm run dev
```
→ `http://localhost:3000`

#### BO 서버만 실행
```bash
npm run dev:server
```
→ `http://localhost:3005`

## 초기 데이터 마이그레이션

MongoDB에 초기 프로젝트 데이터를 추가하려면:

```bash
npm run migrate
```

## 문제 해결

### MongoDB 연결 실패
- MongoDB가 실행 중인지 확인
- `.env` 파일의 `MONGODB_URI`가 올바른지 확인
- 방화벽 설정 확인 (로컬 MongoDB의 경우)

### 포트 충돌
- 포트 3000 또는 3005가 이미 사용 중인 경우
- 다른 프로세스를 종료하거나 포트를 변경하세요

### 서버 에러
- `node_modules` 삭제 후 `npm install` 재실행
- `.next` 폴더 삭제 후 재시작

