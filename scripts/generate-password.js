const SECRET_KEY = '7G3BgpvdAx6398GNDa6HIJ9a/E+d8KpaN0jCe6n58b4=';
const password = 'briiite2025';

let encrypted = '';
for (let i = 0; i < password.length; i++) {
  const charCode = password.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
  encrypted += String.fromCharCode(charCode);
}
const result = Buffer.from(encrypted, 'binary').toString('base64');

console.log('VITE_ENCRYPTED_ADMIN_PASSWORD=' + result);
