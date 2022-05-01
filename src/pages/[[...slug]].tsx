import { FC } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { sourcebitDataClient } from 'sourcebit-target-next';
import { hotContentReload } from 'sourcebit-target-next/hot-content-reload';

import type { PageProps } from '../components/layouts';
import { BaseLayout } from '../components/layouts/BaseLayout';
import { PageLayout, Props as PageLayoutProps } from '../components/layouts/PageLayout';
import { findPageLayouts, toPageProps, urlPathForDocument } from '../utils/static-resolver-utils';
import { mapProps as mapPageLayoutProps } from '../components/layouts/PageLayout/mapProps';

export type Props = PageProps<PageLayoutProps>;

const Page: FC<Props> = (props) => {
    const { page, site } = props;
    return (
        <BaseLayout site={site} page={page}>
            <PageLayout {...page} />
        </BaseLayout>
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
    const pageLayoutProps = await mapPageLayoutProps(page, documents);
    const props = toPageProps(pageLayoutProps, urlPath, documents);
    return { props };
};
