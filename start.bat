@echo off
title Avvio Servizi Digitali Desktop
echo =================================================================
echo   Avvio dell'Area Personale - Servizi Digitali Italiani (Locale)
echo =================================================================
echo.

REM ---------------------------------------------------------------
REM  FRONTEND (Vite + React)
REM ---------------------------------------------------------------
if not exist node_modules (
    echo [Frontend] Installazione dipendenze npm...
    call npm install
    echo.
)

REM ---------------------------------------------------------------
REM  BACKEND (FastAPI + PostgreSQL)
REM ---------------------------------------------------------------
if exist backend (
    echo [Backend] Preparazione ambiente Python...

    if not exist backend\venv (
        echo [Backend] Creazione ambiente virtuale...
        python -m venv backend\venv
    )

    if not exist backend\venv\Lib\site-packages\fastapi (
        echo [Backend] Installazione dipendenze Python...
        call backend\venv\Scripts\pip.exe install -r backend\requirements.txt
        echo.
    )

    echo [Backend] Avvio server FastAPI su porta 8000...
    start "Backend FastAPI" cmd /k "cd backend && ..\backend\venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"
    echo.
)

REM ---------------------------------------------------------------
REM  AVVIO FRONTEND
REM ---------------------------------------------------------------
echo [Frontend] Avvio server di sviluppo Vite...
echo.
call npm run dev
