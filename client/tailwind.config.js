// client/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./client/src/**/*.{js,ts,jsx,tsx}" // تأكد من تضمين المسارات الصحيحة
  ],
  theme: {
    extend: {
      colors: {
        foreground: "#0f172a", // يمكنك استخدام أي قيمة لونية
        mutedForeground: "#6b7280" // إذا كنت تستخدم متغيرات أخرى
      }
    }
  },
  plugins: []
};
