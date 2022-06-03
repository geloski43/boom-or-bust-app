import { extendTheme } from 'native-base';

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light',
};

const colors = {
  primary: {
    50: '#f6f2ee',
    100: '#e7dccf',
    200: '#d8c8b1',
    300: '#c9b092',
    400: '#b99d74',
    500: '#aa8555',
    600: '#886d44',
    700: '#665033',
    800: '#443622',
    900: '#221b11',
  },
};

export default extendTheme(config, colors);
