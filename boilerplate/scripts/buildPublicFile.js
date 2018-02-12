const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const mkdirp = require('mkdirp')
const { green } = require('chalk')
const { join, relative, extname } = path

const __DEV__ = process.env.NODE_ENV !== 'production'
const {
  dist,
  publicPath,
  hostName,
  title,
  description,
  port,
  entries
} = require('../config.json')

const joinDirname = (...paths) => join(__dirname, ...paths)
const publicDir = joinDirname('../public')
const buildPath = joinDirname(`../${dist}/${publicPath}`)

if (!fs.existsSync(buildPath)) {
  mkdirp(buildPath, (err) => {
    err && console.error(err)
  })
}

const fileWatcher = (eventType, absolutePath) => {
  const startTime = new Date()
  const excludePattern = /node_modules/
  const pathExtname = extname(absolutePath)
  const relativePath = relative(publicDir, absolutePath)
  let outFileName = join(__dirname, `../${dist}`, relativePath)

  if (excludePattern.test(absolutePath)) {
    return
  }

  if (['.ts'].includes(pathExtname)) {
    const UglifyJS = require('uglify-js')
    const tsc = require('typescript')
    const tsConfig = require('../tsconfig.json')
    let originCode = fs.readFileSync(absolutePath, 'utf8')
    if (/service-worker\.ts/.test(relativePath)) {
      if (!__DEV__) {
        originCode = originCode.replace(/(const\sVERSION\s=\s\")(.*)(\"\;)/g, (match, p1, p2, p3) => [p1, `${+p2.split('.').join('') + 1}`.split('').join('.'), p3].join(''))
        fs.writeFileSync(absolutePath, originCode, 'utf8')
      }
      originCode = originCode.replace(/\/\*ReplaceStaticFiles\*\//, `"/static/vendors.${__DEV__ ? 'dev' : 'prod'}.dll.js" ,`)
    }
    const codeStr = tsc.transpile(
      originCode,
      Object.assign(
        {},
        tsConfig.compilerOptions,
        { sourceMap: false, module: 'es5' }
      )
    )
    let result = codeStr
    if (!__DEV__) {
      try {
        result = UglifyJS.minify(codeStr, { fromString: true, mangle: { toplevel: true } }).code
      } catch(e) {}
    }
    outFileName = outFileName.replace(extname(outFileName), '.js')
    fs.writeFileSync(outFileName, result, 'utf8')

  } else  {
    const enCode = /\.jpe?g$|\.png$|\.gif|\.ico$/.test(pathExtname) ? 'base64' : 'utf8'
    if (fs.lstatSync(absolutePath).isDirectory()) {
      if (!fs.existsSync(outFileName)) mkdirp(outFileName)
    } else {
      fse.copySync(absolutePath, outFileName)
    }
  }
  console.log(green(`${relativePath} built ${outFileName} in ${Date.parse(new Date().toString()) - Date.parse(startTime.toString())}ms`))
}


const buildDirFiles = (dir) => {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const absolutePath = join(dir, file)
    if (fs.lstatSync(absolutePath).isDirectory()) {
      buildDirFiles(absolutePath)
    }
    fileWatcher(null, absolutePath)
  }
}

buildDirFiles(publicDir)

if (__DEV__) {
  fs.watch(publicDir, (eventType, filename) => {
    fileWatcher(eventType, join(publicDir, filename))
  })
}


const manifest = __DEV__ ? null : JSON.parse(
  fs.readFileSync(joinDirname('../', `./${dist}/${publicPath}/webpack-manifest.json`), 'utf8')
)
const vendorManifest = __DEV__ ? null : JSON.parse(
  fs.readFileSync(joinDirname('../', `./${dist}/${publicPath}/webpack-dll-manifest.json`), 'utf8')
)

const ejs = require('ejs')
const name = 'app'
fs.writeFileSync(
  joinDirname(`../${dist}/index.html`),
  ejs.render(
    fs.readFileSync(joinDirname('../src/views/index.ejs'), 'utf8'),
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
