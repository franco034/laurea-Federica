# 🎓 Festa di Laurea - Condivisione Foto & Cloud Google Drive

Una web app moderna, veloce ed elegante pensata per permettere a tutti gli invitati di una **Festa di Laurea** di caricare foto direttamente dallo smartphone (senza bisogno di registrazioni o account Google), visualizzarle in una galleria live con dediche e "mi piace", e **salvarle automaticamente sul tuo Google Drive personale** per scaricarle comodamente in qualsiasi momento.

---

## ✨ Funzionalità Principali

- 📸 **Caricamento Istantaneo senza Registrazione**: Gli invitati aprono il sito o inquadrano il QR code dal telefono e possono scattare foto al volo (`Scatta Foto`) o sceglierne molteplici dalla galleria (`Scegli dalla Galleria`).
- ✍️ **Nome & Dedica**: Gli invitati possono inserire il proprio nome e lasciare un messaggio di auguri per il Dottore/Dottoressa.
- ☁️ **Sincronizzazione Automatica su Google Drive**: Ogni foto caricata viene inviata direttamente a una cartella del tuo account Google Drive personale.
- 💾 **Salvataggio di Backup Locale**: Tutte le foto vengono anche conservate localmente sul computer nella cartella `uploads/` come sicurezza aggiuntiva.
- 🖼️ **Galleria Live & Lightbox**: Visualizzazione a mosaico di tutte le foto con cuoricini (❤️), filtro per dediche e zoom a tutto schermo.
- 📦 **Download Completo in un Click (ZIP)**: Puoi scaricare un archivio `.zip` con tutte le foto scattate durante la festa in alta risoluzione.
- 📱 **Generatore di QR Code & Segnaposto per i Tavoli**: Modalità integrata con pulsante di stampa per creare cartoncini segnaposto con il QR Code da posizionare sui tavoli della festa.
- ⚙️ **Pannello di Controllo Host**: Modifica il nome del festeggiato, corso di laurea, messaggio di benvenuto e configura la connessione a Google Drive con PIN (predefinito: `1234`).

---

## 🚀 Come Avviare il Sito

### Metodo 1: Doppio Click (Consigliato su Windows)
Fai doppio click sul file:
👉 **`avvia-sito.bat`**
Il terminale si aprirà e il browser si aprirà automaticamente su `http://localhost:3000`.

### Metodo 2: Da Terminale
```bash
npm start
```
Il server sarà attivo su:
- 💻 **Sul tuo PC**: `http://localhost:3000`
- 📱 **Per gli invitati (connessi allo stesso Wi-Fi o Hotspot)**: `http://192.168.1.XX:3000` (l'indirizzo esatto viene mostrato all'avvio del server e nel QR Code).

---

## ☁️ Come Collegare il Tuo Google Drive in 2 Minuti (Gratuito al 100%)

Per fare in modo che le foto finiscano direttamente nel tuo Google Drive personale senza costi e senza configurazioni complesse:

1. Apri **[script.google.com](https://script.google.com)** con il tuo account Google.
2. Clicca su **"Nuovo progetto"** in alto a sinistra.
3. Cancella il codice presente ed incolla il codice contenuto nel file [`public/google-apps-script.js`](public/google-apps-script.js) (oppure clicca sul pulsante *"Copia Codice Script Google Drive"* dentro le Impostazioni del sito).
4. Clicca in alto a destra sul pulsante blu **"Esegui distribuzione" (Deploy)** ➔ **"Nuova distribuzione"**.
5. Clicca sull'icona a forma di ingranaggio accanto a "Seleziona tipo" e scegli **"Applicazione web" (Web app)**:
   - **Descrizione**: `Foto Laurea`
   - **Esegui come**: `Io (il tuo indirizzo email)`
   - **Chi ha accesso**: `Chiunque` *(Fondamentale per consentire al sito di inviare le foto)*
6. Clicca su **Esegui distribuzione** e autorizza l'accesso con il tuo account Google.
7. Copia l'**URL dell'applicazione web** generato (termina con `/exec`).
8. Sul sito web della festa, clicca sull'icona dell'ingranaggio ⚙️ (Impostazioni), inserisci il PIN `1234`, incolla l'URL e salva!

🎉 Da questo momento in poi, ogni foto caricata dagli invitati verrà archiviata automaticamente in una cartella chiamata **"Foto Festa di Laurea"** nel tuo Google Drive!

---

## 📱 Come Condividere con gli Invitati alla Festa

1. **Stessa Rete Wi-Fi / Hotspot**: Se la festa è in un locale o a casa, connetti il PC al Wi-Fi del locale (o attiva l'hotspot del tuo cellulare). Clicca sul pulsante **"QR Code Tavoli"** in alto a destra e fai scansionare il QR code agli invitati!
2. **Online ovunque (Opzionale)**: Se vuoi che il sito sia raggiungibile da qualsiasi rete 4G/5G senza essere sulla stessa Wi-Fi:
   - Puoi usare uno strumento gratuito come **ngrok** (`npx ngrok http 3000`) o **localtunnel** (`npx localtunnel --port 3000`) che ti darà un link pubblico (es. `https://laurea-federico.loca.lt`) da incollare o generare nel QR code.
   - Oppure caricare la cartella su servizi gratuiti come Render o Railway.

---

## 📂 Struttura del Progetto

```
sito fede/
├── avvia-sito.bat         # Avvio rapido con doppio click
├── server.js              # Server Node.js/Express (upload, sync Drive, zip)
├── config.json            # Configurazione festa e credenziali
├── package.json           # Dipendenze del progetto
├── data/
│   └── photos.json        # Database delle foto e dediche
├── uploads/               # Cartella con i file originali salvati in locale
└── public/
    ├── index.html         # Interfaccia grafica della festa
    ├── style.css          # Design moderno glassmorphism
    ├── app.js             # Logica front-end (upload, galleria, lightbox, QR)
    └── google-apps-script.js # Script da incollare su Google Apps Script
```
