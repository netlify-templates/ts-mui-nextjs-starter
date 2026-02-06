import * as React from 'react';
import NextLink from 'next/link';
import type * as types from 'types';

import MuiLink from '@mui/material/Link';

export type Props = types.Link & { className?: string; sx?: { [key: string]: any } };

export const Link: React.FC<Props> = (props) => {
    const { className, label, url, underline = 'always', color = 'primary', sx } = props;

    return (
        <MuiLink component={NextLink} href={url} className={className} underline={underline} color={color} sx={{ ...sx }}>
            {label}
        </MuiLink>
    );
};
