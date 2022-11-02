#!/bin/sh

cd frontend
yarn build
cd ../infrastructure
cdk deploy APIStack