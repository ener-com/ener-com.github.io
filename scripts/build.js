#!/usr/bin/env node

/**
 * ============================================================
 *  Enercom – Build-time Secrets Injection Script
 * ============================================================
 *
 * This script reads index.html, replaces __PLACEHOLDER__ tokens
 * with values from environment variables, and writes the result
 * to the dist/ folder ready for deployment.
 *
 * It also Base64-encodes sensitive runtime values (phone, URLs)
 * into a <script> block so they are NOT in plain text in the
 * deployed HTML — they are decoded only at runtime in the browser.
 *
 * Usage:
 *   node scripts/build.js
 *
 * Required env vars (set via GitHub Secrets):
 *   PHONE_NUMBER       – e.g. 521234567890
 *   PHONE_DISPLAY      – e.g. +52 123 456 7890
 *   WHATSAPP_MSG       – URL-encoded WhatsApp message
 *   FACEBOOK_SLUG      – e.g. MyPageName
 *   FACEBOOK_HANDLE    – e.g. @MyPageName
 *   GA_ID              – e.g. G-XXXXXXXXXX
 *   FB_PIXEL_ID        – Facebook Pixel ID
 *   FORMSPREE_ID       – Formspree form ID (just the hash)
 */

const fs = require('fs');
const path = require('path');

// --------------- Helpers ---------------
function envOrDie(name) {
    const v = process.env[name];
    if (!v) {
        console.error(`❌  Missing required env var: ${name}`);
        process.exit(1);
    }
    return v;
}

function b64(str) {
    return Buffer.from(str, 'utf-8').toString('base64');
}

// --------------- Read env vars ---------------
const PHONE_NUMBER    = envOrDie('PHONE_NUMBER');
const PHONE_DISPLAY   = envOrDie('PHONE_DISPLAY');
const WHATSAPP_MSG    = envOrDie('WHATSAPP_MSG');
const FACEBOOK_SLUG   = envOrDie('FACEBOOK_SLUG');
const FACEBOOK_HANDLE = envOrDie('FACEBOOK_HANDLE');
const GA_ID           = envOrDie('GA_ID');
const FB_PIXEL_ID     = envOrDie('FB_PIXEL_ID');
const FORMSPREE_ID    = envOrDie('FORMSPREE_ID');

// --------------- Derived values ---------------
const WHATSAPP_URL  = `https://wa.me/${PHONE_NUMBER}?text=${WHATSAPP_MSG}`;
const FACEBOOK_URL  = `https://facebook.com/${FACEBOOK_SLUG}`;
const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;
const PHONE_INTL    = `+${PHONE_NUMBER}`;

// --------------- Placeholder map ---------------
// These are simple string replacements in the HTML source.
const replacements = {
    '__WHATSAPP_URL__' : WHATSAPP_URL,
    '__FACEBOOK_URL__' : FACEBOOK_URL,
    '__FORMSPREE_URL__': FORMSPREE_URL,
    '__GA_ID__'        : GA_ID,
    '__FB_PIXEL_ID__'  : FB_PIXEL_ID,
    '__PHONE_INTL__'   : PHONE_INTL,
    '__PHONE_DISPLAY__': PHONE_DISPLAY,
    '__FACEBOOK_HANDLE__': FACEBOOK_HANDLE,
};

// --------------- Build ---------------
const SRC  = path.resolve(__dirname, '..', 'index.html');
const DIST = path.resolve(__dirname, '..', 'dist');

// Ensure dist directory exists
if (!fs.existsSync(DIST)) {
    fs.mkdirSync(DIST, { recursive: true });
}

let html = fs.readFileSync(SRC, 'utf-8');

// Apply all placeholder replacements
for (const [placeholder, value] of Object.entries(replacements)) {
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const count = (html.match(regex) || []).length;
    html = html.replace(regex, value);
    console.log(`  ✅  ${placeholder} → replaced ${count} occurrence(s)`);
}

// --------------- Runtime obfuscation layer ---------------
// Inject a small script that Base64-decodes contact data at runtime,
// so the real phone/URLs are not crawlable in the raw HTML source.
const runtimeConfig = `
<script id="__ec_cfg" type="text/javascript">
(function(){
    var _d=atob,_c={
        wa:_d("${b64(WHATSAPP_URL)}"),
        fb:_d("${b64(FACEBOOK_URL)}"),
        ph:_d("${b64(PHONE_DISPLAY)}"),
        fh:_d("${b64(FACEBOOK_HANDLE)}")
    };
    // Hydrate all [data-ec] elements
    document.addEventListener('DOMContentLoaded',function(){
        document.querySelectorAll('[data-ec-href]').forEach(function(el){
            el.href=_c[el.getAttribute('data-ec-href')];
        });
        document.querySelectorAll('[data-ec-text]').forEach(function(el){
            el.textContent=_c[el.getAttribute('data-ec-text')];
        });
    });
    window.__EC=_c;
})();
</script>`;

// Insert runtime config right before </body>
html = html.replace('</body>', runtimeConfig + '\n</body>');

// --------------- Copy static assets ---------------
const OUTPUT_FILE = path.join(DIST, 'index.html');
fs.writeFileSync(OUTPUT_FILE, html, 'utf-8');

// Copy directories to dist
const assetDirs = ['logo', 'cert', 'Projects', 'management_system'];
for (const dir of assetDirs) {
    const srcDir = path.resolve(__dirname, '..', dir);
    const destDir = path.join(DIST, dir);
    if (fs.existsSync(srcDir)) {
        copyDirSync(srcDir, destDir);
        console.log(`  📁  Copied ${dir}/`);
    }
}

function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log(`\n🚀  Build complete → ${OUTPUT_FILE}\n`);
