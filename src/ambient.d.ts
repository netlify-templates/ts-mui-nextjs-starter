declare module 'sourcebit-target-next' {
    import * as types from 'types';
    export type SourcebitDataClient = {
        getData: () => Promise<{ pages: any[]; objects: types.DocumentTypes[] }>;
    };

    const sourcebitDataClient: SourcebitDataClient;
}

declare module 'sourcebit-target-next/with-remote-data-updates' {
    import { ComponentType } from 'React';
    const withRemoteDataUpdates: <T, P extends ComponentType<P>>(component: T) => T;
}

declare module 'sourcebit-target-next/hot-content-reload' {
    import { ComponentType } from 'React';
    type HotContentReloadOptions = {
        disable?: boolean;
        port?: number | string;
        namespace?: string;
        eventName?: string;
    };
    const hotContentReload: (options: HotContentReloadOptions) => <T, P extends ComponentType<P>>(component: T) => T;
}
