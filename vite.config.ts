import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// GitHub Pages serves this repository from a project subpath.
export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/ne-logistics-platform/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5175,
  },
})
