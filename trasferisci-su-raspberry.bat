@echo off
title Trasferimento Sito su Raspberry Pi
color 0b
echo ======================================================
echo    COPIA DEL SITO SUL TUO RASPBERRY PI VIA RETE
echo ======================================================
echo.
echo Assicurati che il Raspberry Pi sia acceso e connesso
echo alla stessa rete Wi-Fi di questo computer.
echo.

set /p RPI_IP="Inserisci l'indirizzo IP del Raspberry Pi (es. 192.168.1.50): "
set /p RPI_USER="Inserisci il nome utente del Raspberry Pi (premi INVIO per 'pi'): "

if "%RPI_USER%"=="" set RPI_USER=pi

echo.
echo ⏳ Trasferimento dei file in corso verso %RPI_USER%@%RPI_IP%:~/sito-fede ...
echo (Se richiesto, inserisci la password del Raspberry Pi)
echo.

ssh %RPI_USER%@%RPI_IP% "mkdir -p ~/sito-fede"
scp -r * %RPI_USER%@%RPI_IP%:~/sito-fede/

echo.
echo ======================================================
echo 🎉 FILE TRASFERITI CON SUCCESSO SUL RASPBERRY PI!
echo ======================================================
echo.
echo Adesso, per completare l'installazione automatica sul Raspberry:
echo 1. Collegati via SSH: ssh %RPI_USER%@%RPI_IP%
echo 2. Entra nella cartella: cd ~/sito-fede
echo 3. Avvia lo script di setup: sudo bash setup-raspberry.sh
echo.
pause
