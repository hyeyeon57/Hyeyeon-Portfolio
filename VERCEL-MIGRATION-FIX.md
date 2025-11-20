# Vercel 마이그레이션 문제 해결 가이드

## 문제 상황
- ❌ 마이그레이션 실패: MongoDB가 연결되지 않았습니다
- 프로젝트 목록이 보이지 않음

## 해결 방법

### 1. Vercel 환경 변수 확인

Vercel 대시보드에서 다음 환경 변수가 설정되어 있는지 확인하세요:

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택: `hyeyeon-portfolio-admin`

2. **Settings > Environment Variables** 메뉴로 이동

3. **필수 환경 변수 확인**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vibe-coding-portfolio?retryWrites=true&w=majority
   ADMIN_USERNAME=hing0915
   ADMIN_PASSWORD=dpffla525!
   SESSION_SECRET=vibe-coding-portfolio-secret-key-2025
   ```

### 2. MongoDB Atlas 연결 문자열 확인

**MongoDB Atlas 연결 문자열 형식:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

**중요 사항:**
- `<username>`: MongoDB Atlas 사용자명
- `<password>`: MongoDB Atlas 비밀번호 (특수문자는 URL 인코딩 필요)
- `<cluster>`: 클러스터 주소 (예: `cluster0.xxxxx`)
- `<database>`: 데이터베이스 이름 (예: `vibe-coding-portfolio`)

### 3. 강제 마이그레이션 실행

#### 방법 1: API 엔드포인트 사용 (권장)

1. **로그인 후 브라우저 콘솔에서 실행:**
   ```javascript
   fetch('https://hyeyeon-portfolio-admin.vercel.app/api/bo/migrate', {
     method: 'POST',
     credentials: 'include',
     headers: {
       'Content-Type': 'application/json'
     }
   })
   .then(res => res.json())
   .then(data => console.log(data));
   ```

2. **또는 curl 명령어 사용:**
   ```bash
   curl -X POST https://hyeyeon-portfolio-admin.vercel.app/api/bo/migrate \
     -H "Content-Type: application/json" \
     -b "connect.sid=YOUR_SESSION_ID"
   ```

#### 방법 2: 프로젝트 목록 페이지 접속

프로젝트 목록 페이지를 접속하면 자동으로 마이그레이션이 실행됩니다:
- https://hyeyeon-portfolio-admin.vercel.app/admin

### 4. 로그 확인

Vercel 대시보드에서 함수 로그를 확인하세요:
- **Deployments** > 최신 배포 > **Functions** 탭
- `/api/bo/projects` 함수 로그 확인

예상 로그:
```
✅ MongoDB 연결 성공: cluster0.xxxxx.mongodb.net
📦 프로젝트가 없어 자동 마이그레이션을 실행합니다...
📦 9개의 정적 프로젝트를 MongoDB로 마이그레이션합니다...
✨ 마이그레이션 완료! (추가: 9개, 업데이트: 0개, 실패: 0개)
```

### 5. 문제 해결 체크리스트

- [ ] Vercel 환경 변수에 `MONGODB_URI`가 설정되어 있는가?
- [ ] MongoDB Atlas 네트워크 액세스에 현재 IP가 허용되어 있는가? (또는 0.0.0.0/0으로 모든 IP 허용)
- [ ] MongoDB Atlas 데이터베이스 사용자가 생성되어 있는가?
- [ ] 연결 문자열에 데이터베이스 이름이 포함되어 있는가?
- [ ] 비밀번호에 특수문자가 있으면 URL 인코딩되었는가?

### 6. 빠른 테스트

브라우저 콘솔에서 MongoDB 연결 테스트:
```javascript
fetch('https://hyeyeon-portfolio-admin.vercel.app/api/bo/projects')
  .then(res => res.json())
  .then(data => {
    console.log('연결 상태:', data);
    if (data.success && data.data.length > 0) {
      console.log('✅ 프로젝트 로드 성공:', data.data.length, '개');
    } else {
      console.log('❌ 프로젝트 로드 실패:', data.error);
    }
  });
```

## 추가 도움말

문제가 계속되면:
1. Vercel 함수 로그 확인
2. MongoDB Atlas 연결 테스트
3. 환경 변수 재설정 후 재배포

