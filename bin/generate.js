const fs = require('fs-extra');
const path = require('path');
const common = require('./common');
const templatePath = '../template/';
const stateFile = 'State.st';
const statelessFile = 'Stateless.st';
const routeFile = 'route.st';
const modelFile = 'model.st';
const styleFile = 'style.st';
const {copyTemplate, write, mkdir, message, sep, exportCodeGenerator } = common;

function camelCaseFn(str) {
  return `${str.slice(0, 1).toUpperCase()}${str.slice(1)}`;
}

function getFileName({name, camelCase, suffix = 'ts'}) {
  return camelCase ? `${camelCaseFn(name)}.${suffix}` : `${name}.${suffix}`;
}

function findPkgPath (dir) {
  if (dir.split(path.sep).length === 2) return ''
  const pkg = path.join(dir, './package.json')
  let pkgPath = ''
  try {
    if (fs.existsSync(pkg)) {
      return dir;
    } else {
      pkgPath = findPkgPath(path.dirname(dir))
    }
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
  return pkgPath
}

function createComponent(dir, params) {
  const cmName = params.name;
  const cmNameUppercase = camelCaseFn(cmName);
  const cmPath = `${dir}${sep}${cmNameUppercase}`;
  const fileName = getFileName({ name: 'index', suffix: 'tsx' });
  const templateFile = params.state ? stateFile : statelessFile;
  const content = params.content || 'Jsm component';
  if(fs.existsSync(cmPath)) {
    message.error(`the ${cmName} component exist!`)
    process.exit();
  } else {
    fs
    .ensureDir(cmPath)
    .then(() => {
      copyTemplate(`${templatePath}${templateFile}`, `${cmPath}/${fileName}`, {
        name: cmNameUppercase,
        content,
      });
      message.success('Create component success!');
      message.success(` cd to '${cmPath}' check it`);
      console.log()
      try {
        fs.appendFileSync(`${dir}${sep}/index.ts`, exportCodeGenerator('component', {  name: cmName, uppercaseName: cmNameUppercase }));
      } catch (error) {
        message.error('Can\'t append to index.ts file, maybe this file non-existent!')
      } finally {
        process.exit(0)
      }
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
  }
}

function createRoute(dir, params) {
  const namespace = params.name;
  const namespaceUppercase = camelCaseFn(namespace);
  const routePath = `${dir}${sep}${namespaceUppercase}`;
  const routeName = getFileName({name: 'index', suffix: 'tsx'});
  const styleName = getFileName({name: 'style', suffix: 'less'});
  const modelName = getFileName({name: 'model', suffix: 'ts'});
  const content = params.content || 'Jsm route';
  if(fs.existsSync(routePath)) {
    message.error(`the ${namespace} route exist!`)
    process.exit();
  } else {
    fs
    .ensureDir(routePath)
    .then(() => {
      // 拷贝route模版
      copyTemplate(`${templatePath}${routeFile}`, `${routePath}/${routeName}`, {
        ...params,
        name: camelCaseFn(namespace).split('.')[0],
        namespace,
        content,
      });
      // 拷贝model
      copyTemplate(`${templatePath}${modelFile}`, `${routePath}/${modelName}`, {
        ...params,
        namespace,
      });

      // 拷贝style
      copyTemplate(`${templatePath}${styleFile}`, `${routePath}/${styleName}`, {
        ...params,
      });

      message.success('Create route success!');
      message.success(` cd to '${routePath}' check it`);
      console.log();

      try {
        const rootModelFile = path.join(path.dirname(dir), './model.ts');
        console.log(rootModelFile)
        fs.appendFileSync(rootModelFile, exportCodeGenerator('model', {  name: namespace, uppercaseName: namespaceUppercase }));
      } catch (error) {
        message.error('Can\'t append to model.ts file, maybe this file non-existent!')
      } finally {
        process.exit(0)
      }
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
  }
}

function generate({type, params}) {
  const pkgPath = findPkgPath(process.cwd())
  if (!pkgPath) {
    message.error('No \'package.json\' file was found for the project.')
    process.exit()
  }
  const dist = path.join(pkgPath, `./src/${type}s`);
  fs
    .ensureDir(dist)
    .then(() => {
      switch (type) {
        case 'component':
          createComponent(dist, params);
          break;

        case 'route':
          createRoute(dist, params);
          break;

        default:
          break;
      }
    })
    .catch(err => {
      console.log(err);
      process.exit(1);
    });
}

module.exports = generate;
