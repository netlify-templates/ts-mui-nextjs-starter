const themeStyle = require('../../content/data/style.json');
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: themeStyle.mode ?? 'light',
    primary: {
      main: themeStyle.primaryColor ?? '#2196f3',
    },
    secondary: {
      main: themeStyle.secondaryColor ?? '#f50057',
    }
  },
});

theme = responsiveFontSizes(theme);

export default theme;
