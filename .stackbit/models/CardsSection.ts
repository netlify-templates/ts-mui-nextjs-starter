import { Model } from '@stackbit/types';

export const CardsSection: Model =  {
    type: 'object',
    name: 'CardsSection',
    label: 'Cards',
    labelField: 'title',
    thumbnail: 'https://assets.stackbit.com/components/models/thumbnails/default.png',
    groups: ['sectionComponent'],
    fields: [
        { type: 'string', name: 'title', label: 'Title', default: 'Featured Items' },
        { type: 'string', name: 'subtitle', label: 'Subtitle', default: 'The section subtitle' },
        {
            type: 'list',
            name: 'items',
            label: 'Items',
            items: { type: 'model', models: ['Card'] },
            default: [
                {
                    type: 'Card',
                    title: 'Item Title',
                    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae. explicabo.\n',
                    image: { type: 'Image', url: 'https://assets.stackbit.com/components/images/default/default-image.png', altText: 'Item image' },
                    actions: [{ type: 'Link', label: 'Learn More', url: '/' }]
                }
            ]
        }
    ]
};

