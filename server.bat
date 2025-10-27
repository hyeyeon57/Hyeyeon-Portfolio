@echo off
title Vibe Coding Portfolio Server
cd /d "%~dp0"

echo ============================================
echo   Vibe Coding Portfolio - 서버 시작
echo ============================================
echo.
echo [1] 포트 3000 확인 중...

netstat -ano | findstr :3000
if %errorlevel% equ 0 (
    echo [경고] 포트 3000이 이미 사용 중입니다.
    echo.
    choice /C YN /M "기존 프로세스를 종료하시겠습니까"
    if errorlevel 2 goto skip
    if errorlevel 1 goto kill
)

:kill
echo.
echo [2] 기존 프로세스 종료 중...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 1 >nul
echo 완료!
echo.

:skip
echo.
echo [3] 서버 시작 중...
echo 브라우저에서 http://localhost:3000 을 열어주세요
echo 서버를 종료하려면 Ctrl+C를 누르세요
echo ============================================
echo.

npm run dev

pause




