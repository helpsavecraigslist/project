#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { FrontendStack } from '../lib/stacks/frontendStack'
import { APIStack } from '../lib/stacks/apiStack'

const app = new cdk.App()

const frontendStack = new FrontendStack(app, 'FrontendStack', {})
const apiStack = new APIStack(app, 'APIStack', {
  callbackUrl: frontendStack.cloudfrontDomain,
})
