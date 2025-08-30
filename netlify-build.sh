#!/bin/bash

# Exit on any error
set -e

# Remove any existing Next.js plugin
npm uninstall -g @netlify/plugin-nextjs || true

# Install dependencies
npm install --include=dev
npm install -g vite

# Build the project
npm run build

# Exit with success
exit 0
