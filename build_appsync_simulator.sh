#!/bin/sh 

set -eux

npm install --global yarn


cd packages/amplify-cli-logger
npm run build
cd -

cd packages/amplify-cli-shared-interfaces
npm run build
cd -

cd packages/amplify-prompts
npm run build
cd -

cd packages/amplify-cli-core 
npm run build
cd -

cd packages/amplify-appsync-simulator
npm run build
npm pack 
mkdir -p ~/.npm/_tmp 
mv aws-amplify-amplify-appsync-simulator-2.16.4.tgz ~/.npm/_tmp/aws-amplify-amplify-appsync-simulator-2.16.4.tgz
cd -
