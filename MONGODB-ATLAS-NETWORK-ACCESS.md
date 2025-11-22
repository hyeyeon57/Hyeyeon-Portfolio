# MongoDB Atlas Network Access 설정 가이드

## 문제
Vercel에서 MongoDB Atlas에 연결하려면 MongoDB Atlas의 Network Access에 Vercel 서버 IP를 허용해야 합니다.

## 해결 방법: 모든 IP 허용 (개발용)

### 단계별 설정

#### 1. MongoDB Atlas 대시보드 접속
- https://cloud.mongodb.com 접속
- 로그인

#### 2. Network Access 메뉴로 이동
- 왼쪽 사이드바에서 **"Network Access"** 클릭
- 또는 상단 메뉴에서 **"Security"** → **"Network Access"** 클릭

#### 3. IP 주소 추가
- **"Add IP Address"** 버튼 클릭 (우측 상단)

#### 4. 모든 IP 허용 설정
방법 1 (권장):
- **"Allow Access from Anywhere"** 버튼 클릭
- 자동으로 `0.0.0.0/0`이 입력됩니다
- Comment (선택사항): "Allow all IPs for Vercel deployment" 입력

방법 2 (수동 입력):
- **"IP Access List"** 입력란에: `0.0.0.0/0` 입력
- Comment (선택사항): "Allow all IPs" 입력

#### 5. 확인
- **"Confirm"** 버튼 클릭

#### 6. 적용 확인
- Network Access 목록에 `0.0.0.0/0`이 표시되는지 확인
- Status가 **"Active"**인지 확인 (몇 초 소요될 수 있음)

## 화면 구성

```
┌─────────────────────────────────────┐
│ Network Access                      │
├─────────────────────────────────────┤
│ [Add IP Address]                    │
│                                     │
│ IP Access List:                     │
│ ┌─────────────────────────────────┐ │
│ │ 0.0.0.0/0          [Active]    │ │
│ │ Comment: Allow all IPs         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 주의사항

### 보안 고려사항
- `0.0.0.0/0`은 **모든 IP 주소를 허용**합니다
- 개발/테스트 환경에서는 괜찮지만, 프로덕션에서는 특정 IP만 허용하는 것을 권장합니다

### 프로덕션 환경 권장 설정
프로덕션에서는:
1. Vercel의 고정 IP 주소 확인 (Vercel 지원팀에 문의)
2. 또는 특정 IP 범위만 허용
3. 또는 MongoDB Atlas의 IP Whitelist 기능 사용

## 문제 해결

### "Allow Access from Anywhere" 버튼이 없는 경우
- 수동으로 `0.0.0.0/0` 입력
- 또는 "Add Current IP Address" 클릭 후 수정

### 변경사항이 적용되지 않는 경우
- 몇 분 정도 기다려보세요 (최대 5분)
- MongoDB Atlas 페이지를 새로고침
- Vercel에서 재배포

### 여전히 연결 실패하는 경우
1. Network Access 목록에 `0.0.0.0/0`이 있는지 확인
2. Status가 "Active"인지 확인
3. MongoDB Atlas → Database Access에서 사용자 권한 확인
4. 연결 문자열의 사용자명/비밀번호 확인

## 확인 방법

설정 완료 후:
1. Vercel에서 재배포
2. Vercel 로그에서 MongoDB 연결 성공 메시지 확인
3. https://hyeyeon-portfolio-admin.vercel.app/admin 접속 테스트

성공하면 MongoDB 연결이 정상적으로 작동합니다! 🎉


