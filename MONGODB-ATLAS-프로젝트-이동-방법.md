# MongoDB Atlas: Organization Settings → 프로젝트로 이동하기

## 현재 위치 확인

현재 보이는 메뉴:
- Identity & Access
  - All Projects
  - Users
  - Applications
  - Teams
  - Federation
- Billing
  - Overview
  - Invoices
  - Cost Explorer
  - ...

**이것은 Organization Settings 페이지입니다!**

## 프로젝트로 이동하는 방법

### 방법 1: 상단 메뉴에서 이동 (가장 쉬운 방법)

1. **화면 상단 오른쪽을 확인**
   - 현재 "ORGANIZATION" 또는 조직 이름이 표시되어 있을 것입니다
   - 그 옆에 **"Projects"** 메뉴가 있습니다

2. **"Projects" 메뉴 클릭**
   - 드롭다운이 열리면 프로젝트 목록이 표시됩니다
   - 또는 "All Projects" 클릭

3. **프로젝트 선택**
   - 사용 중인 프로젝트 클릭
   - 예: "My Project" 또는 프로젝트 이름

### 방법 2: 왼쪽 사이드바에서 이동

1. **왼쪽 사이드바 확인**
   - "Identity & Access" 섹션 아래에 **"All Projects"** 메뉴가 있습니다

2. **"All Projects" 클릭**
   - 프로젝트 목록 페이지로 이동합니다

3. **프로젝트 선택**
   - 프로젝트 카드 또는 목록에서 프로젝트 클릭

### 방법 3: 상단 검색창 사용

1. **화면 상단의 검색창 확인**
   - 돋보기 아이콘 또는 "Search" 입력창

2. **"Database" 또는 프로젝트 이름 검색**
   - 검색 결과에서 프로젝트 선택

## 프로젝트 페이지로 이동했는지 확인

프로젝트 페이지로 이동하면 왼쪽 사이드바에 다음 메뉴들이 보여야 합니다:

✅ **프로젝트 페이지의 메뉴:**
- **Deployments**
  - Database ← 여기!
  - Serverless
- **Security**
  - Network Access
  - Database Access
- **Data Federation**
- **Alerts**
- **Performance Advisor**

❌ **Organization Settings 페이지의 메뉴 (현재 위치):**
- Identity & Access
- Billing
- (Database 메뉴 없음!)

## 프로젝트 페이지로 이동 후 할 일

1. **왼쪽 사이드바에서 "Deployments" 섹션 찾기**
2. **"Database" 메뉴 클릭**
3. **클러스터 목록에서 "Connect" 버튼 클릭**
4. **"Connect your application" 선택**
5. **연결 문자열 복사**

## 화면 구성 비교

### Organization Settings 페이지 (현재 위치)
```
┌─────────────────────────────────────────┐
│ MongoDB Atlas          [ORGANIZATION ▼] │
├─────────────────────────────────────────┤
│ Identity & Access                       │
│ └─ All Projects                         │
│ └─ Users                                │
│ └─ Applications                         │
│ Billing                                 │
│ └─ Overview                             │
│ └─ Invoices                            │
└─────────────────────────────────────────┘
```

### 프로젝트 페이지 (목표 위치)
```
┌─────────────────────────────────────────┐
│ MongoDB Atlas          [PROJECT ▼]      │
├─────────────────────────────────────────┤
│ Deployments                             │
│ └─ Database ← 여기!                     │
│ └─ Serverless                           │
│ Security                                │
│ └─ Network Access                       │
│ └─ Database Access                      │
└─────────────────────────────────────────┘
```

## 단계별 가이드

### Step 1: 상단 메뉴 확인
```
[ORGANIZATION ▼] [Projects ▼] [Help] [사용자]
```
↑ 여기서 "Projects" 클릭!

### Step 2: 프로젝트 선택
프로젝트 목록에서:
- 프로젝트 이름 클릭
- 또는 "All Projects"에서 프로젝트 선택

### Step 3: 프로젝트 페이지 확인
왼쪽 사이드바에 "Deployments" → "Database" 메뉴가 보이면 성공!

## 여전히 찾을 수 없나요?

### 대안 1: 직접 URL 접속
1. 브라우저 주소창 확인
2. URL이 `https://cloud.mongodb.com/org/...`로 시작하면 Organization 페이지
3. `https://cloud.mongodb.com/v2/...`로 시작하면 프로젝트 페이지

### 대안 2: 새 탭에서 접속
1. 새 탭 열기
2. https://cloud.mongodb.com 접속
3. 자동으로 프로젝트 페이지로 이동할 수 있습니다

### 대안 3: 클러스터가 없다면
1. 프로젝트 페이지로 이동
2. "Build a Database" 또는 "Create" 버튼 클릭
3. 클러스터 생성 후 Connect 버튼 클릭

