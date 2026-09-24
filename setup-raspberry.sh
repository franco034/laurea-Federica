#!/bin/bash
# ==============================================================================
# SCRIPT DI INSTALLAZIONE AUTOMATICA PER RASPBERRY PI
# Festa di Laurea - Server Web & Sincronizzazione Google Drive
# ==============================================================================

set -e

echo ""
echo "=========================================================="
echo "🎓 INSTALLAZIONE FESTA DI LAUREA SU RASPBERRY PI"
echo "=========================================================="
echo ""

# 1. Verifica permessi di root/sudo
if [ "$EUID" -ne 0 ]; then
  echo "Per favore esegui lo script con sudo:"
  echo "sudo bash setup-raspberry.sh"
  exit 1
fi

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CURRENT_USER="${SUDO_USER:-$USER}"

echo "📂 Cartella applicazione: $APP_DIR"
echo "👤 Utente di esecuzione: $CURRENT_USER"
echo ""

# 2. Aggiornamento pacchetti base
echo "📦 Aggiornamento repository..."
apt-get update -y

# 3. Controllo ed installazione di Node.js (v20 o v22 LTS)
if ! command -v node > /dev/null 2>&1; then
  echo "⬇️ Installazione di Node.js LTS in corso..."
  apt-get install -y curl ca-certificates
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  NODE_VER=$(node -v)
  echo " Node.js già installato ($NODE_VER)"
fi

# 4. Installazione dipendenze npm
echo "📚 Installazione dipendenze del progetto..."
cd "$APP_DIR"
# Assegna permessi corretti alla cartella
chown -R "$CURRENT_USER":"$CURRENT_USER" "$APP_DIR"
sudo -u "$CURRENT_USER" npm install --omit=dev

# 5. Configurazione del Servizio Systemd (Avvio automatico all'accensione)
echo "⚙️ Configurazione del servizio di avvio automatico (systemd)..."

SERVICE_FILE="/etc/systemd/system/festa-laurea.service"

cat <<EOF > "$SERVICE_FILE"
[Unit]
Description=Festa di Laurea - Photo Web App Server
After=network.target network-online.target
Wants=network-online.target

[Service]
Type=simple
User=$CURRENT_USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=PORT=3000
Environment=NODE_ENV=production

# Permette di utilizzare porte privilegiate se necessario
AmbientCapabilities=CAP_NET_BIND_SERVICE
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Ricarica e abilita il servizio
systemctl daemon-reload
systemctl enable festa-laurea.service
systemctl restart festa-laurea.service

# 6. Rilevamento IP del Raspberry Pi
IP_ADDR=$(hostname -I | awk '{print $1}')

echo ""
echo "=========================================================="
echo "🎉 INSTALLAZIONE COMPLETATA CON SUCCESSO!"
echo "=========================================================="
echo ""
echo " Il server è ora attivo e si avvierà AUTOMATICAMENTE ogni volta"
echo "   che collegherai l'alimentatore al Raspberry Pi!"
echo ""
echo "🌐 Indirizzi di accesso sulla stessa rete (Wi-Fi / Hotspot):"
echo "   👉 http://$IP_ADDR:3000"
echo "   👉 http://$(hostname).local:3000"
echo ""
echo "📋 Comandi utili di gestione:"
echo "   - Stato del server:   sudo systemctl status festa-laurea"
echo "   - Riavvia il server:  sudo systemctl restart festa-laurea"
echo "   - Ferma il server:    sudo systemctl stop festa-laurea"
echo "   - Guarda i log live:  sudo journalctl -u festa-laurea -f"
echo ""
echo "🌍 Vuoi rendere il sito raggiungibile ovunque via Internet senza Wi-Fi?"
echo "   Esegui semplicemente: bash avvia-tunnel.sh"
echo "=========================================================="
echo ""
