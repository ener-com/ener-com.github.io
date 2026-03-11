#!/usr/bin/env node

/**
 * ============================================================
 *  Enercom – Local development build
 * ============================================================
 *
 * Loads .env file and runs the main build script.
 *
 * Usage:
 *   node scripts/build-local.js
 *
 * Prerequisites:
 *   1. Copy .env.example to .env
 *   2. Fill in your real values
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const envFile = path.resolve(__dirname, '..', '.env');

if (!fs.existsSync(envFile)) {
    console.error('❌  .env file not found!');
    console.error('   Copy .env.example to .env and fill in your values.');
    process.exit(1);
}

// Parse .env file and set environment variables
const envContent = fs.readFileSync(envFile, 'utf-8');
for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.substring(0, eqIdx).trim();
    const value = trimmed.substring(eqIdx + 1).trim();
    process.env[key] = value;
}

console.log('📂  Loaded .env variables');
console.log('🔨  Running build...\n');

// Run the main build script
require('./build.js');
