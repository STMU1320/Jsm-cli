const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const ManifestPlugin = require('webpack-manifest-plugin')

const __DEV__ = process.env.NODE_ENV !== 'production'
const { dist, publicPath, webpackDllManifestName } = require('./config.json')

const excludeVendor = ['react-native', 'react-router-native']
const vendor = __DEV__ ? (
  Object.keys(JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8')).dependencies).filter(vendor => !excludeVendor.includes(vendor))
) : [
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'moment',
  'redux',
  'redux-saga',
  'classnames'
]
const library = `[name]${__DEV__ ? '_dev' : '_prod'}_lib`
module.exports = {
  entry: { vendor },
  output: {
    filename: `[name]${__DEV__ ? '.dev' : '.prod'}${__DEV__ ? '' : '.[hash:5]'}.dll.js`,
    path: path.resolve(`./${dist}/${publicPath}`),
    library
  },
  plugins: [
    new ManifestPlugin({ fileName: `${webpackDllManifestName}.json` }),
    new webpack.DllPlugin({
      path: path.resolve(`./${dist}/${publicPath}/webpack-[name]-manifest${__DEV__ ? '.dev' : '.prod'}.json`),
      name: library,
      context: `./${dist}`
    }),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) })
  ].concat(__DEV__ ? [] :[
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ])
}
