#!/bin/bash
set -e
if [ -d "dist/app" ]; then
    find dist/app -maxdepth 1 -name "*.AppImage" -type f -delete
fi
npm run buildAppImage