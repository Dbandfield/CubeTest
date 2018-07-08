#!/usr/bin/env sh

# This has a few useful commands for development

set -Eeuxo pipefail

function start
{
    webpack-dev-server --mode development
}

"$@"