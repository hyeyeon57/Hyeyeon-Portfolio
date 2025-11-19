@echo off
REM Chrome으로 localhost:3000 강제로 열기 (새 창)
set CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
if not exist "%CHROME_PATH%" (
    set CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
)
if exist "%CHROME_PATH%" (
    start "" "%CHROME_PATH%" --new-window http://localhost:3000
    echo Chrome으로 http://localhost:3000 을 열었습니다.
) else (
    echo Chrome을 찾을 수 없습니다.
    echo Chrome을 설치하거나 수동으로 http://localhost:3000 을 열어주세요.
    pause
)

