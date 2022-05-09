import * as React from 'react';
import NextLink from 'next/link';
import { toFieldPath, getFieldPath, StackbitFieldPath } from '@stackbit/annotations';
import type * as types from 'types';

import MuiButton from '@mui/material/Button';

export type Props = types.Button & StackbitFieldPath & { className?: string; sx?: { [key: string]: any } };

export const Button: React.FC<Props> = (props) => {
    const { className, label, url, size = 'medium', variant = 'text', color = 'primary', sx } = props;
    const annotationPrefix = getFieldPath(props);
    const annotations = annotationPrefix ? [annotationPrefix, `${annotationPrefix}.url#@href`] : [];

    return (
        <NextLink href={url} passHref>
            <MuiButton className={className} variant={variant} size={size} color={color} sx={{borderRadius: '2px', ...sx }} {...toFieldPath(...annotations)}>
                <span {...toFieldPath('.label')}>{label}</span>
            </MuiButton>
        </NextLink>
    );
};
