@echo off
title Avvio Servizi Digitali Desktop
echo =================================================================
echo   Avvio dell'Area Personale - Servizi Digitali Italiani
echo =================================================================
echo.

echo 1. Installazione dipendenze Companion Server (se necessario)...
cd auth-companion
call npm install
cd ..

echo.
echo 2. Avvio del Server di Autenticazione SPID/CIE (Porta 3000)...
start "SPID Auth Companion" /min cmd /c "cd auth-companion && npm start"

echo.
echo 3. Avvio del Server di Sviluppo Frontend (Vite)...
echo.
npm run dev
