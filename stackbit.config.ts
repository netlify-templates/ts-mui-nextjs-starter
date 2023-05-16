import { Button } from './.stackbit/models/Button';
import { Card } from './.stackbit/models/Card';
import { CardsSection } from './.stackbit/models/CardsSection';
import { Config } from './.stackbit/models/Config';
import { Footer } from './.stackbit/models/Footer';
import { Header } from './.stackbit/models/Header';
import { HeroSection } from './.stackbit/models/HeroSection';
import { Image } from './.stackbit/models/Image';
import { Link } from './.stackbit/models/Link';
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
        CardsSection,
        Config,
        Footer,
        Header,
        HeroSection,
        Image,
        Link,
        Page,
        ThemeStyle
    }
};

export default sbConfig;
