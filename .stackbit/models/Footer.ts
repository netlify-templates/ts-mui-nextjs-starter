import { Model } from '@stackbit/types';

export const Footer: Model = {
    type: 'object',
    name: 'Footer',
    label: 'Footer',
    labelField: 'copyrightText',
    readOnly: true,
    fields: [
        {
            type: 'list',
            name: 'navLinks',
            label: 'Navigation links',
            items: { type: 'model', models: ['Link'] },
            default: [
                { type: 'Link', label: 'Home', url: '/' },
                { type: 'Link', label: 'About', url: '/' }
            ]
        },
        { type: 'markdown', name: 'copyrightText', label: 'Copyright text', default: 'Copyright text' }
    ]
};
