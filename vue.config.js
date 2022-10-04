const CopyWebpackPlugin = require('copy-webpack-plugin')
const { resolve } = require('path')

const copyFiles = [
  {
    from: resolve('src/plugins/manifest.json'),
    to: `${resolve('dist')}/manifest.json`,
  },
  {
    from: resolve('src/assets'),
    to: resolve('dist/assets'),
  },
]

// 配置插件
const plugins = [
  new CopyWebpackPlugin({
    patterns: copyFiles,
  }),
]

const pages = {}
// 配置 popup.html 页面
const chromeName = ['popup']
chromeName.forEach(name => {
  pages[name] = {
    entry: `src/${name}/main.js`,
    template: `src/${name}/index.html`,
    filename: `${name}.html`,
  }
})

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages,
  productionSourceMap: false,
  // 配置 content.js background.js
  configureWebpack: {
    devtool: false,
    entry: {
      background: './src/background/main.js',
    },
    output: {
      filename: 'js/[name].js',
    },
    plugins,
  },
  // 配置 content.css
  css: {
    extract: {
      filename: 'css/[name].css',
    },
  },
  // 【可选】去掉 chunk-vendors.js 后面那串 hash 值
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.output.filename('js/[name].js').end()
      config.output.chunkFilename('js/[name].js').end()
    }
  },
})
