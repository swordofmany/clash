#!/bin/bash
set -e
set -x

echo "Setting server.."
pushd server
npm install
popd

