/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "sidebar-bg": "#6A89A7",
        "message-sent": "#BDDDFC",
        "message-received": "#88BDF2",
        "dark-bg": "#384959",
      },
    },
  },
  plugins: [],
};
