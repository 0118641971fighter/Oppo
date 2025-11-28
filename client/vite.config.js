// client/vite.config.js
const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const path = require('path');

module.exports = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // بنقول لـ Vite إن أي حاجة تبدأ بـ @/ 
      // معناها إنها في مجلد src
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
