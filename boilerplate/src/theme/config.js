const fs = require('fs')
const path = require('path')
const lessToJs = require('less-vars-to-js')

module.exports = () => {
  const themePath = path.join(__dirname, './custom.less')
  const customTheme =  lessToJs(fs.readFileSync(themePath, 'utf8'))
  // console.log(customTheme)
  return customTheme
}