# "No Git Repositories Found" 오류 해결 방법

## 문제
GitHub에서 Vercel App의 Repository access를 "All repositories"로 설정하고 저장했는데도 여전히 "No Git Repositories Found" 오류 발생

## 해결 방법

### 방법 1: GitHub에서 Vercel App 완전히 제거 후 재설치 (가장 확실한 방법)

1. **GitHub Installed Apps 페이지**
   ```
   https://github.com/settings/installations
   ```

2. **Vercel 찾기**

3. **Configure 클릭**

4. **Uninstall 클릭** (완전히 제거)
   - "Uninstall Vercel" 확인
   - 모든 권한 제거

5. **Vercel Dashboard에서 다시 Import 시도**
   - Vercel Dashboard 접속
   - "Add New..." → "Import Git Repository"
   - GitHub 선택
   - GitHub 권한 승인 페이지로 이동됨

6. **GitHub 권한 승인**
   - `hyeyeon57` 계정 선택
   - "All repositories" 선택
   - "Install" 또는 "Authorize" 클릭

7. **저장소 선택**
   - `Hyeyeon-Portfolio` 검색
   - `hyeyeon57/Hyeyeon-Portfolio` 선택
   - Import 클릭

### 방법 2: Vercel Dashboard에서 GitHub 연결 완전히 재설정

1. **Vercel Dashboard → Settings (우측 상단 프로필 아이콘)**

2. **Connections (또는 Integrations) 클릭**

3. **Git 섹션 확인**
   - GitHub 연결이 있는지 확인
   - 있다면 "Disconnect" 클릭
   - 없다면 "Add New" 또는 "Connect" 클릭

4. **GitHub 연결**
   - GitHub 선택
   - 올바른 계정(`hyeyeon57`)으로 로그인되어 있는지 확인
   - "All repositories" 권한 부여
   - "Authorize" 클릭

5. **프로젝트 Import 재시도**
   - "Add New..." → "Import Git Repository"
   - GitHub 선택
   - 저장소 검색 및 Import

### 방법 3: 브라우저 캐시 완전히 삭제

1. **브라우저 캐시 삭제**
   - Chrome: Settings → Privacy and security → Clear browsing data
   - 모든 시간 범위 선택
   - Cached images and files 체크
   - Clear data 클릭

2. **브라우저 완전히 종료 후 재시작**

3. **시크릿 모드에서 시도**
   - 새로운 시크릿 창 열기
   - Vercel Dashboard 접속
   - `hyeyeon57` 계정으로 로그인
   - GitHub 연결 및 Import 시도

### 방법 4: 저장소를 임시로 Public으로 변경

1. **GitHub 저장소 Settings**
   ```
   https://github.com/hyeyeon57/Hyeyeon-Portfolio/settings
   ```

2. **General → Danger Zone → Change visibility**

3. **"Make public" 선택** (임시)

4. **Vercel에서 Import 재시도**

5. **연결 성공 후 다시 Private으로 변경**

### 방법 5: 다른 GitHub 계정으로 로그인 확인

1. **GitHub에서 로그아웃**
   ```
   https://github.com/logout
   ```

2. **올바른 계정으로 로그인**
   - `hyeyeon57` 계정으로 로그인

3. **Vercel Dashboard에서 다시 시도**
   - "Import Git Repository"
   - GitHub 선택
   - 올바른 계정이 선택되어 있는지 확인

## 확인 체크리스트

- [ ] GitHub에서 Vercel App이 완전히 제거되었는지
- [ ] Vercel에서 GitHub 연결이 해제되었는지
- [ ] 브라우저 캐시가 삭제되었는지
- [ ] GitHub와 Vercel 모두 `hyeyeon57` 계정으로 로그인되어 있는지
- [ ] 저장소가 Public인지 (임시로)

## 현재 프로젝트 정보

- **Git 저장소**: `https://github.com/hyeyeon57/Hyeyeon-Portfolio.git`
- **브랜치**: `main`
- **최신 커밋**: `212c9d1`

## 참고

가장 확실한 방법은 **방법 1 (완전히 제거 후 재설치)**입니다. 이 방법을 권장합니다.

