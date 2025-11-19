@echo off
title 포트 정리 및 서버 시작
cd /d "%~dp0"

echo ============================================
echo   포트 정리 및 서버 시작
echo ============================================
echo.

REM [1] 포트 3000 사용 중인 프로세스 종료
echo [1] 포트 3000 정리 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

REM [2] 포트 3005 사용 중인 프로세스 종료
echo [2] 포트 3005 정리 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3005') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

REM [3] 모든 Node 프로세스 종료
echo [3] Node 프로세스 정리 중...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM [4] .next 폴더 삭제
echo [4] 빌드 캐시 정리 중...
if exist .next rmdir /s /q .next >nul 2>&1

REM [5] 빈 디렉토리 정리
echo [5] 빈 디렉토리 정리 중...
if exist "src\data\portfolio\public\projects" (
    if exist "src\data\portfolio\public\projects\*" (
        echo 디렉토리에 파일이 있습니다.
    ) else (
        rmdir /s /q "src\data\portfolio\public\projects" >nul 2>&1
    )
)

REM [6] Chrome 경로 찾기
set CHROME_PATH=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
)

echo.
echo [6] 서버 시작 중...
echo 서버가 준비되면 Chrome이 자동으로 열립니다...
echo ============================================
echo.

REM 서버 시작 (새 창)
start "Next.js Server" cmd /k "npm run dev"

REM 서버가 시작될 때까지 대기
timeout /t 8 /nobreak >nul

REM Chrome으로 열기
if defined CHROME_PATH (
    start "" "%CHROME_PATH%" --new-window http://localhost:3000
    echo.
    echo ============================================
    echo Chrome 브라우저가 열렸습니다!
    echo 주소: http://localhost:3000
    echo ============================================
) else (
    echo.
    echo ============================================
    echo Chrome을 찾을 수 없습니다.
    echo 수동으로 http://localhost:3000 을 열어주세요.
    echo ============================================
)

echo.
echo 서버가 실행 중입니다.
echo 서버를 종료하려면 서버 창에서 Ctrl+C를 누르세요.
echo.
pause

