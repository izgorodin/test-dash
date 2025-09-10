import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  // On GitHub Pages the app is served from /test-dash/ subpath
  base: command === 'build' ? '/test-dash/' : '/',
  plugins: [react()],
}))
