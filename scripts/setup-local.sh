#!/usr/bin/env bash
set -euo pipefail

npm install
npm run assets:manifest

echo "Setup complete"
