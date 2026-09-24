# 🍓 Guida Completa: Eseguire il Sito su Raspberry Pi

Usare un **Raspberry Pi** come server per la festa è una scelta perfetta: è un dispositivo compatto, silenzioso, a bassissimo consumo energetico, e può rimanere acceso tutta la sera senza occupare il tuo computer portatile!

Abbiamo predisposto **tutto l'occorrente con script automatici** affinché il sito:
1. Si avvii **automaticamente ogni volta che colleghi l'alimentazione** al Raspberry Pi (grazie al servizio systemd).
2. Possa essere raggiunto sia in **rete locale (Wi-Fi)** sia **via Internet (4G/5G)** con un link pubblico sicuro gratuito HTTPS (senza dover toccare il router del locale!).

---

## 🚀 Passo 1: Copiare i File sul Raspberry Pi

Hai due modi semplicissimi per copiare la cartella del sito sul Raspberry Pi:

### Metodo A: Con il file automatico di Windows (Consigliato)
1. Assicurati che il Raspberry Pi sia acceso e collegato alla stessa rete Wi-Fi del tuo PC.
2. Fai doppio clic sul file:
   👉 **`trasferisci-su-raspberry.bat`**
3. Inserisci l'indirizzo IP del Raspberry Pi (es. `192.168.1.50`) e il nome utente (premi Invio per `pi`).
4. Il computer copierà automaticamente tutti i file nella cartella `~/sito-fede` del Raspberry Pi!

### Metodo B: Tramite Chiavetta USB
1. Copia l'intera cartella `sito fede` su una chiavetta USB.
2. Inserisci la chiavetta nel Raspberry Pi e copia la cartella nella Home (`/home/pi/sito-fede`).

---

## ⚙️ Passo 2: Installazione Automatica con 1 Comando

Apri il terminale del Raspberry Pi (tramite SSH da Windows con `ssh pi@IP_RASPBERRY` oppure direttamente con tastiera e monitor collegati al Raspberry) ed esegui:

```bash
cd ~/sito-fede
sudo bash setup-raspberry.sh
```

Lo script fa **tutto da solo in automatico**:
- Installa Node.js se non è presente.
- Installa tutte le librerie necessarie.
- Configura e abilita il servizio `festa-laurea.service` per **l'avvio automatico all'accensione del Raspberry Pi**.
- Avvia il server!

---

## 🌍 Passo 3: Come Far Connettere gli Invitati alla Festa

Hai due modalità di utilizzo a seconda di come si svolge la festa:

### 🌟 Modalità 1: Link Internet Pubblico HTTPS (CONSIGLIATISSIMA!)
Non vuoi che tutti gli invitati debbano chiedere e inserire la password del Wi-Fi del locale?
Grazie allo script Cloudflare Tunnel integrato, puoi generare un **link HTTPS pubblico sicuro** valido da qualsiasi connessione dati mobile (4G / 5G / Wi-Fi):

Nel terminale del Raspberry Pi, esegui:
```bash
cd ~/sito-fede
bash avvia-tunnel.sh
```
In pochi secondi comparirà a schermo una riga come:
`https://nomi-casuali.trycloudflare.com`

- Chiunque tocchi quel link o inquadri il QR Code dal proprio smartphone (TIM, Vodafone, Iliad, WindTre, ecc.) potrà **accedere e caricare subito le foto**, senza essere collegato al Wi-Fi del locale!
- Tutte le foto verranno sincronizzate all'istante sul tuo **Google Drive**!

---

### 📶 Modalità 2: Rete Locale Wi-Fi / Hotspot
Se colleghi il Raspberry Pi al Wi-Fi del locale (o all'hotspot del tuo cellulare):
- Gli invitati collegati alla stessa rete potranno aprire:
  - `http://[IP_DEL_RASPBERRY]:3000`
  - Oppure `http://raspberrypi.local:3000`
- Il sito mostrerà nel pulsante **"QR Code Tavoli"** il codice corretto da inquadrare con il cellulare!

---

## 📋 Comandi Utili sul Raspberry Pi

- **Vedere se il server è attivo**:
  ```bash
  sudo systemctl status festa-laurea
  ```
- **Riavviare il server**:
  ```bash
  sudo systemctl restart festa-laurea
  ```
- **Fermare il server**:
  ```bash
  sudo systemctl stop festa-laurea
  ```
- **Vedere i log dei caricamenti in tempo reale**:
  ```bash
  sudo journalctl -u festa-laurea -f
  ```
