import type * as types from 'types';

export type SectionsProps = types.Sections;

export const mapSectionProps = async (sections: types.Sections[] = [], allDocuments: types.DocumentTypes[]): Promise<SectionsProps[]> => {
    return Promise.all(
        (sections ?? []).map(async (section) => {
            switch (section.type) {
                default:
                    return section;
            }
        })
    );
};
