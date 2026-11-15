import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const appRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: appRoot,
  plugins: [react()],
  publicDir: resolve(appRoot, '../public'),
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; media-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; frame-src 'none'; form-action 'self'",
      'X-Frame-Options': 'DENY',
      'Cross-Origin-Resource-Policy': 'same-origin'
    }
  },
  preview: {
    host: '127.0.0.1', port: 4174, strictPort: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Frame-Options': 'DENY',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; media-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; frame-src 'none'; form-action 'self'"
    }
  },
  build: {
    outDir: resolve(appRoot, '../dist-react'),
    emptyOutDir: true,
    sourcemap: false,
    manifest: true,
    cssCodeSplit: true
  }
});
