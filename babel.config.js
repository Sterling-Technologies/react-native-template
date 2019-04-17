module.exports = function(api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
          ['module-resolver', {
            root: ['./'],
            alias: {
              '@assets': './assets',
              '@components': './src/component',
              '@config': './config',
              '@library': './src/library',
              '@module': './src/module',
              '@screen': './src/screen'
            },
            extensions: ['.ios.js', '.android.js', '.js', '.json']
          }]
        ]
    };
};
