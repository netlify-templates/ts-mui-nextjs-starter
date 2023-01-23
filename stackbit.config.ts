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
import { defineStackbitConfig } from '@stackbit/types';
import { FileSystemContentSource } from 'content-source';

const sbConfig = defineStackbitConfig({
    stackbitVersion: '~0.6.0',
    ssgName: 'nextjs',
    nodeVersion: '16',
    dataDir: 'content/data', //TODO
    pagesDir: 'content/pages',
    contentSources: [
        new FileSystemContentSource({
            rootDir: __dirname,
            contentDir: 'content',
            models: [Button, Card, CardsSection, Config, Footer, Header, HeroSection, Image, Link, Page, ThemeStyle],
            assets: {
                referenceType: 'static',
                staticDir: 'public',
                uploadDir: 'images',
                publicPath: '/'
            }
        })
    ]
    // pageLayoutKey: 'type',
    // styleObjectModelName: 'ThemeStyle',

    // models: {
    //     Button,
    //     Card,
    //     CardsSection,
    //     Config,
    //     Footer,
    //     Header,
    //     HeroSection,
    //     Image,
    //     Link,
    //     Page,
    //     ThemeStyle
    // }
});

export default sbConfig;
