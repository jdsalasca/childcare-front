// src/storageUtils.ts
import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_LOCAL_STORAGE_KEY as string; // Use environment variable

export const encrypt = (data: string): string => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decrypt = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Store encrypted data
export const setEncryptedItem = (key: string, value: string): void => {
  const encryptedValue = encrypt(value);
  localStorage.setItem(key, encryptedValue);
};

// Retrieve and decrypt data
export const getDecryptedItem = (key: string): string | null => {
  const encryptedValue = localStorage.getItem(key);
  return encryptedValue ? decrypt(encryptedValue) : null;
};
