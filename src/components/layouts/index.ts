import * as types from 'types';

import type { Props as PageLayoutProps } from './PageLayout';

export type AllPageLayoutProps = PageLayoutProps;

export type Site = types.Config & { env?: Record<string, string>; baseLayout?: string };

export type PageProps<T extends AllPageLayoutProps> = {
    site: Site;
    page: T & { baseLayout?: string };
};
