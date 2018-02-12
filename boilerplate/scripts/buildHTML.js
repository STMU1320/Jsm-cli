const ejs = require('ejs')

const {
  dist,
  publicPath,
  title,
  description,
  hostName,
  port
} = require('../config.json')

const manifest = __DEV__ ? null : JSON.parse(
  fs.readFileSync(joinDirname('../', `./${dist}/${publicPath}/webpack-manifest.json`), 'utf8')
)
const vendorManifest = __DEV__ ? null : JSON.parse(
    fs.readFileSync(joinDirname('../', `./${dist}/${publicPath}/webpack-dll-manifest.json`), 'utf8')
  )

const name = 'app'

fs.writeFileSync(
  joinDirname(`../${dist}/${name}.html`),
  ejs.render(
    fs.readFileSync(joinDirname(`../src/views/${name}.ejs`), 'utf8'),
    {
      __DEV__,
      title,
      description,
      name: __DEV__ ? `${publicPath}/js/${name}.js` : `/${publicPath}/${manifest[`${name}.js`]}`,
      proxy: __DEV__ ? `http://${hostName}:${port}` : '',
      common: __DEV__ ? `${publicPath}/js/common.js` : `/${publicPath}/${manifest['common.js']}`,
      vendor: __DEV__ ? `${publicPath}/vendor.dev.dll.js` : `/${publicPath}/${vendorManifest['vendor.js']}`
    }
  )
)
