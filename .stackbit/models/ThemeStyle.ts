export const ThemeStyle =  {
    type: 'data',
    label: 'Theme Style',
    file: 'style.json',
    fields: [
        {
            type: 'enum',
            name: 'mode',
            label: 'Mode',
            controlType: 'button-group',
            options: [
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' }
            ],
            default: 'light'
        },
        { type: 'color', name: 'primaryColor', label: 'Primary color' },
        {
            type: 'color',
            name: 'secondaryColor',
            label: 'Secondary color'
        }
    ]
};

