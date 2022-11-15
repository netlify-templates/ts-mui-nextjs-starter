import * as React from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import type * as types from 'types';
import { DynamicComponent } from '../components/DynamicComponent';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { pagesByType, siteConfig, urlToContent } from '../utils/content';

import MuiBox from '@mui/material/Box';
import MuiContainer from '@mui/material/Container';

export type Props = { page: types.Page; siteConfig: types.Config };

const Page: React.FC<Props> = ({ page, siteConfig }) => {
    return (
        <MuiBox sx={{ px: 3 }} data-sb-object-id={page.__id}>
            <MuiContainer maxWidth="lg" disableGutters={true}>
                <Head>
                    <title>{page.title}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    {siteConfig.favicon && <link rel="icon" href={siteConfig.favicon} />}
                </Head>
                {siteConfig.header && <Header {...siteConfig.header} data-sb-object-id={siteConfig.__id} />}
                {(page.sections ?? []).length > 0 && (
                    <MuiBox component="main" data-sb-field-path="sections">
                        {(page.sections ?? []).map((section, index) => (
                            <DynamicComponent key={index} {...section} data-sb-field-path={`.${index}`} />
                        ))}
                    </MuiBox>
                )}
                {siteConfig.footer && <Footer {...siteConfig.footer} data-sb-object-id={siteConfig.__id} />}
            </MuiContainer>
        </MuiBox>
    );
};

export default Page;

export const getStaticPaths: GetStaticPaths = () => {
    const pages = pagesByType('Page');
    return {
        paths: Object.keys(pages),
        fallback: false
    };
};

export const getStaticProps: GetStaticProps<Props, { slug: string[] }> = ({ params }) => {
    const url = '/' + (params?.slug || []).join('/');
    const page = urlToContent(url) as types.Page;
    return { props: { page, siteConfig: siteConfig() } };
};
