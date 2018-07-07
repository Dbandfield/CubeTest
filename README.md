# Cube Test

## Overview

NOT ALL SCRIPTS IMPLEMENTED

This is an app demonstrating WebGL interaction. Users can create cube primitives within a 3D scene and then adjust various properties of them through a HTML GUI. The 3D scene is handled via three.js and the dynamic GUI with React.

It has been tested on: 

## Running

You can either view this app by visiting this Heroku site PENDING LINK or by cloning this repo and running locally.

### Running Locally

You must have npm installed.

Once you have cloned the repo run the following commands to install dependencies. 

- `cd CubeTest`
- `./run.sh install_global_deps`  This installs the webpack development server globally. On Linux this requires `sudo`.
- `./run.sh install_project_deps` This installs project dependencies
- `./run.sh start_server` This starts the server. You can then visit the app at `localhost:3000` in your browser.

## Testing

Testing is done via Wercker when deployed to Github. To test locally run

``` './run.sh test ```