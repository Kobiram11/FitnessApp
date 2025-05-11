import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, // ✅ Fixes "global is not defined" in sockjs-client
  },
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: "ws",
      host: "localhost",
      clientPort: 5173,
    },
  },
  optimizeDeps: {
    include: ['sockjs-client'],
  },
});
