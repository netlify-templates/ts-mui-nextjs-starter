const withSourcebit = require('sourcebit').sourcebitNext();

module.exports = withSourcebit({
    typescript: { ignoreBuildErrors: false },
    devIndicators: {
        autoPrerender: false
    }
});
