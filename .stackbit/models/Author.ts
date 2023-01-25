import { Model } from '@stackbit/types';

export const Author: Model = {
    name: 'Author',
    type: 'data',
    filePath: 'data/{slug}.json',
    label: 'Author',
    labelField: 'name',
    fields: [
        { type: 'string', name: 'name', label: 'name', required: true },
        { type: 'model', name: 'avatar', label: 'Avatar', models: ['Image'] }
    ]
};
