@echo off
setlocal EnableDelayedExpansion
title FIX MySQL - Reset password va tao database

:: Kiem tra quyen Admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Chua co quyen Admin - dang xin quyen...
    set "VBS=%TEMP%\run_admin_%RANDOM%.vbs"
    (
        echo Set obj = CreateObject^("Shell.Application"^)
        echo obj.ShellExecute "cmd.exe", "/k ""%~f0""", "", "runas", 1
    ) > "!VBS!"
    wscript "!VBS!"
    del "!VBS!" >nul 2>&1
    exit /b
)

set MYSQL_DIR=C:\Program Files\MySQL\MySQL Server 8.0\bin
set MYSQLD=%MYSQL_DIR%\mysqld.exe
set MYSQL=%MYSQL_DIR%\mysql.exe
set NEW_ROOT_PASS=root1234
set APP_USER=app
set APP_PASS=12345
set DB_NAME=bindata

set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"
set "SQL_FILE=%SCRIPT_DIR%\java-web\database.sql"

cls
echo ======================================================
echo   FIX MySQL - Reset root password va tao database
echo ======================================================
echo.

:: Kiem tra mysql.exe ton tai
if not exist "%MYSQL%" (
    echo [LOI] Khong tim thay: %MYSQL%
    echo Kiem tra lai duong dan MySQL.
    pause
    exit /b 1
)

:: Kiem tra file database.sql
if not exist "%SQL_FILE%" (
    echo [LOI] Khong tim thay: %SQL_FILE%
    pause
    exit /b 1
)

echo [1/5] Dung MySQL80 service...
net stop MySQL80 >nul 2>&1
timeout /t 3 /nobreak >nul
echo     OK

:: Lay datadir tu my.ini
set "DATADIR="
for /f "tokens=2 delims==" %%a in ('findstr /i "datadir" "C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" 2^>nul') do (
    if "!DATADIR!"=="" set "DATADIR=%%a"
)
if "!DATADIR!"=="" set "DATADIR=C:\ProgramData\MySQL\MySQL Server 8.0\Data"

echo [2/5] Tao file SQL reset password...
set "INIT_SQL=%TEMP%\mysql_reset_%RANDOM%.sql"
(
    echo ALTER USER 'root'@'localhost' IDENTIFIED BY '%NEW_ROOT_PASS%';
    echo FLUSH PRIVILEGES;
) > "%INIT_SQL%"
echo     OK: %INIT_SQL%

echo [3/5] Khoi dong MySQL voi init-file de reset password...
start /b "" "%MYSQLD%" --defaults-file="C:\ProgramData\MySQL\MySQL Server 8.0\my.ini" --init-file="%INIT_SQL%"
echo     Cho MySQL khoi dong (10 giay)...
timeout /t 10 /nobreak >nul

:: Dung mysqld vua khoi dong
taskkill /f /im mysqld.exe >nul 2>&1
timeout /t 3 /nobreak >nul
del "%INIT_SQL%" >nul 2>&1
echo     OK - Da reset root password thanh: %NEW_ROOT_PASS%

echo [4/5] Khoi dong lai MySQL80 service...
net start MySQL80 >nul 2>&1
timeout /t 5 /nobreak >nul
echo     OK

echo [5/5] Tao user '%APP_USER%' va database '%DB_NAME%'...
set "SETUP_SQL=%TEMP%\mysql_setup_%RANDOM%.sql"
(
    echo CREATE DATABASE IF NOT EXISTS `%DB_NAME%` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    echo CREATE USER IF NOT EXISTS '%APP_USER%'@'localhost' IDENTIFIED BY '%APP_PASS%';
    echo CREATE USER IF NOT EXISTS '%APP_USER%'@'%%' IDENTIFIED BY '%APP_PASS%';
    echo GRANT ALL PRIVILEGES ON `%DB_NAME%`.* TO '%APP_USER%'@'localhost';
    echo GRANT ALL PRIVILEGES ON `%DB_NAME%`.* TO '%APP_USER%'@'%%';
    echo FLUSH PRIVILEGES;
) > "%SETUP_SQL%"

"%MYSQL%" -u root "-p%NEW_ROOT_PASS%" < "%SETUP_SQL%"
if %errorLevel% neq 0 (
    echo [LOI] Khong tao duoc user/database! Kiem tra password root.
    del "%SETUP_SQL%" >nul 2>&1
    pause
    exit /b 1
)
del "%SETUP_SQL%" >nul 2>&1
echo     OK - Da tao user va database

echo.
echo Import du lieu tu database.sql...
"%MYSQL%" -u root "-p%NEW_ROOT_PASS%" %DB_NAME% < "%SQL_FILE%"
if %errorLevel% equ 0 (
    echo     OK - Import database.sql thanh cong
) else (
    echo     [!!] Import co loi - co the database da co du lieu san
)

echo.
echo ======================================================
echo   HOAN TAT!
echo ======================================================
echo.
echo   MySQL root password : %NEW_ROOT_PASS%
echo   App user            : %APP_USER% / %APP_PASS%
echo   Database            : %DB_NAME%
echo.
echo   Bay gio co the chay: START_HE_THONG.bat
echo.
pause
