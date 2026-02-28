const builder = require('electron-builder')
const packageFile = require('./../package.json')
const version = packageFile.version
const Platform = builder.Platform
const Arch = builder.Arch

require('./createPackage.js')('linux', {arch: Arch.x64}).then(function (path) {
  const publishConfig = {
    provider: 'github',
    owner: 'acierto-incomodo',
    repo: 'StormBrowser-V2'
  }
  if (process.env.RELEASE_TYPE === 'prerelease') {
    publishConfig.releaseType = 'prerelease'
  }
  const options = {
    linux: {
      target: ['AppImage'],
      icon: 'icons/icon256.png',
      category: 'Network',
      packageCategory: 'Network',
      mimeTypes: ['x-scheme-handler/http', 'x-scheme-handler/https', 'text/html'],
      synopsis: 'StormBrowser is a fast, stormbrowserimal browser that protects your privacy.',
      description: 'A web browser with smarter search, improved tab management, and built-in ad blocking. Includes full-text history search, instant answers from DuckDuckGo, the ability to split tabs into groups, and more.',
      maintainer: 'StormBrowser Developers <280953907a@zoho.com>',
    },
    directories: {
      output: 'dist/app/'
    },
    publish: publishConfig
  }

  builder.build({
    prepackaged: path,
    targets: Platform.LINUX.createTarget(['AppImage'], Arch.x64),
    config: options
  })
})
