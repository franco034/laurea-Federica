#!/bin/bash
# ==============================================================================
# AVVIO TUNNEL PUBBLICO HTTPS (CLOUDFLARE QUICK TUNNEL)
# Rende il tuo Raspberry Pi accessibile da qualsiasi smartphone via 4G/5G/Internet
# Senza aprire porte sul router e con certificato SSL HTTPS gratuito!
# ==============================================================================

echo ""
echo "=========================================================="
echo "🌍 AVVIO TUNNEL INTERNET PUBBLICO (CLOUDFLARE)"
echo "=========================================================="
echo ""

# 1. Verifica architettura del Raspberry (arm64, armhf, amd64)
ARCH=$(uname -m)
CLOUDFLARED_BIN="/usr/local/bin/cloudflared"

if ! command -v cloudflared > /dev/null 2>&1; then
  echo "⬇️ Download di Cloudflare Tunnel (cloudflared)..."
  if [[ "$ARCH" == "aarch64" || "$ARCH" == "arm64" ]]; then
    curl -fsSL -o /tmp/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64
  elif [[ "$ARCH" == "armv7l" || "$ARCH" == "armhf" ]]; then
    curl -fsSL -o /tmp/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm
  else
    curl -fsSL -o /tmp/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  fi

  sudo mv /tmp/cloudflared "$CLOUDFLARED_BIN"
  sudo chmod +x "$CLOUDFLARED_BIN"
  echo " Cloudflared installato con successo!"
fi

echo ""
echo "🚀 Avvio del tunnel verso la porta 3000..."
echo "⏳ Generazione dell'indirizzo Internet pubblico HTTPS in corso..."
echo ""
echo "=========================================================="
echo "⚠️  Cerca qui sotto la riga con 'https://...trycloudflare.com'"
echo "   Quello è il link pubblico da condividere o proiettare!"
echo "   (Premi Ctrl+C per fermare il tunnel quando la festa è finita)"
echo "=========================================================="
echo ""

cloudflared tunnel --url http://localhost:3000
