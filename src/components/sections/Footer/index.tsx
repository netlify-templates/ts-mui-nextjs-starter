import * as React from 'react';
import { StackbitObjectId, getObjectId, toFieldPath } from '@stackbit/annotations';
import type * as types from 'types';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

import { Link } from '../../atoms/Link';
import { Markdown } from '../../atoms/Markdown';

type Props = types.Footer & StackbitObjectId;

export const Footer: React.FC<Props> = (props) => {
    const { navLinks = [], copyrightText } = props;
    const objectId = getObjectId(props);
    const fieldPath = objectId ? `${objectId}:footer` : null;
    return (
        <MuiBox component="footer" sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', py: 3 }} {...toFieldPath(fieldPath)}>
            {navLinks.length > 0 && (
                <MuiBox component="nav" sx={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap' }} {...toFieldPath('.navLinks')}>
                    {navLinks.map((link, index) => (
                        <Link key={index} {...link} {...toFieldPath(`.${index}`)} sx={{ mr: 2 }} />
                    ))}
                </MuiBox>
            )}
            {copyrightText && (
                <MuiTypography component="div" color="text.secondary">
                    <Markdown text={copyrightText} {...toFieldPath('.copyrightText')} />
                </MuiTypography>
            )}
        </MuiBox>
    );
};
