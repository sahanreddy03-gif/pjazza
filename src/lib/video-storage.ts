/**
 * Video storage — uses IndexedDB for browser persistence.
 * When Supabase is configured, can be extended to upload to Supabase Storage.
 */

const DB_NAME = 'pjazza-videos';
const STORE_NAME = 'recordings';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB only in browser'));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export interface StoredVideo {
  id: string;
  blob?: Blob;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  durationSeconds: number;
}

export async function saveVideo(data: Omit<StoredVideo, 'id'> & { blob: Blob }): Promise<string> {
  const db = await openDB();
  const id = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ ...data, id });
    tx.oncomplete = () => { db.close(); resolve(id); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function getVideos(): Promise<StoredVideo[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => { db.close(); resolve(req.result || []); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

export async function deleteVideo(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}
