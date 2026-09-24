@echo off
setlocal EnableDelayedExpansion
title Pubblicazione su GitHub - Festa di Federica
cls
echo ============================================================
echo   PREPARAZIONE E PUBBLICAZIONE SU GITHUB
echo ============================================================
echo.

where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRORE] Git non e' stato trovato nel sistema.
    echo Assicurati di aver installato Git da: https://git-scm.com/
    pause
    exit /b 1
)

echo [1/3] Aggiunta modifiche al repository Git...
git add .

echo [2/3] Creazione commit...
git commit -m "Festa di Laurea di Federica - Server pronto per il cloud" >nul 2>&1

git branch -M main

echo.
echo ============================================================
echo   COLLEGA IL TUO REPOSITORY GITHUB
echo ============================================================
echo.
echo Se hai creato il repository su https://github.com/new:
echo Incolla qui sotto l'URL (es: https://github.com/tuo-utente/sito-fede.git)
echo e premi INVIO.
echo.
echo (Se premi INVIO senza scrivere nulla, il programma si chiude)
echo.
set "REPO_URL="
set /p "REPO_URL=Incolla URL GitHub: "

if "%REPO_URL%"=="" (
    echo.
    echo Nessun URL inserito. Operazione locale completata con successo!
    echo.
    pause
    exit /b 0
)

echo.
echo [3/3] Invio a GitHub in corso...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

git push -u origin main
if %ERRORLEVEL% EQU 0 goto :success

echo.
echo [INFO] Tentativo allineamento forzato con GitHub...
git push -u origin main --force
if %ERRORLEVEL% EQU 0 goto :success

echo.
echo ============================================================
echo [ATTENZIONE] Il push non e' andato a buon fine.
echo Possibili cause:
echo 1. L'URL di GitHub inserito non e' corretto.
echo 2. Non hai effettuato l'accesso a GitHub quando richiesto.
echo 3. Non hai i permessi di scrittura sul repository.
echo ============================================================
goto :end

:success
echo.
echo ============================================================
echo   SUCCESSO! Il codice e' stato caricato su GitHub!
echo ============================================================
echo Ora puoi andare su https://render.com:
echo 1. Clicca New + ^> Web Service
echo 2. Collega il tuo repository GitHub
echo 3. Clicca Create Web Service
echo ============================================================

:end
echo.
pause
