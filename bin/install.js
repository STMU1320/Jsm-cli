const which = require('which');

function runCmd({cmd, success, cwd, params}) {
  params = params || [];
  const runner = require('child_process').spawn(cmd, params, {
    // keep color
    cwd,
    stdio: 'inherit',
  });
  runner.on('close', function(code) {
    success && success(code);
  });
}

function findNpm() {
  const npms = process.platform === 'win32'
    ? ['yarn.cmd', 'tnpm.cmd', 'cnpm.cmd', 'npm.cmd']
    : ['yarn', 'tnpm', 'cnpm', 'npm'];
  for (var i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      console.log('use npm: ' + npms[i]);
      return npms[i];
    } catch (e) {}
  }
  throw new Error('please install npm');
}

module.exports = function install({success, cwd}) {
  const npm = findNpm();
  runCmd({
    cmd: which.sync(npm),
    params: ['install'],
    success,
    cwd,
  });
};
