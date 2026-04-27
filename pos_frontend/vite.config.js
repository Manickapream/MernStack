import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy only in development mode
    ...(process.env.NODE_ENV === 'development' && {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', () => {
              // Backend still starting — silently ignore until ready
            });
          },
        },
        '/uploads': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', () => {});
          },
        },
      },
    }),
  },
});
