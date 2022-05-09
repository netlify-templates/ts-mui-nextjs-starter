import { FC } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { sourcebitDataClient } from 'sourcebit-target-next';
import { hotContentReload } from 'sourcebit-target-next/hot-content-reload';
import { toObjectId, toFieldPath } from '@stackbit/annotations';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { DynamicComponent } from '../components/DynamicComponent';
import { findPageLayouts, toPageProps, urlPathForDocument } from '../utils/static-resolver-utils';
import * as types from 'types';

import MuiBox from '@mui/material/Box';
import MuiContainer from '@mui/material/Container';

export type Props = {
    site: types.Config & { env?: Record<string, string> };
    page: types.PageLayout;
};

const Page: FC<Props> = (props) => {
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
                {(page.sections ?? []).length > 0 && (
                    <MuiBox component="main" sx={{ flexGrow: 1 }} {...toFieldPath('sections')}>
                        {(page.sections ?? []).map((section, index) => (
                            <DynamicComponent key={index} {...section} {...toFieldPath(`sections.${index}`)} />
                        ))}
                    </MuiBox>
                )}
                {site.footer && <Footer {...site.footer} {...toObjectId(siteMeta?.id)} />}
            </MuiContainer>
        </MuiBox>
    );
};

const withHotContentReload = hotContentReload({ disable: process.env.NODE_ENV === 'production' });
export default withHotContentReload(Page);

export const getStaticPaths: GetStaticPaths = async () => {
    const data = await sourcebitDataClient.getData();
    const documents = data.objects;
    const paths = findPageLayouts(documents).map((page) => urlPathForDocument(page));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props, { slug: string[] }> = async ({ params }) => {
    const data = await sourcebitDataClient.getData();
    const documents = data.objects;
    const urlPath = '/' + (params?.slug || []).join('/');
    const page = findPageLayouts(documents).find((page) => urlPathForDocument(page) === urlPath)!;
    const props = toPageProps(page, urlPath, documents);
    return { props };
};
