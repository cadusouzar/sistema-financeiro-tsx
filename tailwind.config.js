/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor:{
        'primary': '#042940',
        'secondary': '#184B6A',
        'panel-primary': '#404040',
        'panel-secondary': '#646464',
      },
      fontFamily:{
        montserrat: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0px 54px 55px rgba(0, 0, 0, 0.25), 0px -12px 30px rgba(0, 0, 0, 0.12), 0px 4px 6px rgba(0, 0, 0, 0.12), 0px 12px 13px rgba(0, 0, 0, 0.17), 0px -3px 5px rgba(0, 0, 0, 0.09)',
      },
      spacing:{
        'transfer-panel-width': '90rem',
        'transfer-panel-heigth': '40rem',
        'account-panel': '36rem'
      },
      margin:{
        '1/2': '10%',
      }
    },
  },
  plugins: [],
}

