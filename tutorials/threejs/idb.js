// Простая обёртка для работы с IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ModelGalleryDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('models')) {
        db.createObjectStore('models', { keyPath: 'id', autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function addModelToDB(model) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('models', 'readwrite');
    const store = tx.objectStore('models');
    const req = store.add(model);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function getAllModelsFromDB() {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('models', 'readonly');
    const store = tx.objectStore('models');
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function getModelByIdFromDB(id) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('models', 'readonly');
    const store = tx.objectStore('models');
    const req = store.get(Number(id));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}
