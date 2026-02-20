import { encryptData, decryptData } from "./encryption";

const dbName = "myAppDB";
const storeName = "myStore";

// Open or create the IndexedDB
const openDB = () =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });

// Save encrypted data to IndexedDB
export const saveToDB = async (key, value) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);

  try {
    const encryptedValue = encryptData(value); // Encrypt the data
    store.put({ id: key, value: encryptedValue });

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error("Failed to encrypt and save data:", error);
    throw error;
  }
};

// Retrieve and decrypt data from IndexedDB
export const getFromDB = async (key) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readonly");
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.get(key);

    request.onsuccess = (event) => {
      const result = event.target.result;
      if (result) {
        try {
          const decryptedValue = decryptData(result.value); // Decrypt the data
          resolve(decryptedValue);
        } catch (error) {
          console.error("Failed to decrypt data:", error);
          reject(error);
        }
      } else {
        resolve(null); // No data found
      }
    };

    request.onerror = (event) => reject(event.target.error);
  });
};

// Delete data from IndexedDB
export const deleteFromDB = async (key) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);

  store.delete(key);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
};

// Clear all data from the store
export const clearDB = async () => {
  const db = await openDB();
  const transaction = db.transaction(storeName, "readwrite");
  const store = transaction.objectStore(storeName);

  store.clear();

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = (event) => reject(event.target.error);
  });
};
