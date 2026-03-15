/**
 * Offline Storage Utility with Mock Encryption
 * Manages records saved locally on the device when internet is unavailable.
 */

const STORAGE_KEY = 'STREET_MOBILIZER_OFFLINE_RECORDS';
const ENCRYPTION_SALT = 'STREET_SECURE_2026';

/**
 * Simple mock encryption (Base64 encoding with salt)
 * In production, use Web Crypto API or a library like CryptoJS.
 */
const encrypt = (data) => {
  const str = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(str + ENCRYPTION_SALT)));
};

const decrypt = (encryptedData) => {
  try {
    const decoded = decodeURIComponent(escape(atob(encryptedData)));
    if (!decoded.endsWith(ENCRYPTION_SALT)) return null;
    return JSON.parse(decoded.replace(ENCRYPTION_SALT, ''));
  } catch (e) {
    console.error('Decryption failed:', e);
    return null;
  }
};

export const saveOfflineRecord = (record) => {
  const existing = getOfflineRecords();
  const newRecord = {
    ...record,
    id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    offlineCreatedAt: new Date().toISOString(),
    isSynced: false,
  };
  
  const updated = [...existing, newRecord];
  localStorage.setItem(STORAGE_KEY, encrypt(updated));
  return newRecord;
};

export const getOfflineRecords = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  const decrypted = decrypt(data);
  return decrypted || [];
};

export const clearSyncedRecords = (syncedIds) => {
  const existing = getOfflineRecords();
  const updated = existing.filter(r => !syncedIds.includes(r.id));
  localStorage.setItem(STORAGE_KEY, encrypt(updated));
};

export const removeOfflineRecord = (id) => {
  const existing = getOfflineRecords();
  const updated = existing.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, encrypt(updated));
};
