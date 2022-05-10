const withSourcebit = require('sourcebit').sourcebitNext();

module.exports = withSourcebit({
    typescript: { ignoreBuildErrors: false },
    devIndicators: {
        autoPrerender: false
    },
    webpack: (config) => {
        config.watchOptions.ignored.push('/content/');
        return config;
    }
});