#!/bin/bash

ENV=$1

function echoYellow() {
  MSG=$1
  printf "\033[1;33m$MSG\033[0m\n"
}

echo
echoYellow "|--------------------------------------------------------|"
echoYellow "| Building the application with Bash and Webpack         |"   
echoYellow "|--------------------------------------------------------|\n"

#if [ "$ENV" == "dev" ]; then
#  export NODE_ENV=development
#else
#  export NODE_ENV=production
#fi

#echoYellow "  1. Cleaning up & copying files"
echoYellow "  1. Copying files"

# Removing the dist folder. Important for development environement. 
#if [ -d ./dist ]; then
#  echoYellow "     -> Removing all files from the /dist folder"
#  rm -rf ./dist/*
#fi

echoYellow "     -> Creating the server view folders"
mkdir -p ./server/views/system ./server/views/layouts

echoYellow "     -> Copying error.handlebars to server/views/system folder"
cp -R ./node_modules/@kth/kth-node-web-common/lib/handlebars/pages/views/. server/views/system

echoYellow "     -> Copying errorLayout.handlebars to server/views/layouts folder"
cp -R ./node_modules/@kth/kth-node-web-common/lib/handlebars/pages/layouts/. server/views/layouts

if [ "$ENV" == "prod" ]; then
  echo
  echoYellow "  2. Bundling the client app into the /dist folder\n"
  WEBPACK_ENV=prod WEBPACK_MODE=build webpack

  echo
  echoYellow "  Done.\n"
fi

if [ "$ENV" == "dev" ]; then
  echo
  echoYellow "  2. Bundling the client app into the /dist folder to list results\n"
  WEBPACK_ENV=dev WEBPACK_MODE=build webpack

  echo
  echoYellow "  3. Running watch on client app. Check /dist for changes\n"
  WEBPACK_ENV=dev WEBPACK_MODE=watch webpack
fi

if [ "$ENV" == "docker" ]; then
  echo
  echoYellow "  2. Bundling the client app into the /dist folder to list results\n"
  WEBPACK_ENV=dev WEBPACK_MODE=build webpack

fi

