
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const palette = {
    lightBlue: '#D9EDF7',
    black: '#0B0B0B',
    white: '#FFFFFF',
    lightGreen: '#5CB85C',
    red: '#D9534F',
  }
  
  export const theme = {
    colors: {
      background: palette.white,
      foreground: palette.black,
      primary: palette.lightGreen,
      success: palette.lightGreen,
      danger: palette.red,
      failure: palette.red,
    },
    spacing: {
      s: 8,
      m: 16,
      l: 24,
      xl: 40,
    },
    textVariants: {
      header: {
        fontFamily: 'Raleway',
        fontSize: windowWidth / 11,
        fontWeight: 'bold',
      },
      body: {
        fontFamily: 'Merriweather',
        fontSize: windowWidth / 25,
      },
    }
  };
  
  export const darkTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      background: palette.black,
      foreground: palette.white,
    }
  }