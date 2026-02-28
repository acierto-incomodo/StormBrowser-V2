#!/bin/bash
set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SCRIPT_NAME=$(basename "$0")

for f in "$SCRIPT_DIR"/*.sh; do
  if [ "$(basename "$f")" != "$SCRIPT_NAME" ]; then
    echo "Running $(basename "$f")..."
    bash "$f"
  fi
done