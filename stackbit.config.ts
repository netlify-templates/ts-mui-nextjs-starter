import { defineStackbitConfig } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

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

const gitContentSource = new GitContentSource({
    rootPath: __dirname,
    contentDirs: ['content'],
    models: [Button, Card, CardsSection, Config, Footer, Header, HeroSection, Image, Link, Page, ThemeStyle],
    assetsConfig: {
        referenceType: 'static',
        staticDir: 'public',
        uploadDir: 'images',
        publicPath: '/'
    }
});

export const sbConfig = defineStackbitConfig({
    stackbitVersion: '~0.6.0',
    ssgName: 'nextjs',
    nodeVersion: '16',
    contentSources: [gitContentSource],
    sidebarButtons: [
        {
            type: 'model',
            label: 'Global styles',
            icon: 'style',
            modelName: 'ThemeStyle',
            srcType: gitContentSource.getContentSourceType(),
            srcProjectId: gitContentSource.getProjectId()
        }
    ]
});

