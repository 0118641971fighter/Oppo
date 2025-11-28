// client/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./client/src/**/*.{js,ts,jsx,tsx}" // تأكد من تضمين المسارات الصحيحة
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // استخدم القيمة من ملف index.css
      }
    }
  },
  plugins: []
};
