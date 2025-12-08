# Pretendard 폰트 설정 가이드

## 폰트 파일 다운로드 방법

Pretendard Variable 폰트 파일을 다운로드하여 프로젝트에 추가해야 합니다.

### 방법 1: GitHub에서 직접 다운로드 (권장)

1. Pretendard GitHub 저장소 방문:
   - https://github.com/orioncactus/pretendard/releases
   - 또는 https://github.com/orioncactus/pretendard

2. 최신 릴리즈에서 다운로드:
   - `PretendardVariable.woff2` 파일을 다운로드
   - 또는 전체 패키지 다운로드 후 `web/static/PretendardVariable.woff2` 파일 추출

3. 파일 위치:
   - 다운로드한 `PretendardVariable.woff2` 파일을 `src/app/fonts/` 폴더에 복사

### 방법 2: CDN에서 직접 다운로드

터미널에서 다음 명령어 실행:

```bash
# fonts 폴더로 이동
cd src/app/fonts

# Pretendard Variable 폰트 다운로드
curl -L -o PretendardVariable.woff2 "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/variable/woff2/PretendardVariable.woff2"
```

또는 브라우저에서 직접 다운로드:
- https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/variable/woff2/PretendardVariable.woff2

### 방법 3: npm 패키지 사용 (대안)

만약 폰트 파일을 직접 관리하고 싶지 않다면, npm 패키지를 사용할 수도 있습니다:

```bash
npm install pretendard
```

하지만 이 경우 코드를 수정해야 합니다.

## 확인 사항

다운로드 후 다음 경로에 파일이 있어야 합니다:
- `src/app/fonts/PretendardVariable.woff2`

## 장점

- ✅ 폰트가 항상 사용자에게 제공됨 (CDN 의존성 제거)
- ✅ 더 빠른 로딩 속도 (자체 서버에서 제공)
- ✅ 오프라인 환경에서도 작동
- ✅ Next.js가 자동으로 폰트 최적화

