// Encrypted admin credentials
// The password is encrypted and must be decrypted using the encryption utility

// SETUP REQUIRED: Before deploying, you must:
// 1. Set VITE_ADMIN_SECRET_KEY in your .env file (used for encryption)
// 2. Generate your encrypted password:
//    - Open browser console
//    - Import encryptPassword from utils/encryption.ts
//    - Run: encryptPassword('your_secure_password')
// 3. Replace 'CHANGE_ME' below with the encrypted output
// 4. Alternatively, use environment variable: import.meta.env.VITE_ENCRYPTED_ADMIN_PASSWORD

export const ENCRYPTED_ADMIN_PASSWORD = import.meta.env.VITE_ENCRYPTED_ADMIN_PASSWORD || 'CHANGE_ME';

if (ENCRYPTED_ADMIN_PASSWORD === 'CHANGE_ME') {
  console.warn('⚠️ WARNING: Admin password not configured! Set VITE_ENCRYPTED_ADMIN_PASSWORD in your .env file.');
}
