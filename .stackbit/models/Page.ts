import { Model } from "@stackbit/types";

export const Page: Model =  {
    name: 'Page',
    type: 'page',
    label: 'Page',
    folder: 'pages',
    urlPath: '/{slug}',
    filePath: 'pages/{slug}.md',
    hideContent: true,
    thumbnail: 'https://assets.stackbit.com/components/models/thumbnails/default.png',
    fields: [
        { type: 'slug', name: 'slug', label: 'slug', required: true },
        { type: 'string', name: 'title', label: 'Title', default: 'This Is a New Page', required: true },
        { type: 'reference', name: 'author', models: ['Author'] },
        {
            type: 'list',
            name: 'sections',
            label: 'Sections',
            items: { type: 'model', models:['CardsSection', 'HeroSection'], groups: ['sectionComponent'] },
            default: [
                {
                    type: 'HeroSection',
                    title: 'This Is A Big Hero Headline',
                    text: 'Aenean eros ipsum, interdum quis dignissim non, sollicitudin vitae nisl. Aenean vel aliquet elit, at blandit ipsum. Sed eleifend felis sit amet erat molestie, hendrerit malesuada justo ultrices. Nunc volutpat at erat itae interdum. Ut nec massa eget lorem blandit condimentum et at risus.\n',
                    actions: [
                        { type: 'Button', label: 'Get Started', url: '/', size: 'large', variant: 'contained' },
                        { type: 'Button', label: 'Learn more', url: '/', size: 'large', variant: 'outlined' }
                    ],
                    image: { type: 'Image', url: 'https://assets.stackbit.com/components/images/default/hero.png', altText: 'Hero section image' }
                }
            ]
        }
    ]
};

