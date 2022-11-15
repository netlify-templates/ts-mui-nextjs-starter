import { Button } from './.stackbit/models/Button';
import { Card } from './.stackbit/models/Card';
import { CardSection } from './.stackbit/models/CardSection';
import { Config } from './.stackbit/models/Config';
import { Footer } from './.stackbit/models/Footer';
import { Header } from './.stackbit/models/Header';
import { HearoSection } from './.stackbit/models/HeroSection';
import { Image } from './.stackbit/models/Image';
import { Links } from './.stackbit/models/Links';
import { Page } from './.stackbit/models/Page';
import { ThemeStyle } from './.stackbit/models/ThemeStyle';

const sbConfig = {
    stackbitVersion: '~0.5.0',
    ssgName: 'nextjs',
    cmsName: 'git',
    nodeVersion: '16',
    dataDir: 'content/data',
    pagesDir: 'content/pages',
    pageLayoutKey: 'type',
    styleObjectModelName: 'ThemeStyle',
    assets: {
        referenceType: 'static',
        staticDir: 'public',
        uploadDir: 'images',
        publicPath: '/'
    },
    models: {
        Button,
        Card,
        CardSection,
        Config,
        Footer,
        Header,
        HearoSection,
        Image,
        Links,
        Page,
        ThemeStyle
    }
};

export default sbConfig;
