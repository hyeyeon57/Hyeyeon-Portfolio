@echo off
title Vibe Coding Portfolio - Chrome으로 시작
cd /d "%~dp0"

echo ============================================
echo   포트폴리오 서버 시작 (Chrome)
echo ============================================
echo.

REM 기존 Node 프로세스 종료
echo [1] 기존 프로세스 정리 중...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul

REM .next 폴더 삭제
echo [2] 빌드 캐시 정리 중...
if exist .next rmdir /s /q .next >nul 2>&1

REM Chrome 경로 찾기
set CHROME_PATH=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
)

if not defined CHROME_PATH (
    echo [경고] Chrome을 찾을 수 없습니다.
    echo 기본 브라우저로 열립니다.
    echo.
)

echo [3] 서버 시작 중...
echo 서버가 준비되면 Chrome이 자동으로 열립니다...
echo 서버를 종료하려면 Ctrl+C를 누르세요
echo ============================================
echo.

REM 서버 시작 (백그라운드)
start /B npm run dev

REM 서버가 시작될 때까지 대기
timeout /t 6 /nobreak >nul

REM Chrome으로 강제로 열기 (새 창)
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
echo 서버가 실행 중입니다. 이 창을 닫지 마세요.
echo.

REM 서버 프로세스가 종료될 때까지 대기
:wait
timeout /t 1 /nobreak >nul
tasklist | find /i "node.exe" >nul
if %errorlevel% equ 0 goto wait

pause

