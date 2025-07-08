import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Crucial: Tell esbuild to treat .js files as JSX
  esbuild: {
    loader: { '.js': 'jsx' },
  },
});
