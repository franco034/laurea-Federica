# 🎓 Stato Progetto: Festa di Laurea di Federica

**Ultimo aggiornamento**: 24 Settembre 2026  
**Stato**: Pronto per il deploy su Hosting Cloud Gratuito (Render.com)

---

## 📌 1. Panoramica del Progetto
Applicazione web completa creata per la festa di laurea di Federica:
- **Ospiti**: Possono accedere da smartphone (iPhone e Android) scansionando un QR Code sui tavoli o tramite link, scattare/caricare foto con il proprio nome e una dedica.
- **Galleria Live**: Feed istantaneo in tempo reale con animazioni, filtri, cuori/like e lightbox responsive con swipe.
- **Sincronizzazione Cloud Google Drive**: Tutte le foto scattate vengono sincronizzate in background direttamente su una cartella personale di Google Drive tramite Google Apps Script.
- **Area Admin (PIN: 1234)**: Download di tutte le foto in archivio ZIP, eliminazione singola foto, svuotamento galleria, forzatura sincronizzazione Google Drive.

---

## 🔒 2. Vincoli e Decisioni Architetturali
1. **Nessun Tunneling**: Escluso l'uso di ngrok o localtunnel per stabilità e facilità d'uso degli invitati.
2. **Nessun Port-Forwarding sul Modem**: L'utente non ha accesso al router/modem di casa, escludendo il self-hosting casalingo diretto tramite IP pubblico.
3. **Hosting Cloud Gratuito (Render.com)**:
   - Scelto come soluzione definitiva: 100% gratuito, con certificato SSL (HTTPS), dominio personalizzato (es. `festa-laurea-federica.onrender.com`), nessun bisogno di tenere computer o modem accesi la sera della festa.
   - Sincronizzazione Drive indipendente: anche se il container cloud ha filesystem temporaneo, le foto restano per sempre al sicuro su Google Drive.

---

## 📂 3. File del Progetto e Modifiche Apportate

| File | Scopo / Modifiche Principali |
|---|---|
| [`server.js`](file:///c:/Users/franc/Desktop/sito%20fede/server.js) | Backend Express: porta dinamica (`process.env.PORT`), rilevamento automatico del dominio cloud (`req.protocol + host`), supporto proxy inverso, integrazione Google Apps Script via fetch, ZIP archiver v8. |
| [`config.json`](file:///c:/Users/franc/Desktop/sito%20fede/config.json) | Configurazione attiva: nome "Federica", URL Web App Google Script (`/exec`), URL cartella Drive, PIN admin `1234`. |
| [`public/index.html`](file:///c:/Users/franc/Desktop/sito%20fede/public/index.html) | Layout celebrativo scuro glassmorphic, mobile first, modale QR code, modale impostazioni/admin, pulsante flottante fotocamera (FAB). |
| [`public/style.css`](file:///c:/Users/franc/Desktop/sito%20fede/public/style.css) | Stili CSS moderni responsive, griglia 2 colonne su smartphone, touch targets 48px, fix zoom iOS (font 16px). |
| [`public/app.js`](file:///c:/Users/franc/Desktop/sito%20fede/public/app.js) | Logica client: caricamento multiplo, swipe gesture lightbox, generazione dinamica QR code sul dominio effettivo, gestione like/dediche. |
| [`.gitignore`](file:///c:/Users/franc/Desktop/sito%20fede/.gitignore) | Esclude `node_modules/`, log e file temporanei; mantiene traccia di `uploads/.gitkeep` e `data/`. |
| [`render.yaml`](file:///c:/Users/franc/Desktop/sito%20fede/render.yaml) | Blueprint Render.com: deploy automatico Node.js piano free in Europa (Francoforte). |
| [`Procfile`](file:///c:/Users/franc/Desktop/sito%20fede/Procfile) | Comando di avvio per piattaforme PaaS (`web: node server.js`). |
| [`Dockerfile`](file:///c:/Users/franc/Desktop/sito%20fede/Dockerfile) & [`.dockerignore`](file:///c:/Users/franc/Desktop/sito%20fede/.dockerignore) | Supporto per qualsiasi piattaforma a container (Railway, Koyeb, Fly.io). |
| [`package.json`](file:///c:/Users/franc/Desktop/sito%20fede/package.json) | Dipendenze pulite (`express`, `multer`, `cors`, `dotenv`, `archiver`), script `"start"` e `"build"`, engine Node >= 18. |
| [`prepara-git-github.bat`](file:///c:/Users/franc/Desktop/sito%20fede/prepara-git-github.bat) | Script per Windows pulito (senza caratteri speciali) per preparare il commit Git e inviarlo a GitHub incollando il link. |
| [`GUIDA_HOSTING_GRATUITO.md`](file:///c:/Users/franc/Desktop/sito%20fede/GUIDA_HOSTING_GRATUITO.md) | Guida passo-passo per pubblicare su Render.com in 3 minuti. |
| `data/` & `uploads/` | Directory dati persistenti (`data/photos.json` inizializzato vuoto) e cartella upload. |

---

## 🔗 4. Parametri e Credenziali Attive
- **Google Apps Script Web App**:
  `https://script.google.com/macros/s/AKfycbxeBBK2FheJvAyMLep4hA2sAlAVbs4fgfWPArofVh_TxhPXzs5zZkHrCe4luFBafCDi/exec`
- **Cartella Google Drive di destinazione**:
  `https://drive.google.com/drive/folders/1OEgjkFRnS2URfl1MVzZl9Oyzps0dQ1b8`
- **PIN Amministratore**:
  `1234`
- **Git Locale**:
  Inizializzato e allineato su branch `main`.

---

## ⏭️ 5. Prossimi Passaggi per la Prossima Sessione
1. **Completare il Push su GitHub**:
   - Creare il repository su [github.com/new](https://github.com/new) (es. `festa-fede`).
   - Eseguire [`prepara-git-github.bat`](file:///c:/Users/franc/Desktop/sito%20fede/prepara-git-github.bat) incollando il link GitHub (oppure eseguire `git remote add origin <URL>` e `git push -u origin main`).
2. **Collegare a Render.com**:
   - Accedere a [render.com](https://render.com) con GitHub.
   - Creare un nuovo **Web Service** collegando il repository.
3. **Verifica Finale Online**:
   - Aprire il link pubblico generato da Render (es. `https://festa-laurea-federica.onrender.com`).
   - Caricare una foto di prova da smartphone e verificare che compaia sia nella galleria che su Google Drive.
   - Stampare o salvare i cartellini con il QR Code definitivo dal sito.
