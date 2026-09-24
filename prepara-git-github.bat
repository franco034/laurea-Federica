@echo off
title Pubblicazione su GitHub - Festa di Federica
cls
echo ============================================================
echo   PREPARAZIONE E CARICAMENTO SU GITHUB
echo ============================================================
echo.

where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERRORE] Git non e' stato trovato nel sistema.
    echo Assicurati di aver installato Git da: https://git-scm.com/
    pause
    exit /b 1
)

echo [1/3] Preparazione file locali...
git add .
git commit -m "Festa di Laurea di Federica - Server pronto per il cloud" >nul 2>&1
git branch -M main
echo       File pronti e registrati con successo.
echo.

echo ============================================================
echo   COLLEGA IL TUO REPOSITORY GITHUB
echo ============================================================
echo.
echo 1. Apri il browser su: https://github.com/new
echo 2. Crea un nuovo repository (es. nome: festa-fede)
echo 3. Copia l'indirizzo HTTPS del repository
echo    (es. https://github.com/tuo-nome/festa-fede.git)
echo.
echo Incolla l'indirizzo qui sotto (tasto destro del mouse per incollare):
echo.

set "REPO_URL="
set /p "REPO_URL=> "

:: Verifica che sia stato inserito un URL valido
echo %REPO_URL% | findstr /i "http git" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVVISO] Nessun URL valido inserito.
    echo I file sono pronti in locale. Quando avrai il link di GitHub,
    echo potrai riavviare questo programma e incollarlo!
    echo.
    pause
    exit /b 0
)

echo.
echo [2/3] Collegamento al repository GitHub: %REPO_URL%
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%

echo.
echo [3/3] Caricamento file su GitHub in corso...
echo (Se e' la prima volta, potrebbe aprirsi il browser per confermare l'accesso)
echo.

git push -u origin main
if %ERRORLEVEL% EQU 0 goto :success

echo.
echo [INFO] Tentativo di allineamento forzato con il repository...
git push -u origin main --force
if %ERRORLEVEL% EQU 0 goto :success

echo.
echo ============================================================
echo [ERRORE] Il caricamento su GitHub non e' riuscito.
echo.
echo Possibili cause:
echo 1. L'indirizzo inserito non e' corretto (%REPO_URL%)
echo 2. Non hai completato l'accesso nel browser quando richiesto da GitHub
echo 3. Il repository non e' stato ancora creato su https://github.com/new
echo ============================================================
goto :end

:success
echo.
echo ============================================================
echo   COMPLIMENTI! I FILE SONO ORA SU GITHUB!
echo ============================================================
echo Ora puoi andare su https://render.com:
echo 1. Accedi (clicca 'Sign in with GitHub')
echo 2. Clicca su 'New +' in alto a destra e scegli 'Web Service'
echo 3. Seleziona il tuo repository e clicca 'Connect'
echo 4. Clicca 'Create Web Service'
echo.
echo In circa 60 secondi il tuo sito sara' ONLINE con HTTPS gratuito!
echo ============================================================

:end
echo.
pause
