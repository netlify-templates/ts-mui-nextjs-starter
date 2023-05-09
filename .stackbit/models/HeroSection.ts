import { Model } from '@stackbit/types';

export const HeroSection: Model =  {
    type: 'object',
    name: 'HeroSection',
    label: 'Hero',
    labelField: 'title',
    thumbnail: 'https://assets.stackbit.com/components/models/thumbnails/default.png',
    groups: ['sectionComponent'],
    fields: [
        { type: 'string', name: 'title', label: 'Title', default: 'This Is A Big Hero Headline' },
        { type: 'string', name: 'subtitle', label: 'Subtitle', default: 'The section subtitle' },
        {
            type: 'markdown',
            name: 'text',
            label: 'Text',
            default:
                'Aenean eros ipsum, interdum quis dignissim non, sollicitudin vitae nisl. Aenean vel aliquet elit, at blandit ipsum. Sed eleifend felis sit amet erat molestie, hendrerit malesuada justo ultrices. Nunc volutpat at erat vitae interdum. Ut nec massa eget lorem blandit condimentum et at risus.\n'
        },
        {
            type: 'list',
            name: 'actions',
            label: 'Actions',
            items: { type: 'model', models: ['Button'] },
            default: [
                { type: 'Button', label: 'Get Started', url: '/', size: 'large', variant: 'contained' },
                { type: 'Button', label: 'Learn more', url: '/', size: 'large', variant: 'outlined' }
            ]
        },
        {
            type: 'model',
            name: 'image',
            label: 'Image',
            models: ['Image'],
            default: { type: 'Image', url: 'https://assets.stackbit.com/components/images/default/hero.png', altText: 'Hero section image' }
        }
    ]
};

