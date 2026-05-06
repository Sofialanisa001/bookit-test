import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // El simbolo '@' apunta a la carpeta 'src'
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  // Reduce tamano
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui') || id.includes('@emotion')) return 'vendor-mui';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('recharts')) return 'vendor-charts';
            if (id.includes('swiper')) return 'vendor-swiper';
            
            return 'vendor-others';
          }
        },
      },
    },
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
  },
  // Optimiza
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      'swiper',
      'react-router-dom',
    ],
  },
});
