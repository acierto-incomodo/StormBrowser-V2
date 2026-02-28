if (Test-Path "dist/app") { Remove-Item -Recurse -Force "dist/app" }
npm run buildAll