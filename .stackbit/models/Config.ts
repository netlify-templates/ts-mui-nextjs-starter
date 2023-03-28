import { Model } from '@stackbit/types';

export const Config: Model = {
    type: 'data',
    name: 'Config',
    label: 'Site configuration',
    singleInstance: true,
    filePath: 'content/data/config.json',
    readOnly: true,
    fields: [
        { type: 'image', name: 'favicon', label: 'Favicon', default: 'https://assets.stackbit.com/components/images/default/favicon.svg' },
        { type: 'model', name: 'header', label: 'Header configuration', models: ['Header'] },
        { type: 'model', name: 'footer', label: 'Footer configuration', models: ['Footer'] }
    ]
};
