import { Model } from '@stackbit/types';

export const Header: Model = {
    type: 'object',
    name: 'Header',
    label: 'Header',
    labelField: 'title',
    readOnly: true,
    fields: [
        { type: 'string', name: 'title', label: 'Title', default: 'Your Brand' },
        {
            type: 'list',
            name: 'navLinks',
            label: 'Navigation links',
            items: { type: 'model', models: ['Link'] },
            default: [
                { type: 'Link', label: 'Home', url: '/' },
                { type: 'Link', label: 'About', url: '/' }
            ]
        }
    ]
};
