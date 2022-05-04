const themeStyle = require('../../content/data/style.json');
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: themeStyle.mode ?? 'light',
    primary: {
      main: themeStyle.primaryColor ?? '#1F2B9D',
    },
    secondary: {
      main: themeStyle.secondaryColor ?? '#F65458',
    }
  },
});

theme = responsiveFontSizes(theme);

export default theme;
