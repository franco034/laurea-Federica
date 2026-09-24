@echo off
chcp 65001 > nul
cls
echo ============================================================
echo   🚀 PREPARAZIONE E PUBBLICAZIONE SU GITHUB / HOSTING CLOUD
echo ============================================================
echo.

:: Verifica presenza di git
where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERRORE] Git non e' installato o non e' nel PATH.
    echo Scaricalo gratuitamente da: https://git-scm.com/
    pause
    exit /b 1
)

echo [1/3] Aggiunta file al repository Git locale...
git add .

echo [2/3] Creazione commit...
git commit -m "Festa di Laurea di Federica - Server pronto per il cloud" >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo       Commit creato con successo!
) else (
    echo       Nessuna nuova modifica da registrare.
)

git branch -M main

echo.
echo ============================================================
echo   PASSO FINALE: COLLEGARE A GITHUB
echo ============================================================
echo.
echo Se hai gia' creato un repository su GitHub (es. https://github.com/tuo-nome/sito-fede):
echo Incolla qui sotto l'URL del tuo repository GitHub e premi INVIO.
echo (Oppure premi semplicemente INVIO per uscire e farlo manualmente)
echo.
set /p REPO_URL="URL Repository GitHub (es. https://github.com/...): "

if "%REPO_URL%"=="" (
    echo.
    echo Operazione locale completata!
    echo Per caricare manualmente su GitHub, esegui questi due comandi:
    echo   git remote add origin TUO_URL_GITHUB
    echo   git push -u origin main
    echo.
    pause
    exit /b 0
)

echo.
echo [3/3] Configurazione remote e invio a GitHub...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ============================================================
    echo   🎉 SUCCESSO! IL CODICE E' ORA SU GITHUB!
    echo ============================================================
    echo Ora puoi andare su https://render.com, collegare il repository
    echo e il tuo sito sara' online in meno di 60 secondi!
    echo Consulta la GUIDA_HOSTING_GRATUITO.md per tutti i dettagli.
    echo ============================================================
) else (
    echo.
    echo [ATTENZIONE] Il push non e' andato a buon fine.
    echo Verifica di avere i permessi di accesso su GitHub o esegui il login.
)

echo.
pause
