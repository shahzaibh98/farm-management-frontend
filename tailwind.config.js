/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      textColor: {
        skin: {
          fill: 'var(--color-dark-dark)',
          primary: 'var(--color-primary-color)',
          secondary: 'var(--color-secondary-color)',
          caption: 'var(--color-dark-dark-450)',
          light: 'var(--color-light-color)',
          'light-840': 'var(--color-light-840)',
          'light-080': 'var(--color-light-080)',
          'dark-650': 'var(--color-dark-dark-650)',
          'dark-750': 'var(--color-dark-dark-750)',
          'dark-450': 'var(--color-dark-dark-450)',

          active: 'var(--color-dark-dark-540)',
          error: 'var(--color-error-color)',
          success: 'var(--color-success-color)',
        },
      },
      backgroundColor: {
        skin: {
          fill: 'var(--color-dark-dark)',
          primary: 'var(--color-primary-color)',
          'primary-light': 'var(--color-primary-light)',
          'primary-dark': 'var(--color-primary-dark)',
          secondary: 'var(--color-secondary-color)',
          'secondary-light': 'var(--color-secondary-light)',
          'secondary-dark': 'var(--color-secondary-dark)',
          'dark-dark-450': 'var(--color-dark-dark-450)',
          'dark-dark-250': 'var(--color-dark-dark-250)',
          'dark-dark-030': 'var(--color-dark-dark-030)',
          'dark-dark-020': 'var(--color-dark-dark-020)',
          'dark-dark-010': 'var(--color-dark-dark-010)',
          'dark-dark-008': 'var(--color-dark-dark-008)',
          light: 'var(--color-light-color)',
          'light-840': 'var(--color-light-840)',
          'light-080': 'var(--color-light-080)',
          red: 'var(--color-error-color)',

          active: 'var(--color-dark-dark-540)',
          error: 'var(--color-error-color-light)',
          success: 'var(--color-success-color)',
        },
      },
      borderColor: {
        skin: {
          fill: 'var(--color-dark-dark-450)',
          'dark-150': 'var(--color-dark-dark-150)',
          primary: 'var(--color-primary-color)',
          secondary: 'var(--color-secondary-color)',
          focus: 'var(--color-primary-color)',
          error: 'var(--color-error-color)',
          success: 'var(--color-success-color)',
          light: 'var(--color-light-020)',
        },
      },
      outlineColor: {
        skin: {
          primary: 'var(--color-primary-color)',
        },
      },
      boxShadow: {
        primary: '0 7px 12px 0 var(--color-primary-shadow)',
        secondary: '0 7px 12px 0 rgba(188,141,66,0.33)',
        light: '0 1px 2px 1 var(--color-light-shadow)',
        'light-dark': '0 1px 2px 0 rgb(196,196,196)',
        'light-table': '0 2px 4px 0 var(--color-dark-dark-020)',
        container: '0 2px 4px 0 rgba(29,43,57,0.15)',
        searchbar: '0 6px 12px 0 rgba(29,43,57,0.15)',
      },
      colors: {
        left: 'rgba(255,255,255,0)',
        right: 'rgba(255,255,255,0.14)',
        'icon-dark-default': 'rgba(255,255,255, 0.56)',
        'icon-dark-secondary': 'var(--color-secondary-color)',
      },
    },
    colors: {
      "secondaryColors": {
        100: 'rgb(201, 166, 77)',          // Base color
        90: 'rgb(191, 156, 67)',           // 90% shade
        80: 'rgb(181, 146, 57)',           // 80% shade
        70: 'rgb(171, 136, 47)',           // 70% shade
        60: 'rgb(161, 126, 37)',           // 60% shade
        50: 'rgb(151, 116, 27)',           // 50% shade
        40: 'rgb(141, 106, 17)',           // 40% shade
        30: 'rgb(131, 96, 7)',             // 30% shade
        20: 'rgb(121, 86, 0)',             // 20% shade
        10: 'rgb(111, 76, 0)',             // 10% shade
      },
      "lightColors": {
        100: 'rgba(255, 255, 255, 0.55)',
        lightShade1: 'rgb(241, 216, 137)',
        lightShade2: 'rgb(251, 236, 177)',
        lightShade3: 'rgb(255, 250, 214)',
        lightestGrey1: "rgb(230, 230, 230)",
        lightestGrey2: "rgb(240, 240, 240)",
        lightestGrey3: "rgb(245, 245, 245)"
      },
      'white': { 100: '#FFFFFF' },
      'black': {
        100: 'rgba(0, 0, 0, 0.5)'
      },
      'red': {
        light: '#FFE0E0', // Light red (slightly darker)
        lightDark: '#ffb09c',
        DEFAULT: '#F44336', // Original red
        dark: '#B71C1C', // Dark red

      },
      yellow: {
        light: '#FFF5C2', // Light yellow (slightly darker)
        DEFAULT: '#FFEB3B', // Original yellow
        dark: '#FBC02D', // Dark yellow
      },
      green: {
        light: '#D6E9D8', // Light green (slightly darker)
        DEFAULT: '#4CAF50', // Original green
        dark: '#1B5E20', // Dark green
      },
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
        darkShade1: "rgb(100, 100, 100)",
        darkShade2: "rgb(75, 75, 75)",
        darkShade3: "rgb(50, 50, 50)"
      },
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
        950: '#030712',
      },
      blue: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
      },
      newTheme: {
        300: '#BE8B45',
      }
    },
  },
  plugins: [],
}