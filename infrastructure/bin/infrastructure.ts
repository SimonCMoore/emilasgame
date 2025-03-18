#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EmiliaGameStack } from '../lib/emilia-game-stack';
import { EmiliaPipelineStack } from '../lib/emilia-pipeline-stack';

const app = new cdk.App();

// Create the main game hosting stack
new EmiliaGameStack(app, 'EmiliaGameStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
  },
  description: 'Stack for hosting the Emilia game static website'
});

// Create the CI/CD pipeline stack
new EmiliaPipelineStack(app, 'EmiliaPipelineStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
  },
  description: 'Stack for CI/CD pipeline to deploy the Emilia game'
});
