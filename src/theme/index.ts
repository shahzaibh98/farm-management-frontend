import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  //Default font family
  fontFamily: 'Roboto, Ubuntu, Helvetica, Arial, sans-serif',
  colors: {
    // Use for primary color and add 10 colors same as total 10 colors is required in array in order to work primaryColor
    brand: [
      'rgb(0, 121, 56)',
      'rgb(0, 121, 56)',
      'rgb(0, 121, 56)',
      'rgb(0, 121, 56)',
      'rgb(0, 121, 56)',
      'rgb(0, 121, 56)',
      'rgb(0, 121, 56)', // This color will be set as primary color in light colorScheme
      'rgb(0, 121, 56)',
      'rgb(0, 121, 56)', // This color will be set as primary color in dark colorScheme
      'rgb(0, 121, 56)',
    ],
    // Primary colors
    primaryColors: [
      'rgb(0, 121, 56)', // --color-primary-color: rgb(0, 121, 56);
      'rgb(0, 86, 40)', // --color-primary-dark: rgb(0, 86, 40); /* Used for primary button background  */
      'rgba(0, 121, 56, 0.15)', // --color-primary-light: rgba(0, 121, 56, 0.15);
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
    // Secondary colors
    secondaryColors: [
      'rgb(188, 141, 66)', // --color-secondary-color: rgb(188, 141, 66);
      'rgb(132, 98, 44)', // --color-secondary-dark: rgb(132, 98, 44); /* Used for secondary button background  */
      'rgba(188, 141, 66, 0.15)', // --color-secondary-light: rgba(188, 141, 66, 0.15)
      'rgb(201,166, 77)',
      'rgb(201, 166, 77, 0.75)',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
    // Light colors
    lightColors: [
      'rgb(255, 255, 255)', //--color-light-color: rgb(255, 255, 255);
      'rgba(255, 255, 255, 0.84)', //--color-light-840: rgba(255, 255, 255, 0.84)
      'rgba(255, 255, 255, 0.08)', //--color-light-080: rgba(255, 255, 255, 0.08)
      'rgba(255, 255, 255, 0.2)', //--color-light-020: rgba(255, 255, 255, 0.2)
      'rgba(255, 255, 255, 0.14)',
      'rgba(255, 255, 255, 0.44)',
      'rgba(255, 255, 255, 0.55)',
      '',
      '',
      '',
    ],
    // Dark colors
    darkColors: [
      'rgb(29, 43, 57)', // 0 --color-dark-color: rgb(29, 43, 57);
      'rgba(29, 43, 57, 0.75)', // 1 --color-dark-color: rgba(29, 43, 57, 0.75);
      'rgba(29, 43, 57, 0.65)', // 2 --color-dark-dark : rgba(29, 43, 57, 0.65);
      'rgba(29, 43, 57, 0.45)', // 3 --color-dark-dark : rgba(29, 43, 57, 0.45);
      'rgba(29, 43, 57, 0.25)', // 4 --color-dark-dark : rgba(29, 43, 57, 0.25);
      'rgba(29, 43, 57, 0.15)', // 5 --color-dark-dark : rgba(29, 43, 57, 0.15);
      'rgba(29, 43, 57, 0.03)', // index[6] background color for section
      'rgba(29, 43, 57, 0.01)', // index[7] background color for section
      'rgba(29, 43, 57, 0.02)',
      'rgba(29, 43, 57, 0.08)',
      'rgba(0, 0, 0, 0.4)',
      'rgba(0, 0, 0, 0.7)',
    ],
    // Info colors
    infoColors: [
      'rgb(216, 56, 56)', //--color-error-color: rgb(216, 56, 56)
      'rgba(216, 56, 56, 0.15)', // --color-error-color-light: rgba(216, 56, 56, 0.15)
      '#007938', // --color-success-color: #007938
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ],
  },
  // Set primary color in brand
  primaryColor: 'brand',

  // Font sizes for text fields
  fontSizes: {
    xs: '10px', // sm
    sm: '12px', // caption
    md: '14px', // body2
    lg: '16px', // body1
    xl: '18px', // h3
  },

  //line heights
  other: {
    defaultText: {
      desktop: 'lg',
      mobile: 'sm',
    },
    lineHeights: {
      xs: '12px', // sm
      sm: '16px', // caption
      md: '20px', // body2
      lg: '24px', // body1
      xl: '24px', // h3
      h2: '28px', // h2
      h1: '32px', // h1
      heading: '40px',
    },
    // Custom font sizes
    fontSizes: {
      h2: '20px',
      h1: '24px',
      heading: '32px',
    },
    // Custom box shadows
    shadows: {
      light: '0 1px 2px 1 var(--color-light-shadow)', // light
      lightDark: '0 1px 2px 0 rgb(196,196,196)', // light dark
      lightTable: '0 2px 4px 0 var(--color-dark-dark-020)', // light table
    },
  },
  //Heading default size
  headings: {
    fontFamily: 'Ubuntu, Helvetica, Arial, sans-serif',
    sizes: {
      h1: { fontSize: '24px', lineHeight: '32px' },
      h2: { fontSize: '20px', lineHeight: '28px' },
      h3: { fontSize: '18px', lineHeight: '24px' },
    },
  },

  // Screen size
  breakpoints: {
    sm: '480px',
    md: '750px',
    lg: '976px',
    xl: '1440px',
  },

  shadows: {
    xs: '0 7px 12px rgba(50, 101, 8, 0.26)', // primary
    sm: '0 7px 12px 0 rgba(188,141,66,0.33)', // secondary
    md: '0 2px 4px 0 rgba(29,43,57,0.15)', // container
    lg: '0 6px 12px 0 rgba(29,43,57,0.15)', // searchbar
  },
};
