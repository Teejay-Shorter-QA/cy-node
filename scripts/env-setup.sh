#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Git related things
export GITHUB_SHA=$(git rev-parse --short HEAD)
export GITHUB_BRANCH=$(git rev-parse --abbrev-ref HEAD)