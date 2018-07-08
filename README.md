# Cube Test

## Overview

This is an app demonstrating WebGL interaction. Users can create cube primitives within a 3D scene and then adjust various properties of them through a HTML GUI. The 3D scene is handled via three.js and the dynamic GUI with React.

It has been tested on Google Chrome and Firefox on Arch Linux 64bit.

## Running

You can use this app by cloning this repo and running it locally.

### Running Locally

You must have npm installed.

Once you have cloned the repo run the following commands to install dependencies.

- `cd CubeTest`
- `./run.sh install_global_deps`  This installs the webpack development server globally. On Linux this requires `sudo`.
- `./run.sh install_project_deps` This installs project dependencies
- `./run.sh start` This starts the server. You can then visit the app at `localhost:3000` in your browser.

### Windows and MacOS

The bash script won't run on Windows easily and has not been tested on MacOS. In the event that it doesn't work please manually run the following commands:

- Enter the repo: `cd CubeTest`

- Install dev server: `npm install webpack-dev-server -g`

- Install project dependencies: `npm install`

- Start Server: `webpack-dev-server --mode development`

- Go to `localhost:3000` in your browser.