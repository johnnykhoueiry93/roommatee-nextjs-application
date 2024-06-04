// encryptionUtils.js

import CryptoJS from 'crypto-js';

const encryptionKey = 'this_Is_m@yAmzigKey'; // Encryption key (must be kept secure)

// Function to encrypt data
export const encryptData = (data) => {
  const dataString = JSON.stringify(data);
  const encryptedData = CryptoJS.AES.encrypt(dataString, encryptionKey).toString();
  return encryptedData;
};

// Function to decrypt data
export const decryptData = (encryptedData) => {
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, encryptionKey).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};
