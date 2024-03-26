/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {

    },
    colors: {
      "secondaryColors": { 100: 'rgb(201,166, 77)', },
      "lightColors": { 100: 'rgba(255, 255, 255, 0.55)' },
      "darkColors": {
        100: 'rgb(29, 43, 57)', // 0 --color-dark-color: rgb(29, 43, 57);
        200: 'rgba(29, 43, 57, 0.75)', // 1 --color-dark-color: rgba(29, 43, 57, 0.75);
        300: 'rgba(29, 43, 57, 0.65)', // 2 --color-dark-dark : rgba(29, 43, 57, 0.65);
        400: 'rgba(29, 43, 57, 0.45)', // 3 --color-dark-dark : rgba(29, 43, 57, 0.45);
        500: 'rgba(29, 43, 57, 0.25)', // 4 --color-dark-dark : rgba(29, 43, 57, 0.25);
        600: 'rgba(29, 43, 57, 0.15)', // 5 --color-dark-dark : rgba(29, 43, 57, 0.15);
        700: 'rgba(29, 43, 57, 0.03)', // index[6] background color for section
        800: 'rgba(29, 43, 57, 0.01)', // index[7] background color for section
        900: 'rgba(29, 43, 57, 0.02)',
        1000: 'rgba(29, 43, 57, 0.08)',
        1100: 'rgba(0, 0, 0, 0.4)',
      },
    }
  },
  plugins: [],
}