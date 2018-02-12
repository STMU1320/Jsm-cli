const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')
const WebpackBuildDllPlugin = require('webpack-build-dll-plugin')

const theme = require('./src/theme/config')()

const __DEV__ = process.env.NODE_ENV !== 'production'
const {
  dist,
  publicPath,
  prodPublic,
  hostName,
  port,
  webpackManifestName
} = require('./config.json')

const projectPath = path.resolve('src')
const nodeModules =  path.resolve('node_modules')
const hash = __DEV__ ? '' : '.[hash:base64:5]'
const normalUrlLoader = __DEV__ ? 'file?' : 'url?limit=2048&'

const postcssOptions = {
  plugins: loader => [
    require('postcss-cssnext')({ browsers: ['> 0%'], remove: false }),
    require('postcss-nested')({ bubble: ['phone'] }),
    require('postcss-simple-vars'),
    require('postcss-import'),
    require('postcss-modules-values')
  ]
}

module.exports = {
  devtool: __DEV__ ? 'cheap-module-eval-source-map' : void 0,
  entry: {
    app: [
      ...(__DEV__
        ? [
            'babel-polyfill',
            'react-hot-loader/patch',
            `webpack-hot-middleware/client?host=0.0.0.0&port=${port}/__webpack_hmr&hot=true&reload=false`,
            'webpack/hot/only-dev-server'
          ]
        : []),
      './src/index.tsx'
    ]
  },
  output: {
    path: path.resolve(dist),
    publicPath: __DEV__ ? `${publicPath}/` : `${prodPublic}${publicPath}/`,
    filename: `js/[name]${__DEV__ ? '' : '.[hash:5]'}.js`,
    chunkFilename: `js/[name]${__DEV__ ? '' : '.[chunkhash:5]'}.js`
  },
  resolve: {
    extensions: ['.webpack.js', '.js', '.jsx', '.ts', '.tsx', '.less'],
    modules: ['./node_modules', './src'],
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
    }
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: `babel${__DEV__ ? `?cacheDirectory=${dist}/babelCacheDev` : ''}`,
        include: [projectPath],
        exclude: [/(node_modules|bower_components)/]
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'awesome-typescript',
          query: {
            configFileName: path.resolve(__dirname, './tsconfig.json'),
            useBabel: __DEV__,
            useCache: __DEV__,
            useTranspileModule: __DEV__,
            forkChecker: __DEV__,
            cacheDirectory: __DEV__
              ? `${dist}${publicPath}/awesomeTypescriptCacheDev`
              : void 0
          }
        }
      },
      {
        test: /\.(s?c|sa)ss$/,
        use: [
          'style-loader',
          `css?modules&importLoaders=1&localIdentName=${__DEV__ ? '[local]_' : ''}[hash:base64:5]&-autoprefixer`,
          { loader: 'postcss-loader', options: postcssOptions },
        ],
        include: [projectPath]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          `css?modules&importLoaders=1&localIdentName=${__DEV__ ? '[local]_' : ''}[hash:base64:5]&-autoprefixer`,
          { loader: 'postcss-loader', options: postcssOptions },
          'less-loader'
        ],
        include: [projectPath]
      },
      {
        test: /\.less$/,
        use: [
          'style',
          'css?importLoaders=1&-autoprefixer',
          { loader: 'postcss-loader', options: postcssOptions },
          `less?{"modifyVars":${JSON.stringify(theme)}}`
        ],
        include: [nodeModules]
      },
      {
        test: /\.css$/,
        use: ['style', 'css'],
        exclude: [projectPath]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: `${normalUrlLoader}name=images/[name]${hash}.[ext]`
      },
      {
        test: /\.svg$/,
        loader: `${normalUrlLoader}name=images/[name]${hash}.[ext]`
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: `${normalUrlLoader}name=fonts/[name]${hash}.[ext]`
      }
    ]
  },
  plugins: [
    new WebpackBuildDllPlugin({
      dllConfigPath: './webpack.dll.config.js'
    }),
    new WebpackMd5Hash(),
    new ManifestPlugin({ fileName: `${webpackManifestName}.json` }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      __DEV__,
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['common']
    }),
    new webpack.DllReferencePlugin({
      context: `./${dist}`,
      manifest: require(`./${dist}${publicPath}/webpack-vendor-manifest${__DEV__ ? '.dev' : '.prod'}.json`)
    })
  ].concat(
    __DEV__
      ? [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin()
        ]
      : [
          new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            sourceMap: false,
            compress: { warnings: false }
          })
        ]
  )
}
