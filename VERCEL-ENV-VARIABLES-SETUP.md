# Vercel 환경 변수 설정 가이드

## 1. Vercel 대시보드 접속
- https://vercel.com/dashboard 접속
- 로그인 후 프로젝트 선택 (`hyeyeon-portfolio`)

## 2. Settings 메뉴로 이동
1. 프로젝트 페이지에서 **Settings** 탭 클릭 (상단 메뉴)
2. 왼쪽 사이드바에서 **Environment Variables** 클릭

## 3. Framework Preset 확인 (선택사항)
- Settings → **General** 탭
- **Framework Preset** 섹션 확인
- Next.js 프로젝트면 "Next.js"로 설정되어 있어야 함
- 자동 감지된 경우 변경 불필요

## 4. 환경 변수 추가

### 각 환경 변수를 하나씩 추가:

#### 4-1. MONGODB_URI 추가
1. **"Add New"** 또는 **"Add"** 버튼 클릭
2. **Key (또는 Name)** 입력란에: `MONGODB_URI`
3. **Value** 입력란에:
   ```
   mongodb+srv://janghyeyeon57_db_user:xQeEXQ6PYiHPnNKp@hyeyeon.tctdejk.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
   ```
4. **Environment** 체크박스 (Value 입력란 아래):
   - ✅ **Production** 체크
   - ✅ **Preview** 체크
   - ✅ **Development** 체크
5. **Save** 버튼 클릭

#### 4-2. SESSION_SECRET 추가
1. 다시 **"Add New"** 버튼 클릭
2. **Key**: `SESSION_SECRET`
3. **Value**: `vibe-coding-portfolio-secret-key-2025`
4. **Environment**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Save** 클릭

#### 4-3. ADMIN_USERNAME 추가
1. **"Add New"** 버튼 클릭
2. **Key**: `ADMIN_USERNAME`
3. **Value**: `hing0915`
4. **Environment**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Save** 클릭

#### 4-4. ADMIN_PASSWORD 추가
1. **"Add New"** 버튼 클릭
2. **Key**: `ADMIN_PASSWORD`
3. **Value**: `dpffla525`
4. **Environment**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. **Save** 클릭

## 5. Environment 체크박스 위치 확인

환경 변수를 추가할 때 화면 구성:

```
┌─────────────────────────────────────┐
│ Add Environment Variable            │
├─────────────────────────────────────┤
│ Key (Name)                          │
│ [MONGODB_URI              ]         │
│                                     │
│ Value                               │
│ [mongodb+srv://...        ]         │
│                                     │
│ Environment                         │
│ ☐ Production                        │
│ ☐ Preview                           │
│ ☐ Development                       │
│                                     │
│ [Cancel]  [Save]                    │
└─────────────────────────────────────┘
```

**Environment 체크박스는 Value 입력란 바로 아래에 있습니다!**

## 6. 설정 확인

모든 환경 변수 추가 후:
- Environment Variables 목록에 4개가 표시되어야 함:
  1. MONGODB_URI
  2. SESSION_SECRET
  3. ADMIN_USERNAME
  4. ADMIN_PASSWORD

- 각 변수 옆에 환경 표시:
  - Production, Preview, Development 모두 표시되어야 함

## 7. 재배포

환경 변수 저장 후:
1. **Deployments** 탭으로 이동
2. 최신 배포 항목의 **...** (점 3개) 메뉴 클릭
3. **Redeploy** 선택
4. **Use existing Build Cache** 체크 해제 (환경 변수 반영을 위해)
5. **Redeploy** 클릭

또는 자동으로 재배포가 시작될 수도 있습니다.

## 문제 해결

### Environment 체크박스가 보이지 않는 경우:
- 브라우저를 새로고침 (F5)
- 다른 브라우저에서 시도
- Vercel 대시보드가 최신 버전인지 확인

### Framework Preset이 잘못된 경우:
- Settings → General → Framework Preset
- "Next.js" 선택
- Save 클릭


