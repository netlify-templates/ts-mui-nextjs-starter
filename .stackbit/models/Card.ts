import { Model } from '@stackbit/types';

export const Card: Model = {
    type: 'object',
    name: 'Card',
    label: 'Card',
    labelField: 'title',
    fields: [
        { type: 'string', name: 'title', label: 'Title', default: 'Item Title' },
        {
            type: 'markdown',
            name: 'text',
            label: 'Text',
            default:
                'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae. explicabo.'
        },
        {
            type: 'model',
            name: 'image',
            label: 'Image',
            models: ['Image'],
            default: { type: 'Image', url: 'https://assets.stackbit.com/components/images/default/default-image.png', altText: 'Item image' }
        },
        {
            type: 'list',
            name: 'actions',
            label: 'Actions',
            items: { type: 'model', models: ['Button'] },
            default: [{ type: 'Button', label: 'Learn More', url: '/' }]
        }
    ]
};
