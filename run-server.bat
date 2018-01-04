@echo off
title Start server

call webtechvenv\Scripts\activate
start cmd /C call python manage.py runserver
start cmd /C call redis-server
