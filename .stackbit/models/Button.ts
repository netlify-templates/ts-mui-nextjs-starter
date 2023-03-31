import { Model } from '@stackbit/types';

export const Button: Model = {
    type: 'object',
    name: 'Button',
    label: 'Button',
    labelField: 'label',
    fieldGroups: [{ name: 'styles', label: 'Styles' }],
    fields: [
        { type: 'string', name: 'label', label: 'Label', default: 'Learn more', required: true },
        { type: 'string', name: 'url', label: 'URL', default: '/', required: true },
        {
            type: 'enum',
            name: 'size',
            group: 'styles',
            controlType: 'button-group',
            label: 'Size',
            options: [
                { label: 'Small', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Large', value: 'large' }
            ],
            default: 'medium'
        },
        {
            type: 'enum',
            name: 'variant',
            group: 'styles',
            controlType: 'button-group',
            label: 'Variant',
            options: [
                { label: 'Contained', value: 'contained' },
                { label: 'Outlined', value: 'outlined' },
                { label: 'Text', value: 'text' }
            ],
            default: 'text'
        },
        {
            type: 'enum',
            name: 'color',
            group: 'styles',
            controlType: 'button-group',
            label: 'Color',
            options: [
                { label: 'Inherit', value: 'inherit' },
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' }
            ],
            default: 'primary'
        }
    ]
};
