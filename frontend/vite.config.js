import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Make sure this line exists

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Removed the 'esbuild' configuration.
  // The @vitejs/plugin-react should handle JSX in .jsx files automatically.
});

