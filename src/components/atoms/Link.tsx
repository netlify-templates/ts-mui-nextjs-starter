import * as React from 'react';
import NextLink from 'next/link';
import type * as types from 'types';

import MuiLink from '@mui/material/Link';

export type Props = types.Link & types.StackbitFieldPath & { className?: string; sx?: { [key: string]: any } };

export const Link: React.FC<Props> = (props) => {
    const { className, label, url, underline = 'always', color = 'primary', sx, 'data-sb-field-path': fieldPath } = props;
    const annotations = fieldPath ? [fieldPath, `${fieldPath}.url#@href`].join(' ').trim() : null;

    return (
        <MuiLink component={NextLink} href={url} className={className} underline={underline} color={color} sx={{ ...sx }} data-sb-field-path={annotations}>
            <span data-sb-field-path=".label">{label}</span>
        </MuiLink>
    );
};
