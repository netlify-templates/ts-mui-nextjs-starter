import * as React from 'react';
import { toFieldPath } from '@stackbit/annotations';
import type * as types from 'types';

import { DynamicComponent } from '../../DynamicComponent';

import MuiBox from '@mui/material/Box';

export type Props = types.PageLayout;

export const PageLayout: React.FC<Props> = (page) => {
    const { sections = [] } = page;
    return (
        <>
            {sections.length > 0 && (
                <MuiBox component="main" sx={{ flexGrow: 1 }} {...toFieldPath('sections')}>
                    {sections.map((section, index) => (
                        <DynamicComponent key={index} {...section} {...toFieldPath(`sections.${index}`)} />
                    ))}
                </MuiBox>
            )}
        </>
    );
};
