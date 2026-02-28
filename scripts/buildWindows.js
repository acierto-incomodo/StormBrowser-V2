const fs = require('fs')
const builder = require('electron-builder')
const path = require('path')
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses')

const packageFile = require('./../package.json')
const version = packageFile.version

async function buildWindows () {
  console.log('Building Windows packages (x64, ia32, arm64)...')

  const publishConfig = {
    provider: 'github',
    owner: 'acierto-incomodo',
    repo: 'StormBrowser-V2'
  }
  if (process.env.RELEASE_TYPE === 'prerelease') {
    publishConfig.releaseType = 'prerelease'
  }

  const afterPack = async context => {
    const electronBinaryPath = path.join(
      context.appOutDir,
      `${context.packager.appInfo.productFilename}.exe`
    )

    await flipFuses(electronBinaryPath, {
      version: FuseVersion.V1,
      [FuseV1Options.GrantFileProtocolExtraPrivileges]: false
    })
  }

  const options = {
    appId: packageFile.name,
    productName: packageFile.productName,
    win: {
      target: [
        {
          target: 'nsis',
          arch: ['x64', 'ia32', 'arm64']
        },
        {
          target: 'zip',
          arch: ['x64', 'ia32', 'arm64']
        }
      ],
      icon: 'icons/icon256.ico',
      publish: publishConfig
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      artifactName: 'stormbrowser-${version}-${arch}-setup.exe',
      license: 'LICENSE.txt',
      differentialPackage: true
    },
    directories: {
      output: 'dist/app/',
      buildResources: 'resources'
    },
    files: [
      '**/*',
      '!**/{.DS_Store,.git,.hg,.svn,CVS,RCS,SCCS,.gitignore,.gitattributes}',
      '!**/{appveyor.yml,.travis.yml,circle.yml}',
      '!**/node_modules/*.d.ts',
      '!**/*.map',
      '!**/*.md',
      '!**/._*',
      '!**/icons/source',
      '!dist/app',
      '!**/icons/icon.icns',
      '!localization/',
      '!scripts/',
      '!**/main',
      '!**/node_modules/@types/',
      '!**/node_modules/pdfjs-dist/legacy',
      '!**/node_modules/pdfjs-dist/lib',
      '!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}'
    ],
    protocols: [
      {
        name: 'HTTP link',
        schemes: ['http', 'https']
      },
      {
        name: 'File',
        schemes: ['file']
      }
    ],
    asar: false,
    afterPack: afterPack,
    npmRebuild: false,
    publish: publishConfig
  }

  await builder.build({
    config: options
  })
    .then(() => console.log('Successfully created packages.'))
    .catch(err => {
      console.error(err, err.stack)
      process.exit(1)
    })
}

buildWindows()
