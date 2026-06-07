import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: '/home-gym-tracker-v2/', // subpath do GitHub Pages (ajustar no cutover p/ domínio próprio)
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      injectManifest: { maximumFileSizeToCacheInBytes: 4 * 1024 * 1024 },
      includeAssets: ['favicon.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Home Gym Tracker',
        short_name: 'Home Gym',
        description: 'Ficha de treino em casa que virou jogo de saúde.',
        theme_color: '#0d0f12',
        background_color: '#0d0f12',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
