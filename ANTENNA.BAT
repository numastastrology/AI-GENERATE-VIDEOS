@echo off
title ANTENNA - AI Video Generator
cd /d "%~dp0"
echo.
echo =======================================
echo   ANTENNA: AI VIDEO GENERATOR ENGINE
echo =======================================
echo.
echo Launching Landing Page at http://localhost:5566...
start "" http://localhost:5566
echo.
echo Starting Development Server...
npm run dev
pause
