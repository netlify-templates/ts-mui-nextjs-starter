import type * as types from 'types';

import { mapSectionProps } from '../../sections/mapSectionProps';
import type { Props as PageLayoutProps } from './index';

export const mapProps = async (page: types.PageLayout, allDocuments: types.DocumentTypes[]): Promise<PageLayoutProps> => {
    const sections = await mapSectionProps(page.sections, allDocuments);

    return {
        ...page,
        sections
    };
};
