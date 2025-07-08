import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Make sure this line exists

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // No 'esbuild' configuration needed here.
  // With .jsx file extensions, @vitejs/plugin-react should handle JSX automatically.
});
