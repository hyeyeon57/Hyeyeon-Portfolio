# FO-BO 연동 가이드

## ✅ 연동 완료!

FO(프론트엔드) 화면과 BO(백오피스) 화면이 성공적으로 연동되었습니다.

## 🔄 작동 방식

### 1. 데이터 흐름
```
BO 서버 (포트 3005, MongoDB)
    ↓
Next.js API 라우트 (/api/projects)
    ↓
FO 화면 (포트 3000)
```

### 2. 프로젝트 추가/수정/삭제
- **BO에서 프로젝트 추가** → MongoDB에 저장
- **FO 화면 새로고침** → 자동으로 새 프로젝트 표시
- **정적 데이터와 병합**: BO의 새 프로젝트가 정적 프로젝트와 함께 표시됨

## 📁 변경된 파일

### 1. `src/app/api/projects/route.ts` (신규)
- BO 서버의 `/api/projects` 엔드포인트를 호출
- MongoDB 데이터를 FO 형식으로 변환
- 오류 시 정적 데이터 사용 (fallback)

### 2. `src/components/sections/ProjectsSection.tsx`
- `useEffect`로 BO 서버에서 프로젝트 로드
- 정적 프로젝트와 BO 프로젝트 병합
- 대표 프로젝트 3개는 여전히 고정 (SRT, 밀리의 서재, 아트랑)

### 3. `src/app/projects/page.tsx`
- localStorage 대신 BO 서버에서 프로젝트 로드
- 정적 프로젝트와 BO 프로젝트 병합

### 4. `server/index.cjs`
- CORS 설정 추가 (포트 3000, 3001, 3002 허용)

## 🚀 사용 방법

### 1. 서버 시작
```bash
# FO 서버 (포트 3000)
npm run dev

# BO 서버 (포트 3005)
npm run dev:server

# 또는 동시에 시작
npm run dev:all
```

### 2. 프로젝트 추가
1. `http://localhost:3005/admin` 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 정보 입력 및 저장
4. `http://localhost:3000` 새로고침
5. 새 프로젝트가 FO 화면에 표시됨!

### 3. 프로젝트 수정/삭제
1. BO에서 프로젝트 수정 또는 삭제
2. FO 화면 새로고침
3. 변경사항 반영됨

## 🔧 데이터 병합 로직

1. **정적 프로젝트** (`src/data/portfolio.ts`)를 기본으로 사용
2. **BO 프로젝트**가 있으면 같은 ID의 정적 프로젝트를 덮어씀
3. **BO에만 있는 새 프로젝트**는 목록에 추가

## ⚠️ 주의사항

### MongoDB 연결
- BO 서버는 MongoDB 연결이 없어도 실행됩니다
- 하지만 프로젝트 관리 기능을 사용하려면 MongoDB가 필요합니다
- MongoDB가 없으면 FO는 정적 데이터만 표시합니다

### 대표 프로젝트
- 대표 프로젝트 3개 (SRT, 밀리의 서재, 아트랑)는 ID로 고정됩니다
- BO에서 이 프로젝트를 수정하면 FO에도 반영됩니다
- 하지만 순서는 항상 고정됩니다

## 🐛 문제 해결

### FO에서 프로젝트가 안 보일 때
1. BO 서버가 실행 중인지 확인 (`http://localhost:3005/admin`)
2. MongoDB가 연결되어 있는지 확인
3. 브라우저 콘솔에서 오류 확인
4. FO 서버 콘솔에서 API 호출 확인

### CORS 오류
- BO 서버의 CORS 설정 확인
- FO 서버 포트가 허용 목록에 있는지 확인

## 📝 환경 변수

`.env` 파일에 다음을 추가할 수 있습니다:
```env
BACKOFFICE_API_URL=http://localhost:3005
```

기본값은 `http://localhost:3005`입니다.

