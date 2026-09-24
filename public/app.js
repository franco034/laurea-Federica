/**
 * ==========================================================================
 * FESTA DI LAUREA - CLIENT APPLICATION
 * Handles: Photo Uploads, Multi-preview, Google Drive Cloud Sync,
 * Live Gallery, Lightbox, QR Code Generator & Admin Settings.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  const state = {
    config: null,
    photos: [],
    selectedFiles: [],
    currentFilter: 'all',
    lightboxIndex: 0,
    likedPhotoIds: new Set(JSON.parse(localStorage.getItem('fede_liked_photos') || '[]')),
    guestName: localStorage.getItem('fede_guest_name') || ''
  };

  // DOM Elements
  const elements = {
    // Header & Hero
    navTitle: document.getElementById('navTitle'),
    navSubtitle: document.getElementById('navSubtitle'),
    heroEventTitle: document.getElementById('heroEventTitle'),
    heroDegreeCourse: document.getElementById('heroDegreeCourse'),
    heroWelcomeMessage: document.getElementById('heroWelcomeMessage'),
    btnOpenQr: document.getElementById('btnOpenQr'),
    btnOpenDrive: document.getElementById('btnOpenDrive'),
    btnOpenSettings: document.getElementById('btnOpenSettings'),
    footerBtnQr: document.getElementById('footerBtnQr'),

    // Stats
    statPhotos: document.getElementById('statPhotos'),
    statGuests: document.getElementById('statGuests'),
    statLikes: document.getElementById('statLikes'),
    statDriveStatus: document.getElementById('statDriveStatus'),
    driveStatusPill: document.getElementById('driveStatusPill'),

    // Upload Form
    uploadForm: document.getElementById('uploadForm'),
    guestNameInput: document.getElementById('guestNameInput'),
    messageInput: document.getElementById('messageInput'),
    fileCameraInput: document.getElementById('fileCameraInput'),
    fileGalleryInput: document.getElementById('fileGalleryInput'),
    dropzone: document.getElementById('dropzone'),
    btnTriggerCamera: document.getElementById('btnTriggerCamera'),
    btnTriggerGallery: document.getElementById('btnTriggerGallery'),

    // Preview
    previewContainer: document.getElementById('previewContainer'),
    previewGrid: document.getElementById('previewGrid'),
    previewCount: document.getElementById('previewCount'),
    btnClearPreview: document.getElementById('btnClearPreview'),
    btnSubmitUpload: document.getElementById('btnSubmitUpload'),

    // Progress
    uploadProgressWrapper: document.getElementById('uploadProgressWrapper'),
    progressBarFill: document.getElementById('progressBarFill'),
    progressStatusText: document.getElementById('progressStatusText'),
    progressPercent: document.getElementById('progressPercent'),

    // Gallery
    photoGrid: document.getElementById('photoGrid'),
    emptyState: document.getElementById('emptyState'),
    countAll: document.getElementById('countAll'),
    filterTabs: document.querySelectorAll('.filter-tab'),

    // Lightbox
    lightboxModal: document.getElementById('lightboxModal'),
    lightboxImg: document.getElementById('lightboxImg'),
    lightboxAuthor: document.getElementById('lightboxAuthor'),
    lightboxTime: document.getElementById('lightboxTime'),
    lightboxDedication: document.getElementById('lightboxDedication'),
    lightboxLikeCount: document.getElementById('lightboxLikeCount'),
    btnLightboxLike: document.getElementById('btnLightboxLike'),
    btnLightboxDownload: document.getElementById('btnLightboxDownload'),
    btnLightboxDriveLink: document.getElementById('btnLightboxDriveLink'),
    btnCloseLightbox: document.getElementById('btnCloseLightbox'),
    btnLightboxPrev: document.getElementById('btnLightboxPrev'),
    btnLightboxNext: document.getElementById('btnLightboxNext'),

    // QR Modal
    qrModal: document.getElementById('qrModal'),
    btnCloseQr: document.getElementById('btnCloseQr'),
    qrCanvas: document.getElementById('qrCanvas'),
    qrPrintTitle: document.getElementById('qrPrintTitle'),
    qrTextUrl: document.getElementById('qrTextUrl'),
    btnPrintQr: document.getElementById('btnPrintQr'),
    btnCopyUrl: document.getElementById('btnCopyUrl'),

    // Settings Modal
    settingsModal: document.getElementById('settingsModal'),
    btnCloseSettings: document.getElementById('btnCloseSettings'),
    settingsForm: document.getElementById('settingsForm'),
    cfgScriptUrl: document.getElementById('cfgScriptUrl'),
    cfgFolderUrl: document.getElementById('cfgFolderUrl'),
    cfgGraduateName: document.getElementById('cfgGraduateName'),
    cfgDegreeCourse: document.getElementById('cfgDegreeCourse'),
    cfgPartyDate: document.getElementById('cfgPartyDate'),
    cfgAdminPin: document.getElementById('cfgAdminPin'),
    cfgWelcomeMessage: document.getElementById('cfgWelcomeMessage'),
    btnCopyScriptCode: document.getElementById('btnCopyScriptCode'),
    btnSyncDriveManual: document.getElementById('btnSyncDriveManual'),
    syncStatusMsg: document.getElementById('syncStatusMsg'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  // Restore remembered guest name
  if (state.guestName) {
    elements.guestNameInput.value = state.guestName;
  }

  // -------------------------------------------------------------
  // TOAST NOTIFICATIONS
  // -------------------------------------------------------------
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✨' : '⚠️';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // -------------------------------------------------------------
  // INITIALIZATION & API FETCH
  // -------------------------------------------------------------
  async function loadConfig() {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      state.config = data;

      // Update UI with config
      elements.navTitle.textContent = data.eventTitle || 'Festa di Laurea';
      elements.heroEventTitle.textContent = data.eventTitle || 'Festa di Laurea';
      elements.heroDegreeCourse.textContent = data.degreeCourse || '';
      elements.heroWelcomeMessage.textContent = data.welcomeMessage || '';
      elements.qrPrintTitle.textContent = data.eventTitle || 'Festa di Laurea';

      // Update Drive Status
      if (data.hasDriveConfigured) {
        elements.statDriveStatus.textContent = 'Attivo';
        elements.statDriveStatus.style.color = '#10b981';
      } else {
        elements.statDriveStatus.textContent = 'Locale';
        elements.statDriveStatus.style.color = '#f59e0b';
      }

      // Drive folder link
      elements.btnOpenDrive.onclick = () => {
        if (data.googleFolderUrl) {
          window.open(data.googleFolderUrl, '_blank');
        } else {
          showToast('Configura il link della cartella Google Drive nelle Impostazioni!', 'error');
          openSettingsModal();
        }
      };

      // Populate settings form
      elements.cfgScriptUrl.value = data.googleScriptUrl || '';
      elements.cfgFolderUrl.value = data.googleFolderUrl || '';
      elements.cfgGraduateName.value = data.graduateName || '';
      elements.cfgDegreeCourse.value = data.degreeCourse || '';
      elements.cfgPartyDate.value = data.partyDate || '';
      elements.cfgWelcomeMessage.value = data.welcomeMessage || '';

    } catch (err) {
      console.error('Errore caricamento configurazione:', err);
    }
  }

  async function loadPhotos(silent = false) {
    try {
      const res = await fetch('/api/photos');
      const data = await res.json();
      state.photos = data;
      renderGallery();
      updateStats();
      if (!silent && data.length > 0) {
        console.log(`Caricate ${data.length} foto`);
      }
    } catch (err) {
      console.error('Errore caricamento foto:', err);
    }
  }

  async function updateStats() {
    try {
      const res = await fetch('/api/stats');
      const stats = await res.json();
      elements.statPhotos.textContent = stats.totalPhotos;
      elements.statGuests.textContent = stats.uniqueGuests;
      elements.statLikes.textContent = stats.totalLikes;
      elements.countAll.textContent = stats.totalPhotos;
    } catch (err) {
      // Fallback local calc
      elements.statPhotos.textContent = state.photos.length;
      elements.countAll.textContent = state.photos.length;
    }
  }

  // -------------------------------------------------------------
  // FILE SELECTION & PREVIEW
  // -------------------------------------------------------------
  elements.btnTriggerCamera.addEventListener('click', () => elements.fileCameraInput.click());
  elements.btnTriggerGallery.addEventListener('click', () => elements.fileGalleryInput.click());

  elements.fileCameraInput.addEventListener('change', (e) => handleFileSelection(e.target.files));
  elements.fileGalleryInput.addEventListener('change', (e) => handleFileSelection(e.target.files));

  // Drag and drop
  ['dragenter', 'dragover'].forEach(eventName => {
    elements.dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      elements.dropzone.classList.add('drag-active');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    elements.dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      elements.dropzone.classList.remove('drag-active');
    });
  });

  elements.dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFileSelection(e.dataTransfer.files);
    }
  });

  function handleFileSelection(filesList) {
    if (!filesList || filesList.length === 0) return;

    for (const file of Array.from(filesList)) {
      if (file.type.startsWith('image/')) {
        // Evita duplicati identici se già presenti
        const isDuplicate = state.selectedFiles.some(f => f.name === file.name && f.size === file.size);
        if (!isDuplicate) {
          state.selectedFiles.push(file);
        }
      }
    }

    renderPreviews();
  }

  function renderPreviews() {
    elements.previewGrid.innerHTML = '';
    const count = state.selectedFiles.length;

    if (count === 0) {
      elements.previewContainer.style.display = 'none';
      return;
    }

    elements.previewContainer.style.display = 'block';
    elements.previewCount.textContent = `${count} foto ${count === 1 ? 'selezionata' : 'selezionate'}`;

    state.selectedFiles.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'preview-item';

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      img.alt = file.name;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'preview-remove-btn';
      removeBtn.innerHTML = '✕';
      removeBtn.type = 'button';
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        state.selectedFiles.splice(index, 1);
        renderPreviews();
      };

      item.appendChild(img);
      item.appendChild(removeBtn);
      elements.previewGrid.appendChild(item);
    });
  }

  elements.btnClearPreview.addEventListener('click', () => {
    state.selectedFiles = [];
    elements.fileCameraInput.value = '';
    elements.fileGalleryInput.value = '';
    renderPreviews();
  });

  // -------------------------------------------------------------
  // UPLOAD FORM SUBMIT
  // -------------------------------------------------------------
  elements.uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (state.selectedFiles.length === 0) {
      showToast('Seleziona o scatta almeno una foto prima di inviare!', 'error');
      return;
    }

    const guestName = elements.guestNameInput.value.trim() || 'Ospite';
    const message = elements.messageInput.value.trim();

    // Salva il nome per prossimi invii
    localStorage.setItem('fede_guest_name', guestName);
    state.guestName = guestName;

    // Prepara FormData
    const formData = new FormData();
    formData.append('guestName', guestName);
    formData.append('message', message);
    state.selectedFiles.forEach(file => {
      formData.append('photos', file);
    });

    // UI Progress
    elements.uploadProgressWrapper.style.display = 'block';
    elements.progressBarFill.style.width = '0%';
    elements.progressPercent.textContent = '0%';
    elements.progressStatusText.textContent = 'Caricamento foto e sincronizzazione con Google Drive...';
    elements.btnSubmitUpload.disabled = true;

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          elements.progressBarFill.style.width = `${percent}%`;
          elements.progressPercent.textContent = `${percent}%`;
          if (percent === 100) {
            elements.progressStatusText.textContent = 'Elaborazione e salvataggio sul cloud...';
          }
        }
      };

      xhr.onload = function () {
        elements.btnSubmitUpload.disabled = false;
        elements.uploadProgressWrapper.style.display = 'none';

        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          
          // Trigger Confetti!
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }

          showToast(`${response.photos.length} foto caricate con successo! 🎓`);

          // Reset preview and message (keep name for convenience)
          state.selectedFiles = [];
          elements.messageInput.value = '';
          elements.fileCameraInput.value = '';
          elements.fileGalleryInput.value = '';
          renderPreviews();

          // Refresh gallery
          loadPhotos(true);

          // Scroll gently to the newly added photos
          setTimeout(() => {
            elements.photoGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);

        } else {
          showToast('Errore durante il caricamento delle foto.', 'error');
        }
      };

      xhr.onerror = function () {
        elements.btnSubmitUpload.disabled = false;
        elements.uploadProgressWrapper.style.display = 'none';
        showToast('Errore di connessione di rete.', 'error');
      };

      xhr.send(formData);

    } catch (err) {
      elements.btnSubmitUpload.disabled = false;
      elements.uploadProgressWrapper.style.display = 'none';
      showToast('Errore: ' + err.message, 'error');
    }
  });

  // -------------------------------------------------------------
  // GALLERY RENDERING & FILTERS
  // -------------------------------------------------------------
  elements.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.currentFilter = tab.getAttribute('data-filter');
      renderGallery();
    });
  });

  function getFilteredPhotos() {
    let list = [...state.photos];
    if (state.currentFilter === 'dedications') {
      list = list.filter(p => p.message && p.message.trim() !== '');
    } else if (state.currentFilter === 'popular') {
      list = list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }
    return list;
  }

  function renderGallery() {
    const filtered = getFilteredPhotos();
    elements.photoGrid.innerHTML = '';

    if (filtered.length === 0) {
      elements.emptyState.style.display = 'block';
      return;
    }

    elements.emptyState.style.display = 'none';

    filtered.forEach((photo) => {
      const card = document.createElement('div');
      card.className = 'photo-card';

      const isLiked = state.likedPhotoIds.has(photo.id);
      const timeFormatted = formatTimeAgo(photo.createdAt);

      const driveBadgeHtml = photo.driveSynced
        ? `<div class="card-drive-badge synced" title="Archiviata su Google Drive">☁️ Drive</div>`
        : `<div class="card-drive-badge" title="Archiviata in locale">💾 Locale</div>`;

      card.innerHTML = `
        <div class="card-img-wrapper" data-id="${photo.id}">
          <img src="${photo.url}" alt="Foto di ${escapeHtml(photo.guestName)}" class="card-img" loading="lazy">
          ${driveBadgeHtml}
        </div>
        <div class="card-body">
          <div class="card-header">
            <span class="card-author">
              <span>📸</span> ${escapeHtml(photo.guestName || 'Ospite')}
            </span>
            <span class="card-time">${timeFormatted}</span>
          </div>
          ${photo.message ? `<div class="card-message">"${escapeHtml(photo.message)}"</div>` : ''}
          <div class="card-footer">
            <button class="btn-card-like ${isLiked ? 'liked' : ''}" data-id="${photo.id}">
              <span>${isLiked ? '❤️' : '🤍'}</span>
              <span class="like-count">${photo.likes || 0}</span>
            </button>
            <a href="${photo.url}" download="${photo.originalName || 'foto.jpg'}" class="btn-card-download" title="Scarica foto">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </a>
          </div>
        </div>
      `;

      // Click to open Lightbox
      card.querySelector('.card-img-wrapper').addEventListener('click', () => {
        const indexInAll = state.photos.findIndex(p => p.id === photo.id);
        openLightbox(indexInAll);
      });

      // Like Button Event
      const likeBtn = card.querySelector('.btn-card-like');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLike(photo.id, likeBtn);
      });

      elements.photoGrid.appendChild(card);
    });
  }

  async function toggleLike(photoId, btnElement) {
    if (state.likedPhotoIds.has(photoId)) {
      showToast('Hai già lasciato un cuoricino a questa foto! ❤️');
      return;
    }

    try {
      const res = await fetch(`/api/photos/${photoId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        state.likedPhotoIds.add(photoId);
        localStorage.setItem('fede_liked_photos', JSON.stringify(Array.from(state.likedPhotoIds)));

        const target = state.photos.find(p => p.id === photoId);
        if (target) target.likes = data.likes;

        if (btnElement) {
          btnElement.classList.add('liked');
          btnElement.querySelector('span').textContent = '❤️';
          btnElement.querySelector('.like-count').textContent = data.likes;
        }

        if (elements.lightboxModal.open && state.photos[state.lightboxIndex]?.id === photoId) {
          elements.lightboxLikeCount.textContent = data.likes;
        }

        updateStats();
      }
    } catch (err) {
      console.error('Errore like:', err);
    }
  }

  // -------------------------------------------------------------
  // LIGHTBOX
  // -------------------------------------------------------------
  function openLightbox(index) {
    if (index < 0 || index >= state.photos.length) return;
    state.lightboxIndex = index;
    const photo = state.photos[index];

    elements.lightboxImg.src = photo.url;
    elements.lightboxAuthor.textContent = photo.guestName || 'Ospite';
    elements.lightboxTime.textContent = formatTimeAgo(photo.createdAt);
    elements.lightboxLikeCount.textContent = photo.likes || 0;
    elements.btnLightboxDownload.href = photo.url;
    elements.btnLightboxDownload.setAttribute('download', photo.originalName || 'foto.jpg');

    if (photo.driveUrl) {
      elements.btnLightboxDriveLink.style.display = 'flex';
      elements.btnLightboxDriveLink.href = photo.driveUrl;
    } else {
      elements.btnLightboxDriveLink.style.display = 'none';
    }

    if (photo.message) {
      elements.lightboxDedication.style.display = 'block';
      elements.lightboxDedication.textContent = `"${photo.message}"`;
    } else {
      elements.lightboxDedication.style.display = 'none';
    }

    elements.lightboxModal.showModal();
  }

  elements.btnCloseLightbox.addEventListener('click', () => elements.lightboxModal.close());
  elements.lightboxModal.addEventListener('click', (e) => {
    if (e.target === elements.lightboxModal) elements.lightboxModal.close();
  });

  elements.btnLightboxPrev.addEventListener('click', () => {
    let nextIdx = state.lightboxIndex - 1;
    if (nextIdx < 0) nextIdx = state.photos.length - 1;
    openLightbox(nextIdx);
  });

  elements.btnLightboxNext.addEventListener('click', () => {
    let nextIdx = state.lightboxIndex + 1;
    if (nextIdx >= state.photos.length) nextIdx = 0;
    openLightbox(nextIdx);
  });

  elements.btnLightboxLike.addEventListener('click', () => {
    const photo = state.photos[state.lightboxIndex];
    if (photo) toggleLike(photo.id);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!elements.lightboxModal.open) return;
    if (e.key === 'ArrowLeft') elements.btnLightboxPrev.click();
    if (e.key === 'ArrowRight') elements.btnLightboxNext.click();
    if (e.key === 'Escape') elements.lightboxModal.close();
  });

  // -------------------------------------------------------------
  // QR CODE MODAL
  // -------------------------------------------------------------
  function openQrModal() {
    const currentOrigin = window.location.origin;
    // Prefer network IP if user connects through localhost but wants guests to scan
    let targetUrl = currentOrigin;
    if (state.config && state.config.networkUrl && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      targetUrl = state.config.networkUrl;
    }

    elements.qrTextUrl.textContent = targetUrl;

    if (typeof QRCode !== 'undefined' && elements.qrCanvas) {
      QRCode.toCanvas(elements.qrCanvas, targetUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (err) => {
        if (err) console.error('Errore creazione QR Code:', err);
      });
    }

    elements.qrModal.showModal();
  }

  elements.btnOpenQr.addEventListener('click', openQrModal);
  elements.footerBtnQr.addEventListener('click', openQrModal);
  elements.btnCloseQr.addEventListener('click', () => elements.qrModal.close());
  elements.qrModal.addEventListener('click', (e) => {
    if (e.target === elements.qrModal) elements.qrModal.close();
  });

  elements.btnPrintQr.addEventListener('click', () => window.print());

  elements.btnCopyUrl.addEventListener('click', () => {
    const url = elements.qrTextUrl.textContent;
    navigator.clipboard.writeText(url)
      .then(() => showToast('Link copiato negli appunti!'))
      .catch(() => showToast('Impossibile copiare il link.', 'error'));
  });

  // -------------------------------------------------------------
  // SETTINGS & CLOUD MODAL
  // -------------------------------------------------------------
  function openSettingsModal() {
    elements.settingsModal.showModal();
  }

  elements.btnOpenSettings.addEventListener('click', openSettingsModal);
  elements.btnCloseSettings.addEventListener('click', () => elements.settingsModal.close());
  elements.settingsModal.addEventListener('click', (e) => {
    if (e.target === elements.settingsModal) elements.settingsModal.close();
  });

  // Copy Google Apps Script Code
  elements.btnCopyScriptCode.addEventListener('click', async () => {
    try {
      const res = await fetch('/google-apps-script.js');
      const scriptText = await res.text();
      await navigator.clipboard.writeText(scriptText);
      showToast('Codice Google Apps Script copiato negli appunti! Incollalo in script.google.com 📋');
    } catch (err) {
      showToast('Copia manuale dal file google-apps-script.js', 'error');
    }
  });

  // Manual Sync to Google Drive
  elements.btnSyncDriveManual.addEventListener('click', async () => {
    elements.syncStatusMsg.textContent = 'Avvio sincronizzazione...';
    try {
      const res = await fetch('/api/sync-drive', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        elements.syncStatusMsg.textContent = data.message;
        showToast(data.message);
        setTimeout(() => loadPhotos(true), 3000);
      } else {
        elements.syncStatusMsg.textContent = data.error || 'Errore sincronizzazione';
        showToast(data.error || 'Errore', 'error');
      }
    } catch (err) {
      elements.syncStatusMsg.textContent = 'Errore di rete';
    }
  });

  // Clear Gallery Button in Settings
  const btnClearGallery = document.getElementById('btnClearGallery');
  if (btnClearGallery) {
    btnClearGallery.addEventListener('click', async () => {
      const pin = prompt('Inserisci il PIN Amministratore (Predefinito: 1234) per confermare:');
      if (!pin) return;

      if (!confirm('Sei sicuro di voler eliminare tutte le foto dal sito? (Le foto già salvate su Google Drive rimarranno al sicuro sul tuo Drive)')) {
        return;
      }

      try {
        const res = await fetch('/api/photos/clear-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: pin.trim() })
        });
        const data = await res.json();
        if (res.ok) {
          showToast(data.message || 'Galleria svuotata!');
          elements.settingsModal.close();
          loadPhotos();
        } else {
          showToast(data.error || 'Errore durante la cancellazione', 'error');
        }
      } catch (err) {
        showToast('Errore: ' + err.message, 'error');
      }
    });
  }

  // Live Script URL Validation
  const urlWarningBox = document.getElementById('urlWarningBox');
  const scriptUrlStatus = document.getElementById('scriptUrlStatus');

  elements.cfgScriptUrl.addEventListener('input', () => {
    validateScriptUrl(elements.cfgScriptUrl.value);
  });

  function validateScriptUrl(val) {
    const trimmed = (val || '').trim();
    if (!trimmed) {
      if (urlWarningBox) urlWarningBox.style.display = 'none';
      if (scriptUrlStatus) scriptUrlStatus.textContent = '';
      return true;
    }

    if (trimmed.includes('/edit')) {
      if (urlWarningBox) {
        urlWarningBox.style.display = 'block';
        urlWarningBox.innerHTML = '❌ <strong>Link dell\'Editor Rilevato!</strong> Hai incollato il link di modifica del codice. Clicca in alto a destra su <strong>"Distribuisci" (Deploy) ➔ "Nuova distribuzione" ➔ "Applicazione web"</strong> e copia il link finale che termina con <strong>/exec</strong>.';
      }
      if (scriptUrlStatus) {
        scriptUrlStatus.textContent = '❌ Link non valido (/edit)';
        scriptUrlStatus.style.color = '#ef4444';
      }
      return false;
    } else if (trimmed.includes('/exec')) {
      if (urlWarningBox) urlWarningBox.style.display = 'none';
      if (scriptUrlStatus) {
        scriptUrlStatus.textContent = '✓ URL Web App Valido';
        scriptUrlStatus.style.color = '#10b981';
      }
      return true;
    } else {
      if (urlWarningBox) {
        urlWarningBox.style.display = 'block';
        urlWarningBox.innerHTML = '⚠️ <strong>Attenzione</strong>: l\'URL dell\'Applicazione Web Google Apps Script deve terminare con <strong>/exec</strong>.';
      }
      if (scriptUrlStatus) {
        scriptUrlStatus.textContent = '⚠️ Controlla URL';
        scriptUrlStatus.style.color = '#f59e0b';
      }
      return true;
    }
  }

  // Save Settings
  elements.settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const scriptUrlInput = elements.cfgScriptUrl.value.trim();
    if (scriptUrlInput && scriptUrlInput.includes('/edit')) {
      showToast('Il link inserito è l\'editor (/edit). Devi usare l\'URL di distribuzione (/exec)!', 'error');
      validateScriptUrl(scriptUrlInput);
      return;
    }

    const pin = elements.cfgAdminPin.value.trim();
    if (!pin) {
      showToast('Inserisci il PIN per salvare (Predefinito: 1234)', 'error');
      return;
    }

    const payload = {
      pin: pin,
      googleScriptUrl: elements.cfgScriptUrl.value.trim(),
      googleFolderUrl: elements.cfgFolderUrl.value.trim(),
      graduateName: elements.cfgGraduateName.value.trim(),
      degreeCourse: elements.cfgDegreeCourse.value.trim(),
      partyDate: elements.cfgPartyDate.value,
      welcomeMessage: elements.cfgWelcomeMessage.value.trim(),
      eventTitle: `Festa di Laurea di ${elements.cfgGraduateName.value.trim() || 'Federico'}`
    };

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Impostazioni salvate con successo! ✨');
        elements.settingsModal.close();
        loadConfig();
      } else {
        showToast(data.error || 'PIN non corretto', 'error');
      }
    } catch (err) {
      showToast('Errore nel salvataggio: ' + err.message, 'error');
    }
  });

  // -------------------------------------------------------------
  // UTILITY HELPERS
  // -------------------------------------------------------------
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function formatTimeAgo(isoString) {
    if (!isoString) return 'Poco fa';
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Proprio ora';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min fa`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} ore fa`;

    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  // -------------------------------------------------------------
  // MOBILE ENHANCEMENTS: FAB & SWIPE GESTURES
  // -------------------------------------------------------------
  const mobileFab = document.getElementById('mobileFab');
  if (mobileFab) {
    mobileFab.addEventListener('click', () => {
      const uploadSection = document.querySelector('.upload-section');
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          if (!elements.guestNameInput.value.trim()) {
            elements.guestNameInput.focus();
          } else {
            elements.btnTriggerCamera.click();
          }
        }, 400);
      }
    });

    // Reveal floating button only after scrolling down
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        mobileFab.style.opacity = '1';
        mobileFab.style.pointerEvents = 'auto';
        mobileFab.style.transform = 'translateY(0)';
      } else {
        mobileFab.style.opacity = '0';
        mobileFab.style.pointerEvents = 'none';
        mobileFab.style.transform = 'translateY(20px)';
      }
    }, { passive: true });
  }

  // Lightbox Touch Swipe for Mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (elements.lightboxModal) {
    elements.lightboxModal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    elements.lightboxModal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          elements.btnLightboxPrev.click();
        } else {
          elements.btnLightboxNext.click();
        }
      }
    }, { passive: true });
  }

  // -------------------------------------------------------------
  // STARTUP & POLLING
  // -------------------------------------------------------------
  loadConfig();
  loadPhotos();

  // Poll for new photos uploaded by other guests during the party every 15 seconds
  setInterval(() => {
    loadPhotos(true);
  }, 15000);
});
