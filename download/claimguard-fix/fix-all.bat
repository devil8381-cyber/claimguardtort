@echo off
echo ============================================
echo   CLAIMGUARD TORT - ALL FIXES IN ONE
echo ============================================
echo.

set /p "FOLDER=Enter path to claimguardtort (e.g. C:\Users\Admin\Desktop\claimguardtort): "
echo.

:: Check folder exists
if not exist "%FOLDER%\src\lib" (
    echo ERROR: src\lib folder not found! Make sure path is correct.
    pause
    exit /b
)

:: Fix 1: Replace email.ts with Resend API version
if exist "%~dp0email.ts" (
    echo [1/2] Replacing email.ts with Resend API version...
    copy /Y "%~dp0email.ts" "%FOLDER%\src\lib\email.ts"
    if errorlevel 1 (
        echo ERROR: Failed to copy email.ts!
        pause
        exit /b
    )
    echo       Done!
) else (
    echo [SKIP] email.ts not found in script folder. Download email.ts first.
)

:: Fix 2: Replace admin claims route
if exist "%~dp0route.ts" (
    echo [2/2] Fixing admin claims route (duplicate email bug)...
    copy /Y "%~dp0route.ts" "%FOLDER%\src\app\api\admin\claims\route.ts"
    if errorlevel 1 (
        echo ERROR: Failed to copy route.ts!
        pause
        exit /b
    )
    echo       Done!
) else (
    echo [SKIP] route.ts not found in script folder. Download route.ts first.
)

echo.
echo Pushing to GitHub...
cd /d "%FOLDER%"
git add src\lib\email.ts src\app\api\admin\claims\route.ts
git commit -m "fix: Resend email API + admin claim duplicate email fix"
git push origin main

echo.
echo ============================================
echo   DONE!
echo.
echo   NOW ADD IN RAILWAY VARIABLES:
echo   RESEND_API_KEY = re_GABg4QhS_EXSnKK2cMZBodbEbKZQXW6cm
echo.
echo   Railway will auto-redeploy.
echo   Wait 2-3 min then test.
echo ============================================
pause
