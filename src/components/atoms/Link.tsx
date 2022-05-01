import * as React from 'react';
import NextLink from 'next/link';
import { toFieldPath, getFieldPath, StackbitFieldPath } from '@stackbit/annotations';
import type * as types from 'types';

import MuiLink from '@mui/material/Link';

export type Props = types.Link & StackbitFieldPath & { className?: string; sx?: { [key: string]: any } };

export const Link: React.FC<Props> = (props) => {
    const { className, label, url, underline = 'always', color = 'primary', sx } = props;
    const annotationPrefix = getFieldPath(props);
    const annotations = annotationPrefix ? [annotationPrefix, `${annotationPrefix}.url#@href`] : [];

    return (
        <NextLink href={url} passHref>
            <MuiLink className={className} underline={underline} color={color} sx={{ ...sx }} {...toFieldPath(...annotations)}>
                <span {...toFieldPath('.label')}>{label}</span>
            </MuiLink>
        </NextLink>
    );
};
