# MongoDB Atlas: API Key vs 연결 문자열 차이

## 🔑 보여주신 것: MongoDB Atlas API Key

```
Public Key: asjxbgme
Private Key: 855ac121-78a6-4152-926a-861464bcb021
```

**이것은 MongoDB Atlas API를 사용할 때 필요한 인증 키입니다.**
- MongoDB Atlas API 호출 시 사용
- 프로그래밍 방식으로 클러스터 관리 시 사용
- **애플리케이션에서 MongoDB에 연결할 때는 사용하지 않습니다!**

---

## 🔌 필요한 것: MongoDB 연결 문자열 (MONGODB_URI)

**애플리케이션에서 MongoDB에 연결하려면 연결 문자열이 필요합니다.**

### 형식:
```
mongodb+srv://사용자명:비밀번호@클러스터주소/데이터베이스명?retryWrites=true&w=majority
```

### 예시:
```
mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
```

---

## 📍 연결 문자열 찾는 방법

### 1단계: 프로젝트 페이지로 이동
- Organization Settings가 아닌 프로젝트 페이지로 이동
- 왼쪽 사이드바에 "Deployments" → "Database" 메뉴가 보여야 함

### 2단계: Database 메뉴 클릭
- 왼쪽 사이드바에서 "Deployments" → "Database" 클릭
- 클러스터 목록이 표시됨

### 3단계: Connect 버튼 클릭
- 클러스터 카드 또는 목록에서 "Connect" 버튼 클릭

### 4단계: "Connect your application" 선택
- 연결 방법 선택 화면에서
- **"Connect your application"** 옵션 클릭 (코드 아이콘)

### 5단계: 드라이버 선택 및 연결 문자열 복사
- **Driver**: `Node.js` 선택
- **Version**: 최신 버전 선택
- 연결 문자열 복사
- 형식: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`

### 6단계: 연결 문자열 완성
1. `<username>` → 실제 사용자명으로 교체 (예: `janghyeyeon57_db_user`)
2. `<password>` → 실제 비밀번호로 교체 (예: `xQeEXQ6PYiHPnNKp`)
3. 데이터베이스 이름 추가: `/vibe-coding-portfolio`

**최종 예시:**
```
mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
```

---

## 🔍 API Key는 어디서 찾았나요?

API Key는 다음 위치에서 찾을 수 있습니다:
- MongoDB Atlas → Organization Settings → Access Manager → API Keys
- 또는 프로젝트 설정 → API Keys

**하지만 이것은 연결 문자열이 아닙니다!**

---

## ✅ 정리

| 항목 | 용도 | 위치 |
|------|------|------|
| **연결 문자열 (MONGODB_URI)** | 애플리케이션에서 MongoDB 연결 | Database → Connect → Connect your application |
| **API Key** | MongoDB Atlas API 호출 | Organization Settings → API Keys |

**우리가 필요한 것: 연결 문자열 (MONGODB_URI)**

---

## 🎯 다음 단계

1. 프로젝트 페이지로 이동
2. Database → Connect → Connect your application
3. 연결 문자열 복사
4. Vercel 환경 변수에 설정
5. 재배포

