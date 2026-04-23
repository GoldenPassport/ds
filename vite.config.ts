import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  optimizeDeps: {
    include: ['react/jsx-runtime', 'react/jsx-dev-runtime'],
  },
  plugins: [react(), tailwindcss()],
});
