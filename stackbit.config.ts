
import { defineStackbitConfig } from '@stackbit/types';

export const sbConfig = defineStackbitConfig({
    "stackbitVersion": "~0.6.0",
    "nodeVersion": "18",
    "ssgName": "nextjs",
    "contentSources": [],
    "postInstallCommand": "npm i --no-save @stackbit/types"
})
