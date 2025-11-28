// client/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"], // تأكد من صحة المسارات
  theme: {
    extend: {
      colors: {
        background: "#0f172a", // يمكنك استخدام أي قيمة لونية هنا
        // أو استخدام متغير CSS إذا كنت تستخدمه
        // background: "var(--background)"
      }
    }
  },
  plugins: []
}
