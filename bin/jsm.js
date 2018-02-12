#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const program = require('commander');
const common = require('./common');
const generate = require('./generate');
const init = require('./init');

const { message } = common;

function paramsToObj (paramsArr) {
  const params = {};
  paramsArr.forEach(item => {
      const kv = item.split('=')
      const key = kv[0]
      const value = kv[1] || kv[0]
      params[key] = value
    })
  return params;
}

if (process.argv.slice(2).join('') === '-v') {
  const pkg = require('../package');
  message.info('jsm-cli version ' + pkg.version);
  process.exit()
}

program
  .command('new [name]')
  .alias('n')
  .description('Creates a new project')
  .action(function (name) {
    const projectName = name || 'myApp';
    init({ app: projectName })
  });

  program
  .command('create <type> [name] [otherParams...]')
  .alias('c')
  .description('Generates new code')
  .action(function (type, name, otherParams) {
    const acceptList = ['component', 'route']
    if (!acceptList.find(item => item === type)) {
      message.light('create type must one of [component | route]')
      process.exit()
    }
    const params = paramsToObj(otherParams)
    params.name = name || 'example'
    generate({
      type,
      params
    })
  });

program.parse(process.argv);

const cmd = process.argv[2];
if (!['c', 'create', 'new', 'n'].includes(cmd)) {
  program.help();
}

