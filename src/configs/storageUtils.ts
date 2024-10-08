// src/services/SecurityService.ts
import CryptoJS from 'crypto-js';

export class SecurityService  {
  private static instance: SecurityService;
  private secretKey: string;

  private constructor() {
    // Retrieve secret key from environment variables or use default
    this.secretKey = process.env.VITE_SECRET_KEY || 'secretKey';
  }

  // Singleton access point
  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Encrypt the data
  public encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  // Decrypt the data
  public decrypt(cipherText: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Store plain key and encrypted value in localStorage
  public setEncryptedItem(key: string, value: string): void {
    const encryptedValue = this.encrypt(value); // Encrypt the value only
    localStorage.setItem(key, encryptedValue); // Store plain key and encrypted value
  }

  // Retrieve and decrypt value by the plain key
  public getDecryptedItem(key: string): string | null {
    const encryptedValue = localStorage.getItem(key); // Retrieve by plain key
    return encryptedValue ? this.decrypt(encryptedValue) : null;
  }
}
