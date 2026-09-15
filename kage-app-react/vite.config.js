import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // CSP: unsafe-eval benötigt für Supabase Realtime (verwendet intern eval())
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
        "img-src 'self' data: blob: https://*.supabase.co https://www.tgzell.de",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self' data:",
      ].join("; "),
    },
    proxy: {
      // Leitet alle Supabase-HTTP-Requests ueber localhost um.
      // Das umgeht Browser-Schutzlisten, die direkte supabase.co-Aufrufe blockieren.
      "/supabase": {
        target: "https://zbdaoewookiyzojoostw.supabase.co",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/supabase/, ""),
      },
    },
  },
})
