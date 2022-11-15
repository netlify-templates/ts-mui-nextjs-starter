const themeStyle = require('../../content/data/style.json');
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
    palette: {
        mode: themeStyle.mode ?? 'light',
        primary: {
            main: themeStyle.primaryColor ?? '#1F2B9D'
        },
        secondary: {
            main: themeStyle.secondaryColor ?? '#F65458'
        },
        text: {
            primary: themeStyle.mode === 'dark' ? '#fff' : '#02001d',
            secondary: themeStyle.mode === 'dark' ? '#979797' : '#374151'
        }
    },
    typography: {
        h1: {
            fontWeight: 500
        },
        h2: {
            fontWeight: 500
        },
        h3: {
            fontWeight: 500
        }
    }
});

theme = responsiveFontSizes(theme);

export default theme;
