#!/usr/bin/env sh

# This has a few useful commands for development

set -Eeuxo pipefail

# This installs the Webpack server I am using
# to run locally
function install_global_deps
{
     sudo npm install webpack-dev-server -g
}

# This installs all npm packages specified
# in packag.json
function install_local_deps
{
    npm install
}

# This starts the local server. The webpage
# will be at localhost:3000
function start
{
    webpack-dev-server --mode development
}

"$@"