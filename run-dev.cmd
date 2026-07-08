@echo off
REM Dev launcher: puts Node.js on PATH, then starts the Angular dev server.
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0helpdesk-front"
call npm start -- --port 4200 --host 127.0.0.1
