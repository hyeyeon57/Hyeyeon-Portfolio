# Chrome으로 열기 설정 가이드

## 문제: Edge로 열리는 경우

Windows의 기본 브라우저가 Edge로 설정되어 있어서 URL을 클릭하면 Edge로 열릴 수 있습니다.

## 해결 방법

### 방법 1: 배치 파일 사용 (가장 확실함)

1. **`start-dev.bat` 파일 더블클릭**
   - 서버 시작 후 Chrome으로 자동으로 열립니다

2. **`open-chrome.bat` 파일 더블클릭**
   - 서버가 이미 실행 중일 때 Chrome으로 열기

3. **`server.bat` 파일 더블클릭**
   - 서버 시작 후 Chrome으로 자동으로 열립니다

### 방법 2: Chrome을 기본 브라우저로 설정

1. Windows 설정 열기 (`Win + I`)
2. "앱" → "기본 앱" 선택
3. "웹 브라우저"에서 "Google Chrome" 선택

### 방법 3: 수동으로 Chrome 열기

1. Chrome 브라우저 열기
2. 주소창에 `http://localhost:3000` 입력
3. Enter 키 누르기

## 배치 파일 설명

- **`start-dev.bat`**: 서버 시작 + Chrome으로 자동 열기 (추천)
- **`server.bat`**: 서버 시작 + Chrome으로 자동 열기
- **`open-chrome.bat`**: Chrome으로만 열기 (서버가 이미 실행 중일 때)

## 참고

- 모든 배치 파일은 Chrome 경로를 자동으로 찾습니다
- Chrome이 설치되어 있지 않으면 기본 브라우저로 열립니다
- `--new-window` 플래그를 사용하여 새 창에서 열리도록 설정했습니다

