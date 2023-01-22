import * as React from 'react';
import NextLink from 'next/link';
import type * as types from 'types';

import MuiButton from '@mui/material/Button';

export type Props = types.Button & types.StackbitFieldPath & { className?: string; sx?: { [key: string]: any } };

export const Button: React.FC<Props> = (props) => {
    const { className, label, url, size = 'medium', variant = 'text', color = 'primary', sx, 'data-sb-field-path': fieldPath } = props;
    const annotations = fieldPath ? [fieldPath, `${fieldPath}.url#@href`].join(' ').trim() : null;

    return (
        <MuiButton component={NextLink} href={url} className={className} variant={variant} size={size} color={color} sx={{ borderRadius: '2px', ...sx }} data-sb-field-path={annotations}>
            <span data-sb-field-path=".label">{label}</span>
        </MuiButton>
    );
};
