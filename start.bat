@echo off
title Avvio SDIT Desktop
echo =================================================================
echo   Avvio di SDIT - Servizi Digitali Italiani (Locale)
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
REM  DIAGNOSTICA OLLAMA
REM ---------------------------------------------------------------
echo [Ollama] Verifica dei prerequisiti per il motore AI locale...
echo.

where ollama >nul 2>&1
if %errorlevel% neq 0 (
    echo [Ollama] ATTENZIONE: Il comando 'ollama' non e stato trovato nel sistema.
    echo          Assicurati che Ollama sia installato (https://ollama.com) ed inserito nel PATH.
    echo          Il sistema locale di risposte ed embeddings RAG sara disabilitato.
    echo.
    echo          Premere un tasto per continuare comunque l'avvio...
    pause >nul
    goto start_frontend
)

echo [Ollama] Connessione al server Ollama...
curl -s -f http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo [Ollama] Il server Ollama non e attivo. Tentativo di avvio automatico...
    start "Ollama Server" /min ollama serve
    echo [Ollama] In attesa del caricamento (5 secondi)...
    timeout /t 5 >nul
    
    curl -s -f http://localhost:11434/api/tags >nul 2>&1
    if %errorlevel% neq 0 (
        echo [Ollama] ATTENZIONE: Impossibile contattare Ollama su http://localhost:11434.
        echo          Verifica che il software Ollama sia avviato.
        echo.
        echo          Premere un tasto per continuare comunque l'avvio...
        pause >nul
        goto start_frontend
    )
)
echo [Ollama] Server attivo e raggiungibile.
echo.

echo [Ollama] Verifica modelli caricati...
echo.

REM 1. Verifica modello di embedding (bge-m3)
ollama list | findstr /i "bge-m3" >nul
if %errorlevel% neq 0 (
    echo [Ollama] Modello di embedding 'bge-m3' non trovato.
    echo          Download in corso (potrebbe richiedere qualche minuto)...
    ollama pull bge-m3
) else (
    echo [Ollama] Modello di embedding 'bge-m3' OK.
)

REM 2. Verifica modello LLM (qwen2-7b o qwen2)
ollama list | findstr /i "qwen2" >nul
if %errorlevel% neq 0 (
    echo [Ollama] Modello LLM 'qwen2-7b' non trovato.
    echo          Download in corso (potrebbe richiedere qualche minuto)...
    ollama pull qwen2-7b
) else (
    echo [Ollama] Modello generativo 'qwen2' OK.
)

echo.
echo [Ollama] Diagnostica completata con successo!
echo.

:start_frontend
REM ---------------------------------------------------------------
REM  AVVIO FRONTEND
REM ---------------------------------------------------------------
echo [Frontend] Avvio server di sviluppo Vite...
echo.
call npm run dev
