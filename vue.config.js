module.exports = {
  lintOnSave: false,
  devServer: {
    open: true,
    https: false,
    port: 9527,
  },
  assetsDir: 'static',
  outputDir: 'docs',
  publicPath: './',
  productionSourceMap: process.env.NODE_ENV === 'production' ? false : true
};