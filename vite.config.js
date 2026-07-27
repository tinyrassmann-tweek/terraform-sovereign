import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Project site on GitHub Pages: https://tinyrassmann-tweek.github.io/terraform-sovereign/
  base: '/terraform-sovereign/',
  plugins: [react()],
});
