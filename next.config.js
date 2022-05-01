const withSourcebit = require('sourcebit').sourcebitNext();

module.exports = withSourcebit({
    typescript: { ignoreBuildErrors: false },
    trailingSlash: true,
    devIndicators: {
        autoPrerender: false
    },
    eslint: {
        // Allow production builds to successfully complete even if your project has ESLint errors.
        ignoreDuringBuilds: true
    },
    webpack: (config, { dev }) => {
        // Tell webpack to ignore watching content files in the content folder.
        // Otherwise webpack recompiles the app and refreshes the whole page.
        // Instead, the src/pages/[...slug].js uses the "withRemoteDataUpdates"
        // function to update the content on the page without refreshing the
        // whole page
        config.watchOptions.ignored.push('/content/');
        if (dev) {
            // enable tree shaking for development mode, on production it is on by default
            // config.optimization.usedExports = true;
        }

        return config;
    }
});
