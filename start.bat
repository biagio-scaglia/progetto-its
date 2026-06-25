@echo off
title Avvio Servizi Digitali Desktop
echo =================================================================
echo   Avvio dell'Area Personale - Servizi Digitali Italiani (Locale)
echo =================================================================
echo.

if not exist node_modules (
    echo Installazione delle dipendenze in corso...
    call npm install
    echo.
)

echo Avvio del Server di Sviluppo Frontend (Vite)...
echo.
call npm run dev
