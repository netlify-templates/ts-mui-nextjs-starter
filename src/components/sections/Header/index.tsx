import * as React from 'react';
import type * as types from 'types';
import { Link } from '../../atoms/Link';

import MuiAppBar from '@mui/material/AppBar';
import MuiBox from '@mui/material/Box';
import MuiToolbar from '@mui/material/Toolbar';
import MuiTypography from '@mui/material/Typography';

export type Props = types.Header;

export const Header: React.FC<Props> = (props) => {
    const { title, navLinks = [] } = props;
    return (
        <MuiAppBar position="static" color="transparent" elevation={0}>
            <MuiToolbar disableGutters={true} sx={{ flexWrap: 'wrap' }}>
                {title && (
                    <MuiBox sx={{ mb: 1, mr: 2, flexGrow: 1 }}>
                        <MuiTypography component="p" variant="h6" color="text.primary" noWrap>
                            {title}
                        </MuiTypography>
                    </MuiBox>
                )}
                {navLinks.length > 0 && (
                    <MuiBox component="nav" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                {...link}
                                sx={{
                                    ...(index !== navLinks.length - 1 && { mr: 2 }),
                                    mb: 1
                                }}
                            />
                        ))}
                    </MuiBox>
                )}
            </MuiToolbar>
        </MuiAppBar>
    );
};
