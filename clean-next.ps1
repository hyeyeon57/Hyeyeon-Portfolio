# .next 폴더 강제 삭제 스크립트 (Windows)

Write-Host "🧹 .next 폴더 정리 시작..." -ForegroundColor Yellow

# 1. 모든 Node 프로세스 종료
Write-Host "1. Node 프로세스 종료 중..." -ForegroundColor Cyan
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 3

# 2. .next 폴더 삭제 시도
Write-Host "2. .next 폴더 삭제 중..." -ForegroundColor Cyan
$nextPath = Join-Path $PSScriptRoot ".next"

if (Test-Path $nextPath) {
    try {
        # 재귀적으로 모든 파일 삭제
        Get-ChildItem -Path $nextPath -Recurse -Force -ErrorAction SilentlyContinue | 
            Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
        
        # 폴더 자체 삭제
        Remove-Item -Path $nextPath -Force -Recurse -ErrorAction SilentlyContinue
        
        Start-Sleep -Seconds 2
        
        # 다시 확인하고 삭제
        if (Test-Path $nextPath) {
            Write-Host "   ⚠️  일부 파일이 잠겨있을 수 있습니다. 다시 시도 중..." -ForegroundColor Yellow
            Get-ChildItem -Path $nextPath -Recurse -Force -ErrorAction SilentlyContinue | 
                Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
            Remove-Item -Path $nextPath -Force -Recurse -ErrorAction SilentlyContinue
        }
        
        Write-Host "   ✅ .next 폴더 삭제 완료" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  일부 파일 삭제 실패 (무시하고 계속)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ℹ️  .next 폴더가 없습니다" -ForegroundColor Gray
}

# 3. 캐시 폴더 삭제
Write-Host "3. 캐시 폴더 정리 중..." -ForegroundColor Cyan
$cachePath = Join-Path $PSScriptRoot "node_modules\.cache"
if (Test-Path $cachePath) {
    Remove-Item -Path $cachePath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   ✅ 캐시 폴더 삭제 완료" -ForegroundColor Green
}

Write-Host "`n✨ 정리 완료! 이제 서버를 시작할 수 있습니다." -ForegroundColor Green
Write-Host "`n다음 명령어를 실행하세요:" -ForegroundColor Cyan
Write-Host "   npm run dev:server  (터미널 1)" -ForegroundColor White
Write-Host "   npm run dev         (터미널 2)" -ForegroundColor White

