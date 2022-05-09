import * as types from 'types';

export type AllPageLayoutProps = types.PageLayout;

export type Site = types.Config & { env?: Record<string, string> };

export type PageProps<T extends AllPageLayoutProps> = {
    site: Site;
    page: T;
};
