const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const builder = require('electron-builder')
const Arch = builder.Arch

const packageFile = require('./../package.json')
const version = packageFile.version
const platform = process.argv.find(arg => arg.match('platform')).split('=')[1]

function toArch (platform) {
  switch (platform) {
    case 'x86':
      return Arch.x64
    case 'arm64':
      return Arch.arm64
  }
}

require('./createPackage.js')('mac', { arch: toArch(platform) }).then(async function (packagePath) {
  if (platform === 'arm64') {
    execSync('codesign -s - -a arm64 -f --deep ' + packagePath + '/Min.app')
  }

  const options = {
    mac: {
      target: ['zip', 'dmg'],
      icon: 'icons/icon.icns',
      publish: {
        provider: 'github',
        owner: 'acierto-incomodo',
        repo: 'StormBrowser-V2'
      }
    },
    directories: {
      output: 'dist/app/'
    },
    publish: {
      provider: 'github',
      owner: 'acierto-incomodo',
      repo: 'StormBrowser-V2'
    }
  }

  await builder.build({
    prepackaged: packagePath,
    targets: Platform.MAC.createTarget(['zip', 'dmg'], toArch(platform)),
    config: options
  })
})
