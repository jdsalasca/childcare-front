// src/storageUtils.js
import CryptoJS from 'crypto-js';

const secretKey = process.env.REACT_APP_LOCAL_STORAGE_KEY; // Use environment variable

export const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

export const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Store encrypted data
export const setEncryptedItem = (key, value) => {
  const encryptedValue = encrypt(value);
  localStorage.setItem(key, encryptedValue);
};

// Retrieve and decrypt data
export const getDecryptedItem = (key) => {
  const encryptedValue = localStorage.getItem(key);
  return encryptedValue ? decrypt(encryptedValue) : null;
};
