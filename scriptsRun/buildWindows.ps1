if (Test-Path "dist/app") { Remove-Item "dist/app/*.exe", "dist/app/*.blockmap" -Force -ErrorAction SilentlyContinue }
npm run buildWindows