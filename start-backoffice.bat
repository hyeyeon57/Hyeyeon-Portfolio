@echo off
title 백오피스 서버 시작
cd /d "%~dp0"

echo ============================================
echo   백오피스 서버 시작
echo ============================================
echo.

REM [1] 포트 3005 사용 중인 프로세스 종료
echo [1] 포트 3005 정리 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3005') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

REM [2] 서버 시작
echo [2] 백오피스 서버 시작 중...
echo 서버가 준비되면 Chrome이 자동으로 열립니다...
echo ============================================
echo.

REM 서버 시작 (새 창)
start "Backoffice Server" cmd /k "npm run dev:server"

REM 서버가 시작될 때까지 대기
timeout /t 5 /nobreak >nul

REM Chrome으로 열기
set CHROME_PATH=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
)

if defined CHROME_PATH (
    start "" "%CHROME_PATH%" --new-window http://localhost:3005/admin
    echo.
    echo ============================================
    echo Chrome 브라우저가 열렸습니다!
    echo 주소: http://localhost:3005/admin
    echo ============================================
) else (
    echo.
    echo ============================================
    echo Chrome을 찾을 수 없습니다.
    echo 수동으로 http://localhost:3005/admin 을 열어주세요.
    echo ============================================
)

echo.
echo 서버가 실행 중입니다.
echo 서버를 종료하려면 서버 창에서 Ctrl+C를 누르세요.
echo.
pause

