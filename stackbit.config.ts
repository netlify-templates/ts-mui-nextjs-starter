import { defineStackbitConfig } from '@stackbit/types';
import { GitContentSource } from '@stackbit/cms-git';

import { models } from '.stackbit/models';

const sbConfig = defineStackbitConfig({
    stackbitVersion: '~0.6.0',
    ssgName: 'nextjs',
    nodeVersion: '16',
    contentSources: [
        new GitContentSource({
            rootPath: __dirname,
            contentDirs: ['content'],
            models: models,
            assetsConfig: {
                referenceType: 'static',
                staticDir: 'public',
                uploadDir: 'images',
                publicPath: '/'
            }
        })
    ],
    assetSources: [
        {
            name: 'unsplash-asset-source',
            type: 'iframe',
            url: 'https://unsplash-asset-source.netlify.app',
            preview: ({ assetData }: { assetData: { unsplashImageUrl: string } | string }) => {
                // for backward compatibility with older images stored as files
                if (typeof assetData === 'string') {
                    return {
                        title: 'image',
                        image: assetData
                    };
                }
                return {
                    title: 'image',
                    image: assetData.unsplashImageUrl
                };
            }
        }
    ]
});

export default sbConfig;
