@echo off
title KHOI DONG TOAN BO HE THONG
cls
echo ======================================================
echo           HUONG DAN KHOI DONG HE THONG
echo ======================================================
echo  1. Hay chac chan da bam "START" MySQL trong XAMPP.
echo  2. He thong se tu dong mo 2 cua so moi cho BE va FE.
echo  3. Khong duoc tat cac cua so nay khi dang su dung.
echo ======================================================
echo.
pause

echo Dang mo Backend...
start "BACKEND_SERVER" cmd /k "cd java-web && mvnw.cmd spring-boot:run"

echo Dang mo Frontend...
start "FRONTEND_SERVER" cmd /k "npm run dev"

echo.
echo ------------------------------------------------------
echo DA GUI LENH KHOI DONG. 
echo Vui long cho khoang 30s-1p de he thong san sang.
echo Sau do truy cap: http://localhost:5173
echo ------------------------------------------------------
pause
