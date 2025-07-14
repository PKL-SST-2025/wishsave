/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'mint-400': '#95f5cc',
        'mint-300': '#bbf7dd',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
