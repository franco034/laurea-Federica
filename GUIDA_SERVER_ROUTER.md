# 🖥️ Guida Completa: Questo PC come Vero Server Web Nativo

Questo PC è ora configurato come un **vero e proprio server web HTTP standard (sulla porta 80)**, esattamente come i server dei siti internet commerciali.

---

## 🚀 Passo 1: Aprire il Firewall di Windows (1 solo Clic)

Affinché gli smartphone possano connettersi al PC senza essere bloccati dalle protezioni di Windows:
1. Fai doppio clic sul file:
   👉 **`apri-firewall-windows.bat`**
2. Clicca su **"Sì"** quando Windows chiede l'autorizzazione di amministratore.
3. Il firewall abiliterà istantaneamente il traffico in ingresso sulla porta web standard **80**.

---

## 📶 Accesso Diretto in Rete Locale (Wi-Fi / Hotspot)

Quando il PC e gli smartphone sono collegati alla stessa rete Wi-Fi (o all'hotspot del cellulare):
- 💻 **Sul PC**: `http://localhost`
- 📱 **Sugli smartphone**: **`http://192.168.1.13`** *(Non serve nemmeno scrivere `:3000`, la porta 80 è quella standard del web!)*

Tutti gli invitati possono inquadrare il QR Code del sito e navigare direttamente!

---

## 🌍 Accesso Globale da Internet (4G/5G) tramite il tuo Router (Port Forwarding)

Se vuoi che il sito sia raggiungibile da **chiunque da tutta Italia con connessione dati 4G o 5G** direttamente attraverso la tua connessione di casa (senza alcun servizio di tunneling):

### 1. Entra nel pannello del tuo modem/router
Apri il browser sul PC e vai all'indirizzo del tuo modem (solitamente `http://192.168.1.1` oppure `http://192.168.0.1` o `http://192.168.1.254`). Inserisci username e password del modem (spesso scritte sull'etichetta dietro al modem).

### 2. Vai nella sezione "Port Forwarding" (o "Inoltro Porte" / "NAT / Virtual Server")
Crea una nuova regola con questi parametri:
- **Nome regola**: `Sito Laurea`
- **Indirizzo IP interno**: `192.168.1.13` (l'IP locale di questo PC)
- **Porta interna**: `80`
- **Porta esterna**: `80`
- **Protocollo**: `TCP` (oppure `TCP/UDP`)

Salva le impostazioni.

### 3. Il tuo indirizzo Internet pubblico:
Il tuo indirizzo IP pubblico attuale è:
👉 **`http://82.90.76.117`**

Chiunque scriva `http://82.90.76.117` o inquadri il QR Code con questo indirizzo da qualsiasi cellulare al mondo (in 4G, 5G o da casa sua) atterrerà direttamente sul tuo PC!

---

### 🏷️ Opzionale: Avere un nome facile anziché i numeri dell'IP (Dynamic DNS Gratuito)
Se preferisci che gli invitati leggano un nome come `http://laurea-federica.duckdns.org` invece di `http://82.90.76.117`:
1. Vai su **[duckdns.org](https://www.duckdns.org)** (100% gratuito).
2. Crea un dominio a tua scelta (es. `laurea-federica`).
3. Incolla il tuo IP pubblico `82.90.76.117`.
4. Nel sito, vai in **⚙️ Impostazioni** e incolla il dominio nel campo personalizzato: il QR Code si aggiornerà automaticamente con il tuo link!
