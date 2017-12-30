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
call python manage.py runserver
pause
exit

:error
echo NodeJS is not installed
echo Install nodeJS to complete the setup
pause
