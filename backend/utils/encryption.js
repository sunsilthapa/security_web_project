// utils/encryption.js
const CryptoJS = require('crypto-js');
const crypto = require('crypto');

const secretKey = process.env.CRYPTO_SECRET_KEY || 'default_secret_key'; // Use an environment variable for the secret key

// Function to encrypt data
const encrypt = (data) => {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
};

// Function to decrypt data
const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};


// Function to hash data (e.g., email)
const hashData = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = { encrypt, decrypt , hashData};
