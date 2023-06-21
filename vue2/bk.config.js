module.exports = {
  host: process.env.BK_APP_HOST,
  port: process.env.BK_APP_PORT,
  publicPath: process.env.BK_STATIC_URL,
  cache: true,
  open: true,
  replaceStatic: false,
  parseNodeModules: false,
  splitChunk: false,
  splitCss: false,
  clean: false,
  target: process.env.BK_TARGET,
  libraryTarget: process.env.LIBRARY_TARGET,
  libraryName: 'lesscodeCustomComponentLibrary',
  resource: {
    main: {
      entry: process.env.BK_ENTRY,
      html: {
        filename: 'index.html',
        template: './index.html',
      },
    },
  },
  configureWebpack() {
    if (process.env.NODE_ENV === 'production') {
      return {
        externals: {
          vue: 'Vue',
        },
      };
    }
  },
  chainWebpack(config) {
    const fileName = process.env.LIBRARY_TARGET === 'var' ? 'index.iife.min.js' : 'index.umd.min.js';
    if (process.env.NODE_ENV === 'production') {
      config.output
        .filename(fileName);
    }
    return config;
  },
};
