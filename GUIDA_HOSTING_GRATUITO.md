# 🌐 Guida Completa al Caricamento su Hosting Gratuito (Render.com)

Questa guida ti mostra come pubblicare online il sito della **Festa di Laurea di Federica** su un hosting cloud **100% gratuito**, senza bisogno di tenere il tuo PC acceso, senza aprire porte sul modem e senza limiti di rete.

Gli ospiti potranno scattare foto da qualsiasi smartphone (iPhone e Android, sia in Wi-Fi che in 4G/5G), visualizzare la galleria live e tutte le foto arriveranno **direttamente sul tuo Google Drive**!

---

## 🏆 Perché Render.com è la scelta consigliata
- **100% Gratuito per sempre** (piano Web Service Free).
- **HTTPS protetto con lucchetto verde (SSL)** incluso senza costi.
- **Indirizzo personalizzato**, ad esempio: `https://festa-laurea-federica.onrender.com`.
- **QR Code automatico**: il QR code sul sito e nei cartellini da stampare punterà direttamente al nuovo indirizzo pubblico.
- **Il tuo computer e il tuo modem possono essere spenti** durante tutta la serata.

---

## 🚀 Istruzioni in 3 Semplici Passaggi (Tempo: 3-5 minuti)

### PASSO 1: Crea un repository gratuito su GitHub
1. Vai su [github.com](https://github.com) e accedi con il tuo account (se non ne hai uno, registrati gratuitamente).
2. Clicca sul pulsante verde **"New"** (Nuovo repository) oppure visita [github.com/new](https://github.com/new).
3. Compila solo:
   - **Repository name**: `sito-fede` (o `festa-laurea-federica`)
   - Seleziona **Public** oppure **Private** (vanno bene entrambi; se scegli Private, Render potrà comunque accedervi dandogli il permesso con un clic).
   - **IMPORTANTE**: Lascia **deselezionate** le caselle *"Add a README file"*, *".gitignore"* e *"license"* (abbiamo già preparato tutto noi nella cartella).
4. Clicca su **"Create repository"**.
5. Nella schermata successiva, copia l'URL HTTPS del repository, che assomiglia a:
   `https://github.com/tuo-nome-utente/sito-fede.git`

---

### PASSO 2: Carica il codice dal tuo computer a GitHub
Abbiamo preparato uno script che fa tutto in automatico!

1. Nella cartella del sito sul tuo computer, fai doppio clic sul file:
   👉 **`prepara-git-github.bat`**
2. Quando richiesto, **incolla l'URL di GitHub** che hai copiato al Passo 1 e premi **INVIO**.
3. Il programma caricherà tutti i file su GitHub in pochi secondi.

*(In alternativa manuale tramite prompt dei comandi)*:
```cmd
git add .
git commit -m "Festa di Laurea Federica"
git branch -M main
git remote add origin https://github.com/TUO_UTENTE/sito-fede.git
git push -u origin main
```

---

### PASSO 3: Pubblica su Render.com in 1 Clic
1. Vai su [render.com](https://render.com) e clicca su **"Get Started for Free"** (puoi registrarti direttamente con **"Sign in with GitHub"**).
2. Nella Dashboard principale di Render, clicca sul pulsante in alto a destra **"New +"** e scegli **"Web Service"**.
3. Seleziona l'opzione **"Build and deploy from a Git repository"** e clicca su **Next**.
4. Clicca su **"Connect"** accanto al repository `sito-fede` che hai appena caricato.
5. Si aprirà la pagina di configurazione (molti parametri sono già precompilati dal file `render.yaml` incluso nel progetto):
   - **Name**: `festa-laurea-federica` (determina il tuo link gratuito!)
   - **Region**: `Frankfurt (EU)` *(consigliata, la più veloce e vicina per l'Italia)*
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: seleziona **Free** ($0/month)
6. Scorri in fondo e clicca sul pulsante blu **"Create Web Service"** (oppure **"Deploy Web Service"**).

---

## ⏱️ Attendi 60 secondi e il sito è LIVE!
- Vedrai scorrere i log di installazione.
- In circa 60-90 secondi vedrai la scritta verde **"Live"**.
- In alto sotto al nome del servizio troverai il tuo link pubblico sicuro:
  👉 **`https://festa-laurea-federica.onrender.com`** (o il nome che hai scelto).

---

## 📱 Verifica e Stampa del QR Code
1. Apri il link dal tuo computer o smartphone.
2. Clicca su **"Mostra QR Code"**: noterai che il QR code si adatta istantaneamente al link pubblico `https://...`!
3. Clicca su **"Stampa Segnaposto"**: puoi stampare i cartellini da posizionare sui tavoli del locale o inviare il link su WhatsApp a tutti gli invitati.
4. Quando gli invitati scattano e caricano una foto con dedica:
   - Apparirà immediatamente sul maxischermo o nella galleria live del sito.
   - Verrà salvata automaticamente nella tua cartella **Google Drive**:
     `https://drive.google.com/drive/folders/1OEgjkFRnS2URfl1MVzZl9Oyzps0dQ1b8`

---

## 💡 Consiglio Utile sul Piano Gratuito di Render ("Spin Down")
Sui piani gratuiti di Render, se nessuno visita il sito per 15 minuti, il server va in "sospensione" per risparmiare energia, e al primo accesso successivo impiega circa 30-40 secondi a svegliarsi.

**Come evitare qualsiasi attesa durante la festa:**
- Poco prima dell'inizio della festa, apri il sito una volta dal tuo cellulare per risvegliarlo.
- Durante la festa, poiché ci saranno molti ospiti che caricano foto e visitano la galleria continuamente, il sito rimarrà sempre attivo e reattivo!
- *(Facoltativo)*: Se vuoi che rimanga sveglio 24 ore su 24 anche nei giorni precedenti, puoi inserire gratuitamente il link del tuo sito su [cron-job.org](https://cron-job.org) o [uptimerobot.com](https://uptimerobot.com) con controllo ogni 10 minuti.

---

## 🔄 Aggiornamenti Futuri
Se vuoi modificare un testo o un colore in futuro:
1. Modifica i file sul tuo PC.
2. Avvia di nuovo `prepara-git-github.bat`.
3. Render rileverà la modifica su GitHub e aggiornerà il sito automaticamente in pochi secondi!
