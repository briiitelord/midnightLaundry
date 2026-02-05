// Simple encryption/decryption utility using TextEncoder and a secret key
// This provides obfuscation in the source code; for production, use proper cryptography

// IMPORTANT: Set VITE_ADMIN_SECRET_KEY in your .env file before deploying
const SECRET_KEY = import.meta.env.VITE_ADMIN_SECRET_KEY || 'default_key_change_me';

function encryptPassword(password: string): string {
  let encrypted = '';
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    encrypted += String.fromCharCode(charCode);
  }
  return btoa(encrypted); // Base64 encode for safe storage
}

function decryptPassword(encrypted: string): string {
  try {
    const decoded = atob(encrypted); // Base64 decode
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      decrypted += String.fromCharCode(charCode);
    }
    return decrypted;
  } catch (error) {
    console.error('Failed to decrypt password:', error);
    return '';
  }
}

export { encryptPassword, decryptPassword };
