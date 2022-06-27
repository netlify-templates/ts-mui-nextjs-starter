import { FC } from 'react';
import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { sourcebitDataClient } from 'sourcebit-target-next';
import { hotContentReload } from 'sourcebit-target-next/hot-content-reload';
import { Header } from '../components/sections/Header';
import { Footer } from '../components/sections/Footer';
import { DynamicComponent } from '../components/DynamicComponent';
import { PageProps as Props, findPageLayouts, toPageProps, urlPathForDocument } from '../utils/static-resolver-utils';

import MuiBox from '@mui/material/Box';
import MuiContainer from '@mui/material/Container';

const Page: FC<Props> = (props) => {
    const { page, site } = props;
    const siteMeta = site?.__metadata;
    const pageMeta = page?.__metadata;
    return (
        <MuiBox sx={{ px: 3 }} data-sb-object-id={pageMeta?.id}>
            <MuiContainer maxWidth="lg" disableGutters={true}>
                <Head>
                    <title>{page.title}</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    {site.favicon && <link rel="icon" href={site.favicon} />}
                </Head>
                {site.header && <Header {...site.header} data-sb-object-id={siteMeta?.id} />}
                {(page.sections ?? []).length > 0 && (
                    <MuiBox component="main" data-sb-field-path="sections">
                        {(page.sections ?? []).map((section, index) => (
                            <DynamicComponent key={index} {...section} data-sb-field-path={`.${index}`} />
                        ))}
                    </MuiBox>
                )}
                {site.footer && <Footer {...site.footer} data-sb-object-id={siteMeta?.id} />}
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
