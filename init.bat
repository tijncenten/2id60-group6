@echo off
title Initialization of the project
where node.exe >nul 2>&1 && echo NodeJS installed || goto :error
cd nodeJS
cd
call npm install
call npm run devBuild
cd ..
call python -m venv webtechvenv
call webtechvenv\Scripts\activate
cd
call pip install --upgrade pip
call pip install -r requirements.txt

mkdir temp-redis
cd temp-redis
if not exist redis.msi (
  powershell -Command "Invoke-WebRequest https://github.com/MicrosoftArchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.msi -OutFile redis.msi"
)

msiexec /i redis.msi
cd ..
RMDIR /S /Q temp-redis

call start run-server.bat
exit

:error
echo NodeJS is not installed
echo Install nodeJS to complete the setup
pause
