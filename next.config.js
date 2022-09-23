module.exports = {
    typescript: { ignoreBuildErrors: false },
    webpack: (config) => {
        config.watchOptions.ignored.push('**/content/');
        return config;
    }
};
