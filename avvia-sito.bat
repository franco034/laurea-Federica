@echo off
title Festa di Laurea di Federica - Server Web Nativo
color 0b

echo ======================================================================
echo    🎓 FESTA DI LAUREA DI FEDERICA - VERO SERVER WEB NATIVO (PORTA 80)
echo ======================================================================
echo.
echo   Il server web nativo e in esecuzione su questo computer!
echo.
echo   💻 Accesso su questo computer:
echo      👉 http://localhost
echo.
echo   📱 Accesso per gli invitati in Wi-Fi (Rete locale):
echo      👉 http://192.168.1.13
echo.
echo   🌍 Accesso da Internet (4G/5G tramite Router Port Forwarding):
echo      👉 http://82.90.76.117
echo.
echo   ⚠️ IMPORTANTE: Se non l'hai ancora fatto, esegui una volta il file
echo      "apri-firewall-windows.bat" per aprire la porta 80 nel Firewall!
echo.
echo ======================================================================
echo   Apertura automatica del browser in corso...
echo ======================================================================
echo.

timeout /t 2 /nobreak >nul
start http://localhost

node server.js
pause
