/**
 * El service worker no puede usar localStorage. Guardamos el access token en IndexedDB
 * para que los clics en acciones de notificaciones (Posponer / Listo) puedan llamar al API con Bearer.
 */
const DB_NAME = 'asistente-sw-auth';
const DB_VERSION = 1;
const STORE = 'kv';
const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

export async function syncAccessTokenForServiceWorker(accessToken, refreshToken) {
  if (!accessToken && !refreshToken) return;
  const db = await openDb();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      if (accessToken) tx.objectStore(STORE).put(accessToken, ACCESS_KEY);
      if (refreshToken) tx.objectStore(STORE).put(refreshToken, REFRESH_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export async function clearAccessTokenForServiceWorker() {
  try {
    const db = await openDb();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(ACCESS_KEY);
        tx.objectStore(STORE).delete(REFRESH_KEY);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  } catch {
    /* sin BD aún */
  }
}

export async function getAccessTokenForServiceWorker() {
  try {
    const db = await openDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const getReq = tx.objectStore(STORE).get(ACCESS_KEY);
        getReq.onsuccess = () => resolve(getReq.result ?? null);
        getReq.onerror = () => reject(getReq.error);
      });
    } finally {
      db.close();
    }
  } catch {
    return null;
  }
}

export async function getRefreshTokenForServiceWorker() {
  try {
    const db = await openDb();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const getReq = tx.objectStore(STORE).get(REFRESH_KEY);
        getReq.onsuccess = () => resolve(getReq.result ?? null);
        getReq.onerror = () => reject(getReq.error);
      });
    } finally {
      db.close();
    }
  } catch {
    return null;
  }
}
