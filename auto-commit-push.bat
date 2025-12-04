@echo off
chcp 65001 >nul
echo ========================================
echo 자동 Git 커밋 및 푸시 스크립트
echo ========================================
echo.

REM Hyeyeon-Portfolio 폴더로 이동
cd /d "%~dp0"

REM 현재 상태 확인
echo [1/4] Git 상태 확인 중...
git status
echo.

REM 변경사항이 있는지 확인
git diff --quiet && git diff --cached --quiet
if %errorlevel% == 0 (
    echo 변경사항이 없습니다. 모든 것이 최신 상태입니다.
    pause
    exit /b 0
)

echo [2/4] 모든 변경사항 스테이징 중...
git add .
echo.

echo [3/4] 커밋 중...
REM 커밋 메시지 입력 받기
set /p commit_msg="커밋 메시지를 입력하세요 (기본값: auto commit): "
if "%commit_msg%"=="" set commit_msg=auto commit
git commit -m "%commit_msg%"
echo.

echo [4/4] 원격 저장소에 푸시 중...
git push origin main
echo.

if %errorlevel% == 0 (
    echo ========================================
    echo 성공! 커밋 및 푸시가 완료되었습니다.
    echo ========================================
) else (
    echo ========================================
    echo 오류 발생! 푸시에 실패했습니다.
    echo ========================================
)

pause

