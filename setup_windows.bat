@echo off
setlocal EnableDelayedExpansion

:: ============================================================
::  DACNTT Project - Setup Script cho Windows 10/11
::  Double-click de chay, tu dong xin quyen Admin
:: ============================================================

:: ── Buoc 0: Tu dong xin Admin qua VBScript (on dinh nhat) ───
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Chua co quyen Admin - dang hien cua so UAC...
    echo Vui long bam [Yes] de tiep tuc.
    timeout /t 2 /nobreak >nul

    :: Tao file VBS de goi UAC
    set "VBS=%TEMP%\run_admin_%RANDOM%.vbs"
    (
        echo Set obj = CreateObject^("Shell.Application"^)
        echo obj.ShellExecute "cmd.exe", "/k ""%~f0""", "", "runas", 1
    ) > "!VBS!"
    wscript "!VBS!"
    del "!VBS!" >nul 2>&1
    exit /b
)

:: ── Config ───────────────────────────────────────────────────
set MYSQL_ROOT_PASS=root1234
set MYSQL_USER=app
set MYSQL_PASS=12345
set MYSQL_DB=bindata

:: Lay thu muc chua bat file
set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

set "JAVA_WEB_DIR=%PROJECT_DIR%\java-web"
set "DATABASE_SQL=%JAVA_WEB_DIR%\database.sql"
set "LOG_FILE=%PROJECT_DIR%\setup_log.txt"

echo [%date% %time%] Bat dau setup > "%LOG_FILE%"
echo PROJECT_DIR = %PROJECT_DIR% >> "%LOG_FILE%"

:: ── Banner ───────────────────────────────────────────────────
cls
echo.
echo  +==================================================+
echo  ^|    DACNTT Project - Windows Setup Script         ^|
echo  ^|   Java 21 + Maven + Node.js + MySQL 8.0          ^|
echo  +==================================================+
echo.
echo   Thu muc : %PROJECT_DIR%
echo   Log     : %LOG_FILE%
echo.
echo   Nhan phim bat ky de bat dau...
pause >nul

:: ════════════════════════════════════════════════════════════
::  BUOC 1: Cai Chocolatey
:: ════════════════════════════════════════════════════════════
echo.
echo  [1/5] Cai dat Chocolatey...
echo  --------------------------------------------------
echo [%time%] Buoc 1: Chocolatey >> "%LOG_FILE%"

where choco >nul 2>&1
if %errorLevel% equ 0 (
    echo   [--] Chocolatey da co san.
) else (
    echo   Dang tai Chocolatey...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
        "try { [Net.ServicePointManager]::SecurityProtocol='Tls12'; iex ((New-Object Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')); exit 0 } catch { Write-Host $_.Exception.Message; exit 1 }"

    call :refresh_path

    where choco >nul 2>&1
    if !errorLevel! neq 0 (
        echo   [LOI] Khong cai duoc Chocolatey!
        echo   Xem chi tiet: %LOG_FILE%
        goto :error
    )
    echo   [OK] Chocolatey da cai xong.
)
echo [%time%] Chocolatey OK >> "%LOG_FILE%"

:: ════════════════════════════════════════════════════════════
::  BUOC 2: Cai JDK 21
:: ════════════════════════════════════════════════════════════
echo.
echo  [2/5] Cai dat JDK 21...
echo  --------------------------------------------------
echo [%time%] Buoc 2: JDK 21 >> "%LOG_FILE%"

set JAVA_OK=0
where java >nul 2>&1
if %errorLevel% equ 0 (
    set "JAVA_VER_RAW="
    for /f "tokens=3" %%v in ('java -version 2^>^&1') do (
        if "!JAVA_VER_RAW!"=="" set "JAVA_VER_RAW=%%v"
    )
    set "JAVA_VER_RAW=!JAVA_VER_RAW:"=!"
    if "!JAVA_VER_RAW:~0,2!"=="21" (
        echo   [--] Java 21 da co san ^(!JAVA_VER_RAW!^).
        set JAVA_OK=1
    ) else (
        echo   Java hien tai: !JAVA_VER_RAW! - khong phai v21, se cai them.
    )
)

if !JAVA_OK! equ 0 (
    echo   Dang cai JDK 21 ^(vai phut^)...
    choco install temurin21 -y
    call :refresh_path
    call :set_java_home
    where java >nul 2>&1
    if !errorLevel! neq 0 (
        echo   [LOI] Java chua cai duoc! Xem: %LOG_FILE%
        goto :error
    )
    echo   [OK] Java 21 da cai xong.
)
echo [%time%] Java OK >> "%LOG_FILE%"

:: ════════════════════════════════════════════════════════════
::  BUOC 3: Cai Maven
:: ════════════════════════════════════════════════════════════
echo.
echo  [3/5] Cai dat Apache Maven...
echo  --------------------------------------------------
echo [%time%] Buoc 3: Maven >> "%LOG_FILE%"

where mvn >nul 2>&1
if %errorLevel% equ 0 (
    echo   [--] Maven da co san.
) else (
    echo   Dang cai Maven...
    choco install maven -y
    call :refresh_path

    where mvn >nul 2>&1
    if !errorLevel! neq 0 (
        echo   [LOI] Maven chua cai duoc! Xem: %LOG_FILE%
        goto :error
    )
    echo   [OK] Maven da cai xong.
)
echo [%time%] Maven OK >> "%LOG_FILE%"

:: ════════════════════════════════════════════════════════════
::  BUOC 4: Cai Node.js LTS
:: ════════════════════════════════════════════════════════════
echo.
echo  [4/5] Cai dat Node.js LTS...
echo  --------------------------------------------------
echo [%time%] Buoc 4: Node.js >> "%LOG_FILE%"

where node >nul 2>&1
if %errorLevel% equ 0 (
    echo   [--] Node.js da co san.
) else (
    echo   Dang cai Node.js LTS...
    choco install nodejs-lts -y
    call :refresh_path

    where node >nul 2>&1
    if !errorLevel! neq 0 (
        echo   [LOI] Node.js chua cai duoc! Xem: %LOG_FILE%
        goto :error
    )
    echo   [OK] Node.js da cai xong.
)
echo [%time%] Node.js OK >> "%LOG_FILE%"

:: ════════════════════════════════════════════════════════════
::  BUOC 5: Cai MySQL 8.0
:: ════════════════════════════════════════════════════════════
echo.
echo  [5/5] Cai dat MySQL 8.0 va tao database...
echo  --------------------------------------------------
echo [%time%] Buoc 5: MySQL >> "%LOG_FILE%"

set "MYSQL_EXE="
if exist "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" set "MYSQL_EXE=C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" set "MYSQL_EXE=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if exist "C:\tools\mysql\current\bin\mysql.exe"                  set "MYSQL_EXE=C:\tools\mysql\current\bin\mysql.exe"
if "!MYSQL_EXE!" equ "" (
    where mysql >nul 2>&1
    if !errorLevel! equ 0 for /f "usebackq delims=" %%p in (`where mysql`) do set "MYSQL_EXE=%%p"
)

if "!MYSQL_EXE!" equ "" (
    echo   Dang cai MySQL 8.0 ^(5-10 phut^)...
    choco install mysql --params "/password:%MYSQL_ROOT_PASS%" -y
    call :refresh_path
    timeout /t 5 /nobreak >nul

    if exist "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" set "MYSQL_EXE=C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
    if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" set "MYSQL_EXE=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    if exist "C:\tools\mysql\current\bin\mysql.exe"                  set "MYSQL_EXE=C:\tools\mysql\current\bin\mysql.exe"
    if "!MYSQL_EXE!" equ "" (
        where mysql >nul 2>&1
        if !errorLevel! equ 0 for /f "usebackq delims=" %%p in (`where mysql`) do set "MYSQL_EXE=%%p"
    )

    if "!MYSQL_EXE!" equ "" (
        echo   [LOI] Khong tim thay mysql.exe! Xem: %LOG_FILE%
        goto :error
    )
    echo   [OK] MySQL da cai tai: !MYSQL_EXE!
) else (
    echo   [--] MySQL da co san: !MYSQL_EXE!
)

:: Bat service
echo   Khoi dong MySQL service...
net start MySQL80 >nul 2>&1
net start MySQL   >nul 2>&1
timeout /t 3 /nobreak >nul

:: Them vao PATH phien nay
for %%f in ("!MYSQL_EXE!") do set "PATH=%%~dpf;!PATH!"

:: Kiem tra file SQL
if not exist "%DATABASE_SQL%" (
    echo   [LOI] Khong tim thay: %DATABASE_SQL%
    goto :error
)

:: Tao file SQL tam
set "INIT_SQL=%TEMP%\dacntt_%RANDOM%.sql"
(
    echo CREATE USER IF NOT EXISTS '%MYSQL_USER%'@'localhost' IDENTIFIED BY '%MYSQL_PASS%';
    echo CREATE USER IF NOT EXISTS '%MYSQL_USER%'@'%%' IDENTIFIED BY '%MYSQL_PASS%';
    echo GRANT ALL PRIVILEGES ON %MYSQL_DB%.* TO '%MYSQL_USER%'@'localhost';
    echo GRANT ALL PRIVILEGES ON %MYSQL_DB%.* TO '%MYSQL_USER%'@'%%';
    echo FLUSH PRIVILEGES;
) > "%INIT_SQL%"

"!MYSQL_EXE!" -u root -p%MYSQL_ROOT_PASS% --connect-expired-password < "%INIT_SQL%" >> "%LOG_FILE%" 2>&1
"!MYSQL_EXE!" -u root -p%MYSQL_ROOT_PASS% --connect-expired-password < "%DATABASE_SQL%" >> "%LOG_FILE%" 2>&1
del "%INIT_SQL%" >nul 2>&1

echo   [OK] Database '%MYSQL_DB%' va user '%MYSQL_USER%' da tao xong.
echo [%time%] MySQL OK >> "%LOG_FILE%"

:: ════════════════════════════════════════════════════════════
::  Cai npm
:: ════════════════════════════════════════════════════════════
echo.
echo  [+] npm install cho Frontend...
echo  --------------------------------------------------
cd /d "%PROJECT_DIR%"
call npm install
if %errorLevel% equ 0 (
    echo   [OK] npm install thanh cong.
) else (
    echo   [!!] npm install gap loi - xem %LOG_FILE%
    echo        Co the chay lai sau: npm install
)

:: ════════════════════════════════════════════════════════════
::  HOAN TAT
:: ════════════════════════════════════════════════════════════
echo [%time%] Setup hoan tat >> "%LOG_FILE%"

echo.
echo  +==================================================+
echo  ^|         SETUP HOAN TAT THANH CONG!               ^|
echo  +==================================================+
echo.
echo   Cach chay project:
echo     Double-click: Chay_Backend.bat    ^(Backend^)
echo     Double-click: Chay_Frontend.bat   ^(Frontend^)
echo     Double-click: START_HE_THONG.bat  ^(Ca 2^)
echo.
echo   URLs sau khi chay:
echo     Frontend  -^>  http://localhost:5173
echo     Backend   -^>  http://localhost:8081
echo     Swagger   -^>  http://localhost:8081/swagger-ui/index.html
echo.
echo   MySQL:
echo     Database  : %MYSQL_DB%
echo     User      : %MYSQL_USER% / %MYSQL_PASS%
echo     Root      : root / %MYSQL_ROOT_PASS%
echo.
echo   File log: %LOG_FILE%
echo.
echo  Nhan phim bat ky de dong...
pause >nul
exit /b 0

:error
echo.
echo  +==================================================+
echo  ^|            SETUP GAP LOI !                        ^|
echo  ^|   Xem chi tiet loi tai:                           ^|
echo  ^|   %LOG_FILE%
echo  +==================================================+
echo.
echo  Nhan phim bat ky de dong...
pause >nul
exit /b 1

:: ── Ham refresh PATH ─────────────────────────────────────────
:refresh_path
for /f "skip=2 tokens=2*" %%a in (
    'reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul'
) do if not "%%b"=="" set "PATH=%%b"
for /f "skip=2 tokens=2*" %%a in (
    'reg query "HKCU\Environment" /v Path 2^>nul'
) do if not "%%b"=="" set "PATH=%PATH%;%%b"
goto :eof

:: ── Ham tim va set JAVA_HOME sau khi cai ─────────────────────
:set_java_home
set "JAVA_HOME="
for /d %%d in ("C:\Program Files\Eclipse Adoptium\jdk-21*") do (
    if exist "%%~d\bin\java.exe" set "JAVA_HOME=%%~d"
)
if "!JAVA_HOME!"=="" (
    for /d %%d in ("C:\Program Files\Microsoft\jdk-21*") do (
        if exist "%%~d\bin\java.exe" set "JAVA_HOME=%%~d"
    )
)
if "!JAVA_HOME!"=="" (
    for /d %%d in ("C:\Program Files\Java\jdk-21*") do (
        if exist "%%~d\bin\java.exe" set "JAVA_HOME=%%~d"
    )
)
if not "!JAVA_HOME!"=="" (
    setx JAVA_HOME "!JAVA_HOME!" /M >nul 2>&1
    set "PATH=!JAVA_HOME!\bin;!PATH!"
    echo   [OK] JAVA_HOME = !JAVA_HOME!
)
goto :eof
