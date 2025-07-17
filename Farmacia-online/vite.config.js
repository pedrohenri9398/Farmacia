import { defineConfig } from 'vite';

export default defineConfig({
  root: 'Farmacia-online', // A pasta onde estão index.html, style.css, script.js
  build: {
    outDir: 'dist' // Onde os arquivos construídos serão colocados
  }
});