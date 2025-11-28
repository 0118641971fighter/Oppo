// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // بنقول لـ Vite إن أي حاجة تبدأ بـ @/ 
      // معناها إنها في مجلد src
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
