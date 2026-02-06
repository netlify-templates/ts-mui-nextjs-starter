import * as React from 'react';
import type * as types from 'types';
import { Link } from '../../atoms/Link';
import { Markdown } from '../../atoms/Markdown';

import MuiBox from '@mui/material/Box';
import MuiTypography from '@mui/material/Typography';

type Props = types.Footer;

export const Footer: React.FC<Props> = (props) => {
    const { navLinks = [], copyrightText } = props;
    return (
        <MuiBox component="footer" sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', py: 3 }}>
            {navLinks.length > 0 && (
                <MuiBox component="nav" sx={{ display: 'flex', flexGrow: 1, flexWrap: 'wrap' }}>
                    {navLinks.map((link, index) => (
                        <Link key={index} {...link} sx={{ mr: 2 }} />
                    ))}
                </MuiBox>
            )}
            {copyrightText && (
                <MuiTypography component="div" color="text.secondary">
                    <Markdown text={copyrightText} />
                </MuiTypography>
            )}
        </MuiBox>
    );
};
