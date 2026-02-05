#!/usr/bin/env node

/**
 * Admin Password Encryption Utility
 * 
 * This script helps you generate an encrypted admin password for GitHub Secrets.
 * 
 * Usage:
 *   node scripts/encrypt-admin-password.mjs
 * 
 * The script will:
 * 1. Prompt for your admin secret key (or use from .env)
 * 2. Prompt for your desired admin password
 * 3. Output the encrypted password to use in GitHub Secrets
 */

import crypto from 'crypto';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function encryptPassword(password, secretKey) {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(secretKey).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function generateSecretKey() {
  return crypto.randomBytes(32).toString('base64');
}

async function main() {
  console.log('\n🔐 Admin Password Encryption Utility\n');
  console.log('This tool will help you generate the encrypted password for GitHub Secrets.\n');

  // Step 1: Get or generate secret key
  const useNewKey = await question('Do you want to generate a NEW secret key? (y/n): ');
  
  let secretKey;
  if (useNewKey.toLowerCase() === 'y') {
    secretKey = generateSecretKey();
    console.log('\n✅ Generated new secret key:');
    console.log(`   ${secretKey}`);
    console.log('\n⚠️  IMPORTANT: Save this key! You\'ll need it for VITE_ADMIN_SECRET_KEY\n');
  } else {
    secretKey = await question('Enter your VITE_ADMIN_SECRET_KEY: ');
    if (!secretKey || secretKey.length < 32) {
      console.error('\n❌ Error: Secret key must be at least 32 characters long!');
      console.log('   Run again and choose to generate a new key.\n');
      rl.close();
      process.exit(1);
    }
  }

  // Step 2: Get password
  console.log('\n');
  const password = await question('Enter your desired admin password: ');
  
  if (!password || password.length < 8) {
    console.error('\n❌ Error: Password must be at least 8 characters long!\n');
    rl.close();
    process.exit(1);
  }

  // Step 3: Encrypt
  const encryptedPassword = encryptPassword(password, secretKey);

  // Step 4: Display results
  console.log('\n' + '='.repeat(80));
  console.log('✅ SUCCESS! Your encrypted password has been generated.');
  console.log('='.repeat(80));
  
  console.log('\n📋 Add these secrets to GitHub (Settings → Secrets and variables → Actions):\n');
  
  console.log('Secret #1:');
  console.log('-'.repeat(80));
  console.log('Name:  VITE_ADMIN_SECRET_KEY');
  console.log(`Value: ${secretKey}`);
  
  console.log('\nSecret #2:');
  console.log('-'.repeat(80));
  console.log('Name:  VITE_ENCRYPTED_ADMIN_PASSWORD');
  console.log(`Value: ${encryptedPassword}`);
  
  console.log('\n' + '='.repeat(80));
  console.log('\n💾 Don\'t forget to also add to your local .env file for development:');
  console.log(`VITE_ADMIN_SECRET_KEY=${secretKey}`);
  console.log(`VITE_ENCRYPTED_ADMIN_PASSWORD=${encryptedPassword}`);
  console.log('\n');

  rl.close();
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
