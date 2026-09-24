@echo off
title Metti il Sito Online su Internet (Accesso 4G / 5G)
color 0a

echo ======================================================================
echo    🌍 METTI IL SITO ONLINE SU INTERNET PER GLI INVITATI IN 4G / 5G
echo ======================================================================
echo.
echo   Questo strumento crea un link pubblico protetto HTTPS gratuito.
echo   In questo modo gli invitati potranno caricare le foto da qualsiasi
echo   cellulare con connessione dati mobile (senza usare il Wi-Fi del locale)!
echo.
echo   (Assicurati che il server sia avviato con avvia-sito.bat)
echo.
echo   Avvio del tunnel in corso...
echo ======================================================================
echo.

npx -y localtunnel --port 3000 --subdomain laurea-federica-foto

echo.
echo Se il sottodominio predefinito era occupato, avvio con link dinamico...
npx -y localtunnel --port 3000
pause
