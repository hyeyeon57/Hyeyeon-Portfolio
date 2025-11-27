# MongoDB Atlas 연결 문자열 찾기 (단계별 가이드)

## 📍 경로: Database → Connect → Connect your application

### 1단계: MongoDB Atlas 대시보드 접속
1. https://cloud.mongodb.com 접속
2. 로그인

### 2단계: 프로젝트 선택 (중요!)
⚠️ **현재 "Organization Settings" 페이지에 있다면:**
- 상단 오른쪽의 **"Projects"** 메뉴 클릭
- 또는 왼쪽 사이드바에서 **"All Projects"** 클릭
- 사용 중인 프로젝트 선택

**확인 방법:**
- 프로젝트를 선택하면 왼쪽 사이드바에 **"Deployments"** 또는 **"Database"** 메뉴가 보여야 합니다
- Organization Settings 페이지에는 이 메뉴들이 없습니다

### 3단계: Database 메뉴 클릭
1. 왼쪽 사이드바에서 **"Deployments"** 섹션 찾기
2. **"Database"** 메뉴 클릭
   - 위치: Deployments → Database
   - 또는 상단 메뉴에서 "Database" 클릭

**화면 설명:**
- 클러스터 목록이 표시됩니다
- 클러스터 이름 옆에 **"Connect"** 버튼이 있습니다

### 4단계: Connect 버튼 클릭
1. 연결하려는 클러스터 찾기
2. 클러스터 카드 또는 목록에서 **"Connect"** 버튼 클릭
   - 버튼 위치: 클러스터 이름 옆 또는 클러스터 카드 내부

**화면 설명:**
- Connect 버튼을 클릭하면 연결 방법 선택 모달이 열립니다

### 5단계: Connect your application 선택
연결 방법 선택 화면에서:
1. **"Connect your application"** 옵션 클릭
   - 다른 옵션들:
     - "MongoDB Shell" (터미널용)
     - "MongoDB Compass" (GUI 도구)
     - "VS Code" (에디터 확장)
     - **"Connect your application"** ← 이걸 선택!

**화면 설명:**
- 여러 연결 방법이 아이콘과 함께 표시됩니다
- "Connect your application"은 코드 아이콘(</>) 또는 앱 아이콘으로 표시됩니다

### 6단계: 드라이버 선택 및 연결 문자열 복사
1. **Driver** 드롭다운: `Node.js` 선택
2. **Version** 드롭다운: 최신 버전 선택 (예: `5.5 or later`)
3. 연결 문자열이 표시됩니다:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
4. **복사 버튼** 클릭 (연결 문자열 옆의 복사 아이콘)

**화면 설명:**
- 연결 문자열이 큰 텍스트 박스에 표시됩니다
- 오른쪽에 복사 아이콘(📋)이 있습니다
- `<username>`, `<password>`, `<cluster>`는 플레이스홀더입니다

### 7단계: 연결 문자열 완성
복사한 연결 문자열을 다음과 같이 수정:

**원본:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

**수정 방법:**
1. `<username>` → 실제 사용자명으로 교체
   - 예: `janghyeyeon57_db_user`
2. `<password>` → 실제 비밀번호로 교체
   - 예: `xQeEXQ6PYiHPnNKp`
   - ⚠️ 비밀번호에 특수문자(@, #, %)가 있으면 URL 인코딩 필요
3. `<cluster>` → 실제 클러스터 주소로 교체
   - 예: `hyeyeon.tctdejk.mongodb.net`
4. 데이터베이스 이름 추가: `/vibe-coding-portfolio`
   - `?` 앞에 추가

**최종 예시:**
```
mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
```

---

## 🔍 화면별 상세 설명

### 화면 1: MongoDB Atlas 대시보드
```
┌─────────────────────────────────────────┐
│ MongoDB Atlas                    [사용자] │
├─────────────────────────────────────────┤
│ [Projects ▼] [Organization Settings]    │
│                                          │
│ Deployments                              │
│ └─ Database                              │ ← 여기 클릭!
│                                          │
│ Security                                 │
│ └─ Network Access                        │
│ └─ Database Access                       │
└─────────────────────────────────────────┘
```

### 화면 2: Database 페이지 (클러스터 목록)
```
┌─────────────────────────────────────────┐
│ Database                                 │
├─────────────────────────────────────────┤
│                                          │
│ ┌─────────────────────────────────┐    │
│ │ Cluster0                         │    │
│ │ Free Tier                        │    │
│ │                                  │    │
│ │ [Connect]  [⋮]                  │ ← 여기!
│ └─────────────────────────────────┘    │
│                                          │
└─────────────────────────────────────────┘
```

### 화면 3: Connect 방법 선택
```
┌─────────────────────────────────────────┐
│ How would you like to connect?          │
├─────────────────────────────────────────┤
│                                          │
│ [MongoDB Shell]                         │
│ [MongoDB Compass]                       │
│ [VS Code]                               │
│ [Connect your application] ← 여기!      │
│                                          │
└─────────────────────────────────────────┘
```

### 화면 4: 연결 문자열 표시
```
┌─────────────────────────────────────────┐
│ Connect your application                │
├─────────────────────────────────────────┤
│ Driver: [Node.js ▼]                     │
│ Version: [5.5 or later ▼]               │
│                                          │
│ ┌─────────────────────────────────┐    │
│ │ mongodb+srv://<username>:       │    │
│ │ <password>@<cluster>.mongodb.   │    │
│ │ net/?retryWrites=true&w=majority│    │
│ │                    [📋 복사]    │ ← 여기!
│ └─────────────────────────────────┘    │
│                                          │
└─────────────────────────────────────────┘
```

---

## 💡 빠른 팁

### 팁 1: 프로젝트가 보이지 않을 때
- 상단의 **"Projects"** 메뉴 클릭
- 또는 왼쪽 사이드바에서 **"All Projects"** 클릭

### 팁 2: Database 메뉴가 보이지 않을 때
- 현재 "Organization Settings" 페이지에 있는 것입니다
- 프로젝트로 이동해야 합니다

### 팁 3: Connect 버튼이 보이지 않을 때
- 클러스터가 생성 중일 수 있습니다
- 몇 분 기다린 후 새로고침

### 팁 4: 연결 문자열이 복사되지 않을 때
- 수동으로 텍스트 선택 후 복사 (Ctrl+C)
- 또는 연결 문자열 전체를 드래그하여 선택

---

## ✅ 확인 체크리스트

- [ ] MongoDB Atlas에 로그인됨
- [ ] 프로젝트 선택됨 (Organization Settings 아님)
- [ ] Database 메뉴 클릭
- [ ] 클러스터의 Connect 버튼 클릭
- [ ] "Connect your application" 선택
- [ ] Node.js 드라이버 선택
- [ ] 연결 문자열 복사
- [ ] `<username>`, `<password>`, `<cluster>` 교체
- [ ] 데이터베이스 이름 추가 (`/vibe-coding-portfolio`)

---

## 🆘 여전히 찾을 수 없나요?

### 대안 1: 검색 기능 사용
1. MongoDB Atlas 상단 검색창에 **"Connect"** 입력
2. 검색 결과에서 **"Connect to your cluster"** 클릭

### 대안 2: 직접 URL 접속
클러스터가 이미 있다면:
1. 클러스터 이름 클릭
2. 상단에 **"Connect"** 버튼이 있을 수 있습니다

### 대안 3: 클러스터가 없는 경우
1. **"Build a Database"** 또는 **"Create"** 버튼 클릭
2. Free 플랜 선택
3. 클러스터 생성 후 Connect 버튼 클릭

