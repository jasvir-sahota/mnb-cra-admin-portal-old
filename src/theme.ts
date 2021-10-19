import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#6246e4',
    },
    secondary: {
      main: '#ffffff',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
    htmlFontSize: 20,
    fontFamily: "'Cairo', sans-serif",
    fontSize: 14,
    fontWeightLight: 300, 
    fontWeightRegular: 400, 
    fontWeightMedium: 700,
    subtitle1: {
      fontSize: '17px'
    }
  },
});

export default responsiveFontSizes(theme);
