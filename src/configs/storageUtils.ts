// src/services/SecurityService.ts
// @ts-ignore
import CryptoJS from 'crypto-js';

export class SecurityService {
  private static instance: SecurityService;
  private secretKey: string;

  private constructor() {
    // Retrieve secret key from environment variables - fail fast if not configured
    const envSecretKey = import.meta.env.VITE_SECRET_KEY;

    if (!envSecretKey) {
      console.warn(
        'VITE_SECRET_KEY environment variable is not set. Using fallback key for development.'
      );
      // Use a fallback key for development
      this.secretKey = 'dev-secret-key-fallback-12345';
    } else {
      this.secretKey = envSecretKey;
    }
  }

  // Singleton access point
  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
      // Clear any corrupted tokens on initialization
      SecurityService.instance.clearCorruptedTokens();
    }
    return SecurityService.instance;
  }

  // Clear corrupted tokens from localStorage
  private clearCorruptedTokens(): void {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Try to decrypt it, if it fails, remove it
        this.decrypt(token);
      }
    } catch (error) {
      console.warn('Clearing corrupted token from localStorage');
      localStorage.removeItem('token');
    }
  }

  // Encrypt the data
  public encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  // Decrypt the data
  public decrypt(cipherText: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.warn('Failed to decrypt data, clearing corrupted token:', error);
      // Clear the corrupted token
      localStorage.removeItem('token');
      return '';
    }
  }

  // Store plain key and encrypted value in localStorage
  public setEncryptedItem(key: string, value: string): void {
    const encryptedValue = this.encrypt(value); // Encrypt the value only
    localStorage.setItem(key, encryptedValue); // Store plain key and encrypted value
  }

  // Retrieve and decrypt value by the plain key
  public getDecryptedItem(key: string): string | null {
    const encryptedValue = localStorage.getItem(key); // Retrieve by plain key
    if (!encryptedValue) return null;

    const decrypted = this.decrypt(encryptedValue);
    return decrypted || null;
  }
}
