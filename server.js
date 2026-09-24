const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { ZipArchive } = require('archiver');

const app = express();
let PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 80;

let publicIpCached = null;
async function getPublicIp() {
  if (publicIpCached) return publicIpCached;
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    publicIpCached = data.ip;
    return publicIpCached;
  } catch (err) {
    return null;
  }
}

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const CONFIG_FILE = path.join(__dirname, 'config.json');
const PHOTOS_FILE = path.join(DATA_DIR, 'photos.json');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(PHOTOS_FILE)) fs.writeFileSync(PHOTOS_FILE, '[]', 'utf8');

// Middleware
app.enable('trust proxy');
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Helper: Get Network IP
function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Helper: Config reader & writer
function getConfig() {
  let fileConfig = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Errore lettura config:', err);
  }
  return {
    eventTitle: process.env.EVENT_TITLE || fileConfig.eventTitle || "Festa di Laurea di Federica",
    graduateName: process.env.GRADUATE_NAME || fileConfig.graduateName || "Federica",
    degreeCourse: process.env.DEGREE_COURSE || fileConfig.degreeCourse || "",
    partyDate: process.env.PARTY_DATE || fileConfig.partyDate || "2026-10-15",
    welcomeMessage: process.env.WELCOME_MESSAGE || fileConfig.welcomeMessage || "Benvenuti alla mia festa di laurea! 🎓 Scattate o caricate le vostre foto per immortalare i momenti più belli.",
    googleScriptUrl: process.env.GOOGLE_SCRIPT_URL || fileConfig.googleScriptUrl || "",
    googleFolderId: process.env.GOOGLE_FOLDER_ID || fileConfig.googleFolderId || "",
    googleFolderUrl: process.env.GOOGLE_FOLDER_URL || fileConfig.googleFolderUrl || "",
    adminPin: process.env.ADMIN_PIN || fileConfig.adminPin || "1234",
    customDomain: process.env.CUSTOM_DOMAIN || fileConfig.customDomain || ""
  };
}

function saveConfig(newConfig) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf8');
}

// Helper: Photos reader & writer
function getPhotos() {
  try {
    if (fs.existsSync(PHOTOS_FILE)) {
      return JSON.parse(fs.readFileSync(PHOTOS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Errore lettura photos.json:', err);
  }
  return [];
}

function savePhotos(photos) {
  fs.writeFileSync(PHOTOS_FILE, JSON.stringify(photos, null, 2), 'utf8');
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 35 * 1024 * 1024 }, // 35MB per file
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp|heic|heif|avif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype.toLowerCase()) || file.mimetype.startsWith('image/');
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Sono consentiti solo file di tipo immagine (JPG, PNG, WEBP, HEIC, ecc.)!'));
  }
});

// Helper: Upload file to Google Drive via Google Apps Script Web App
async function uploadToGoogleDrive(filePath, originalName, mimeType, guestName, message) {
  const config = getConfig();
  const scriptUrl = (config.googleScriptUrl || '').trim();

  if (!scriptUrl) {
    return { success: false, reason: 'Google Apps Script URL non configurato' };
  }

  if (scriptUrl.includes('/edit') || !scriptUrl.includes('/exec')) {
    const errorMsg = 'URL errato: hai inserito il link dell\'editor di Google Script invece dell\'URL di distribuzione dell\'Applicazione Web (deve terminare con /exec). Clicca in alto a destra su "Distribuisci" -> "Nuova distribuzione" -> "Applicazione web" e copia il link finale.';
    console.warn(`⚠️ ${errorMsg}`);
    return { success: false, reason: errorMsg };
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    const payload = {
      filename: originalName,
      mimeType: mimeType || 'image/jpeg',
      base64: base64Data,
      guestName: guestName || 'Ospite',
      message: message || '',
      folderId: config.googleFolderId || '',
      folderName: `Foto Laurea - ${config.graduateName || 'Federica'}`,
      timestamp: new Date().toLocaleString('it-IT')
    };

    console.log(`📤 Invio file ${originalName} a Google Drive...`);
    const response = await fetch(scriptUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow'
    });

    const rawText = await response.text();
    let result;
    try {
      result = JSON.parse(rawText);
    } catch (parseErr) {
      if (rawText.includes('accounts.google.com') || rawText.includes('Sign in') || rawText.includes('<!DOCTYPE')) {
        return {
          success: false,
          reason: 'Accesso negato da Google: durante la distribuzione (Deploy) in Google Apps Script devi impostare "Chi ha accesso: Chiunque" (Anyone).'
        };
      }
      return { success: false, reason: 'Risposta non valida da Google: ' + rawText.substring(0, 100) };
    }

    console.log(' Risposta Google Drive:', result);

    if (result.status === 'success') {
      if (result.folderUrl && !config.googleFolderUrl) {
        config.googleFolderUrl = result.folderUrl;
        saveConfig(config);
      }
      return {
        success: true,
        fileId: result.fileId,
        fileUrl: result.fileUrl,
        downloadUrl: result.downloadUrl,
        folderUrl: result.folderUrl
      };
    } else {
      return { success: false, reason: result.message || 'Errore restituito da Google Apps Script' };
    }
  } catch (err) {
    console.error('❌ Errore durante il caricamento su Google Drive:', err.message);
    return { success: false, reason: err.message };
  }
}

// -------------------------------------------------------------
// ROUTES API
// -------------------------------------------------------------

// GET Config (public safe)
app.get('/api/config', async (req, res) => {
  const config = getConfig();
  const localIp = getLocalNetworkIp();
  const publicIp = await getPublicIp();
  
  let networkUrl;
  if (config.customDomain && config.customDomain.trim()) {
    networkUrl = config.customDomain.trim();
  } else if (process.env.PUBLIC_URL) {
    networkUrl = process.env.PUBLIC_URL;
  } else {
    const host = req.get('host');
    const isCloudHost = host && !host.includes('localhost') && !host.includes('127.0.0.1') && !host.startsWith('192.168.') && !host.startsWith('10.') && !/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host);
    if (isCloudHost) {
      networkUrl = `${req.protocol}://${host}`;
    } else {
      networkUrl = (PORT === 80) ? `http://${localIp}` : `http://${localIp}:${PORT}`;
    }
  }

  res.json({
    eventTitle: config.eventTitle,
    graduateName: config.graduateName,
    degreeCourse: config.degreeCourse,
    partyDate: config.partyDate,
    welcomeMessage: config.welcomeMessage,
    hasDriveConfigured: Boolean(config.googleScriptUrl && config.googleScriptUrl.trim()),
    googleFolderUrl: config.googleFolderUrl || '',
    localIp: localIp,
    publicIp: publicIp,
    port: PORT,
    customDomain: config.customDomain || '',
    networkUrl: networkUrl
  });
});

// POST Config (admin protected)
app.post('/api/config', (req, res) => {
  const { pin, ...newFields } = req.body;
  const currentConfig = getConfig();

  if (pin !== currentConfig.adminPin) {
    return res.status(403).json({ error: 'PIN Amministratore non corretto' });
  }

  const updatedConfig = {
    ...currentConfig,
    eventTitle: newFields.eventTitle !== undefined ? newFields.eventTitle : currentConfig.eventTitle,
    graduateName: newFields.graduateName !== undefined ? newFields.graduateName : currentConfig.graduateName,
    degreeCourse: newFields.degreeCourse !== undefined ? newFields.degreeCourse : currentConfig.degreeCourse,
    partyDate: newFields.partyDate !== undefined ? newFields.partyDate : currentConfig.partyDate,
    welcomeMessage: newFields.welcomeMessage !== undefined ? newFields.welcomeMessage : currentConfig.welcomeMessage,
    googleScriptUrl: newFields.googleScriptUrl !== undefined ? newFields.googleScriptUrl.trim() : currentConfig.googleScriptUrl,
    googleFolderId: newFields.googleFolderId !== undefined ? newFields.googleFolderId.trim() : currentConfig.googleFolderId,
    googleFolderUrl: newFields.googleFolderUrl !== undefined ? newFields.googleFolderUrl.trim() : currentConfig.googleFolderUrl,
    adminPin: newFields.newPin && newFields.newPin.trim() ? newFields.newPin.trim() : currentConfig.adminPin
  };

  saveConfig(updatedConfig);
  res.json({ success: true, message: 'Configurazione salvata con successo!' });
});

// GET Photos list
app.get('/api/photos', (req, res) => {
  const photos = getPhotos();
  // Ordina per timestamp decrescente (le più recenti in cima)
  photos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(photos);
});

// POST Upload Photos
app.post('/api/upload', upload.array('photos', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Nessun file selezionato' });
    }

    const guestName = (req.body.guestName || 'Ospite').trim().substring(0, 50);
    const message = (req.body.message || '').trim().substring(0, 300);
    const photos = getPhotos();
    const newPhotos = [];

    for (const file of req.files) {
      const photoId = 'photo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      const photoObj = {
        id: photoId,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        url: `/uploads/${file.filename}`,
        guestName: guestName,
        message: message,
        likes: 0,
        createdAt: new Date().toISOString(),
        driveSynced: false,
        driveUrl: null,
        driveFileId: null
      };

      photos.unshift(photoObj);
      newPhotos.push(photoObj);

      // Trigger background upload to Google Drive without blocking response
      const filePath = path.join(UPLOADS_DIR, file.filename);
      uploadToGoogleDrive(filePath, file.originalname, file.mimetype, guestName, message)
        .then(driveRes => {
          if (driveRes.success) {
            const currentPhotos = getPhotos();
            const target = currentPhotos.find(p => p.id === photoId);
            if (target) {
              target.driveSynced = true;
              target.driveUrl = driveRes.fileUrl;
              target.driveFileId = driveRes.fileId;
              savePhotos(currentPhotos);
              console.log(` Sincronizzato con successo su Drive: ${file.originalname}`);
            }
          } else {
            console.log(`ℹ️ Salvataggio locale completato. Drive non sincronizzato: ${driveRes.reason}`);
          }
        })
        .catch(err => {
          console.error(`Errore sync Drive per ${file.originalname}:`, err);
        });
    }

    savePhotos(photos);

    res.json({
      success: true,
      message: `${newPhotos.length} foto caricate con successo!`,
      photos: newPhotos
    });

  } catch (err) {
    console.error('Errore durante caricamento:', err);
    res.status(500).json({ error: 'Errore interno durante il caricamento' });
  }
});

// POST Like Photo
app.post('/api/photos/:id/like', (req, res) => {
  const { id } = req.params;
  const photos = getPhotos();
  const photo = photos.find(p => p.id === id);

  if (!photo) {
    return res.status(404).json({ error: 'Foto non trovata' });
  }

  photo.likes = (photo.likes || 0) + 1;
  savePhotos(photos);
  res.json({ success: true, likes: photo.likes });
});

// DELETE Photo (admin protected)
app.delete('/api/photos/:id', (req, res) => {
  const { id } = req.params;
  const { pin } = req.body;
  const config = getConfig();

  if (pin !== config.adminPin) {
    return res.status(403).json({ error: 'PIN Amministratore non valido' });
  }

  const photos = getPhotos();
  const index = photos.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Foto non trovata' });
  }

  const photo = photos[index];
  const filePath = path.join(UPLOADS_DIR, photo.filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.error('Errore cancellazione file fisico:', e);
    }
  }

  photos.splice(index, 1);
  savePhotos(photos);

  res.json({ success: true, message: 'Foto eliminata con successo' });
});

// POST Clear All Photos (admin protected)
app.post('/api/photos/clear-all', (req, res) => {
  const { pin } = req.body;
  const config = getConfig();

  if (pin !== config.adminPin) {
    return res.status(403).json({ error: 'PIN Amministratore non valido' });
  }

  const photos = getPhotos();
  if (photos.length > 0) {
    fs.writeFileSync(path.join(DATA_DIR, 'photos_backup.json'), JSON.stringify(photos, null, 2), 'utf8');
  }

  const files = fs.readdirSync(UPLOADS_DIR);
  files.forEach(f => {
    if (f !== '.gitkeep') {
      try {
        fs.unlinkSync(path.join(UPLOADS_DIR, f));
      } catch (err) {
        console.error('Errore eliminazione file:', f, err);
      }
    }
  });

  savePhotos([]);
  res.json({ success: true, message: 'Galleria svuotata con successo!' });
});

// GET Download All as ZIP
app.get('/api/download-all', (req, res) => {
  const photos = getPhotos();
  if (photos.length === 0) {
    return res.status(400).send('Nessuna foto presente da scaricare.');
  }

  const config = getConfig();
  const zipFileName = `Foto_Laurea_${config.graduateName || 'Federica'}_${new Date().toISOString().slice(0, 10)}.zip`;

  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

  const archive = new ZipArchive({ zlib: { level: 9 } });

  archive.on('error', (err) => {
    console.error('Errore creazione ZIP:', err);
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  // Add each photo to archive with clean name
  photos.forEach((photo, idx) => {
    const filePath = path.join(UPLOADS_DIR, photo.filename);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(photo.originalName || photo.filename) || '.jpg';
      const cleanGuest = (photo.guestName || 'ospite').replace(/[^a-zA-Z0-9]/g, '_');
      const archiveName = `${String(idx + 1).padStart(3, '0')}_${cleanGuest}_${photo.id}${ext}`;
      archive.file(filePath, { name: archiveName });
    }
  });

  archive.finalize();
});

// POST Manual Sync to Google Drive
app.post('/api/sync-drive', async (req, res) => {
  const config = getConfig();
  if (!config.googleScriptUrl || !config.googleScriptUrl.trim()) {
    return res.status(400).json({ error: 'Configura prima l\'URL di Google Apps Script nelle impostazioni!' });
  }

  if (config.googleScriptUrl.includes('/edit') || !config.googleScriptUrl.includes('/exec')) {
    return res.status(400).json({
      error: 'URL non valido: hai inserito il link dell\'editor anziché l\'URL dell\'Applicazione Web (deve finire con /exec). Clicca su "Distribuisci" -> "Nuova distribuzione" su script.google.com!'
    });
  }

  const photos = getPhotos();
  const unsynced = photos.filter(p => !p.driveSynced);

  if (unsynced.length === 0) {
    return res.json({ message: 'Tutte le foto sono già sincronizzate su Google Drive!', count: 0 });
  }

  res.json({
    message: `Avviata sincronizzazione in background per ${unsynced.length} foto!`,
    totalToSync: unsynced.length
  });

  // Background batch sync
  (async () => {
    for (const photo of unsynced) {
      const filePath = path.join(UPLOADS_DIR, photo.filename);
      if (fs.existsSync(filePath)) {
        try {
          const driveRes = await uploadToGoogleDrive(
            filePath,
            photo.originalName || photo.filename,
            photo.mimetype,
            photo.guestName,
            photo.message
          );
          if (driveRes.success) {
            const currentPhotos = getPhotos();
            const target = currentPhotos.find(p => p.id === photo.id);
            if (target) {
              target.driveSynced = true;
              target.driveUrl = driveRes.fileUrl;
              target.driveFileId = driveRes.fileId;
              savePhotos(currentPhotos);
            }
          }
        } catch (err) {
          console.error(`Errore batch sync ${photo.filename}:`, err);
        }
      }
    }
    console.log(' Sincronizzazione batch Google Drive completata.');
  })();
});

// GET Stats
app.get('/api/stats', (req, res) => {
  const photos = getPhotos();
  const config = getConfig();
  const totalPhotos = photos.length;
  const uniqueGuests = new Set(photos.map(p => p.guestName).filter(Boolean)).size;
  const syncedPhotos = photos.filter(p => p.driveSynced).length;
  const totalLikes = photos.reduce((acc, p) => acc + (p.likes || 0), 0);

  let totalBytes = 0;
  photos.forEach(p => {
    totalBytes += (p.size || 0);
  });

  res.json({
    totalPhotos,
    uniqueGuests,
    syncedPhotos,
    totalLikes,
    totalStorageMB: (totalBytes / (1024 * 1024)).toFixed(1),
    hasDrive: Boolean(config.googleScriptUrl && config.googleScriptUrl.trim()),
    driveFolderUrl: config.googleFolderUrl || ''
  });
});

// Start Server with resilient port binding (Port 80 with fallback to 3000)
function startServer(portToTry) {
  const srv = app.listen(portToTry, '0.0.0.0', async () => {
    PORT = portToTry;
    const localIp = getLocalNetworkIp();
    const publicIp = await getPublicIp();
    const cleanLocalUrl = (PORT === 80) ? `http://${localIp}` : `http://${localIp}:${PORT}`;
    const cleanPublicUrl = publicIp ? ((PORT === 80) ? `http://${publicIp}` : `http://${publicIp}:${PORT}`) : null;

    console.log(`\n======================================================`);
    console.log(`🎓 FESTA DI LAUREA - VERO SERVER WEB NATIVO ATTIVO!`);
    console.log(`======================================================`);
    console.log(`💻 Accesso su questo PC:       http://localhost${PORT === 80 ? '' : ':' + PORT}`);
    console.log(`📱 Accesso Wi-Fi (Rete locale):  ${cleanLocalUrl}`);
    if (cleanPublicUrl) {
      console.log(`🌍 Accesso Internet (Router):    ${cleanPublicUrl} (con porta ${PORT} aperta sul router)`);
    }
    console.log(`======================================================\n`);
  });

  srv.on('error', (err) => {
    if ((err.code === 'EACCES' || err.code === 'EADDRINUSE') && portToTry === 80) {
      console.warn(`⚠️ Porta 80 non disponibile (${err.code}). Avvio fallback automatico su porta 3000...`);
      startServer(3000);
    } else {
      console.error('Errore avvio server:', err);
    }
  });

  function handleShutdown(signal) {
    console.log(`\nRicevuto segnale ${signal}. Chiusura del server in corso...`);
    srv.close(() => {
      console.log('Server terminato correttamente.');
      process.exit(0);
    });
  }
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer(PORT);
