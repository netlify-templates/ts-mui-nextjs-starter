import * as React from 'react';
import Head from 'next/head';
import { toObjectId } from '@stackbit/annotations';
import { Header } from '../../sections/Header';
import { Footer } from '../../sections/Footer';
import type { PageProps, AllPageLayoutProps } from '../index';

import MuiBox from '@mui/material/Box';
import MuiContainer from '@mui/material/Container';

export const BaseLayout: React.FC<PageProps<AllPageLayoutProps>> = (props) => {
    const { page, site } = props;
    const siteMeta = site?.__metadata;
    const pageMeta = page?.__metadata;
    return (
        <MuiBox sx={{ px: 3 }} {...toObjectId(pageMeta?.id)}>
            <MuiContainer maxWidth="lg" disableGutters={true} sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Head>
                    <title>{page.title}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    {site.favicon && <link rel="icon" href={site.favicon} />}
                </Head>
                {site.header && <Header {...site.header} {...toObjectId(siteMeta?.id)} />}
                {props.children}
                {site.footer && <Footer {...site.footer} {...toObjectId(siteMeta?.id)} />}
            </MuiContainer>
        </MuiBox>
    );
};
