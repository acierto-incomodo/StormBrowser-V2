const fs = require('fs')
const builder = require('electron-builder')
const Arch = builder.Arch

const packageFile = require('./../package.json')
const version = packageFile.version

const createPackage = require('./createPackage.js')

async function afterPackageBuilt (packagePath) {
  let arch
  if (packagePath.includes('ia32')) {
    arch = Arch.ia32
  } else if (packagePath.includes('arm64')) {
    arch = Arch.arm64
  } else {
    arch = Arch.x64
  }

  console.log('Creating package (this may take a while)')

  const options = {
    win: {
      target: ['nsis', 'zip'],
      icon: 'icons/icon256.ico',
      publish: {
        provider: 'github',
        owner: 'acierto-incomodo',
        repo: 'StormBrowser-V2'
      }
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      artifactName: 'min-${version}-${arch}-setup.exe',
      license: 'LICENSE.txt'
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
    targets: Platform.WINDOWS.createTarget(['nsis', 'zip'], arch),
    config: options
  })
    .then(() => console.log('Successfully created package.'))
    .catch(err => {
      console.error(err, err.stack)
      process.exit(1)
    })
}

// creating multiple packages simultaneously causes errors in electron-rebuild, so do one arch at a time instead
createPackage('win32', { arch: Arch.x64 })
  .then(afterPackageBuilt)
  .then(function () {
    return createPackage('win32', { arch: Arch.ia32 })
  })
  .then(afterPackageBuilt)
  .then(function () {
    return createPackage('win32', { arch: Arch.arm64 })
  })
  .then(afterPackageBuilt)
