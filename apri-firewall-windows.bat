@echo off
title Configurazione Firewall Windows - Porte Web 80 e 3000
color 0b

:: Verifica permessi di Amministratore
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ==============================================================
    echo  Richiesta autorizzazione di Amministratore per il Firewall...
    echo ==============================================================
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ==============================================================
echo    CONFIGURAZIONE FIREWALL WINDOWS PER IL SERVER WEB NATIVO
echo ==============================================================
echo.
echo Apertura delle porte 80 (HTTP standard) e 3000 in corso...
echo.

netsh advfirewall firewall delete rule name="SitoFestaLaureaPort80" >nul 2>&1
netsh advfirewall firewall add rule name="SitoFestaLaureaPort80" dir=in action=allow protocol=TCP localport=80,3000 profile=any

echo.
echo ==============================================================
echo 🎉 REGOLE FIREWALL CREATE CON SUCCESSO!
echo ==============================================================
echo.
echo Le porte 80 e 3000 sono ora aperte nel Firewall di Windows.
echo Qualsiasi smartphone connesso alla rete potra accedere direttamente.
echo.
pause
