import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  // Robustly resolve the API Key:
  // 1. Check system env (Vercel) for API_KEY or VITE_API_KEY
  // 2. Check loaded .env file for API_KEY or VITE_API_KEY
  // 3. Fallback to empty string to prevent build errors
  const apiKey = process.env.API_KEY || process.env.VITE_API_KEY || env.API_KEY || env.VITE_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Correctly expose the API_KEY to the client by replacing process.env.API_KEY in the code
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  }
})