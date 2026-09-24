/**
 * =========================================================================
 * GOOGLE APPS SCRIPT PER SALVARE LE FOTO SUL TUO GOOGLE DRIVE
 * =========================================================================
 * 
 * COME CONFIGURARLO IN 2 MINUTI (100% GRATUITO):
 * 
 * 1. Vai su https://script.google.com con il tuo account Google
 * 2. Clicca su "Nuovo progetto" in alto a sinistra
 * 3. Cancella il codice predefinito ed incolla TUTTO questo codice
 * 4. (Opzionale) Se vuoi una cartella specifica, incolla l'ID della cartella Google Drive nella variabile FOLDER_ID qui sotto.
 *    Altrimenti lo script creerà automaticamente una cartella chiamata "Foto Festa di Laurea".
 * 5. Clicca sul pulsante blu in alto a destra "Esegui distribuzione" (Deploy) -> "Nuova distribuzione"
 * 6. Seleziona tipo: "Applicazione web" (Web app)
 *    - Descrizione: Foto Laurea
 *    - Esegui come: "Io" (Me)
 *    - Chi ha accesso: "Chiunque" (Anyone) -> FONDAMENTALE affinché il sito possa caricare le foto!
 * 7. Clicca su "Esegui distribuzione" e autorizza l'accesso con il tuo account Google
 * 8. Copia l'"URL dell'applicazione web" (termina con /exec) e incollalo nelle Impostazioni del sito!
 * =========================================================================
 */

// Se vuoi indicare una cartella specifica di Google Drive, metti qui il suo ID (la parte finale del link della cartella)
var SPECIFIC_FOLDER_ID = ""; // Es: "1a2b3c4d5e6f7g8h9..." oppure lascia vuoto!

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Nessun dato ricevuto"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var folderName = data.folderName || "Foto Festa di Laurea";
    var folder;

    var targetFolderId = (data.folderId && data.folderId.trim() !== "") ? data.folderId.trim() : SPECIFIC_FOLDER_ID;

    if (targetFolderId && targetFolderId.trim() !== "") {
      folder = DriveApp.getFolderById(targetFolderId.trim());
    } else {
      var folders = DriveApp.getFoldersByName(folderName);
      if (folders.hasNext()) {
        folder = folders.next();
      } else {
        folder = DriveApp.createFolder(folderName);
      }
    }

    // Decodifica il file Base64
    var decoded = Utilities.base64Decode(data.base64);
    var filename = data.filename || ("foto_" + new Date().getTime() + ".jpg");
    var mimeType = data.mimeType || "image/jpeg";
    var blob = Utilities.newBlob(decoded, mimeType, filename);

    // Salva il file nella cartella Google Drive
    var file = folder.createFile(blob);

    // Descrizione con metadati dell'ospite
    var desc = "🎓 Festa di Laurea";
    if (data.guestName) {
      desc += "\n📸 Caricata da: " + data.guestName;
    }
    if (data.message) {
      desc += "\n💬 Dedica: " + data.message;
    }
    desc += "\n🕒 Data: " + (data.timestamp || new Date().toLocaleString("it-IT"));
    file.setDescription(desc);

    // Rende il file visualizzabile tramite link se possibile
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch(err) {
      // Ignora limitazioni di domini aziendali
    }

    var response = {
      status: "success",
      fileId: file.getId(),
      fileName: file.getName(),
      fileUrl: file.getUrl(),
      downloadUrl: file.getDownloadUrl(),
      folderUrl: folder.getUrl(),
      folderId: folder.getId()
    };

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "Google Apps Script per Foto Laurea attivo e pronto!"
  })).setMimeType(ContentService.MimeType.JSON);
}
