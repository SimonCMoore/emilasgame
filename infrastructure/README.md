# Emilia Game Infrastructure

This directory contains the AWS CDK infrastructure code for hosting the Emilia game and setting up the CI/CD pipeline.

## Architecture

The infrastructure consists of two main stacks:

1. **EmiliaGameStack**: Hosts the static website
   - S3 bucket for static files
   - CloudFront distribution for content delivery
   - Security configurations and access controls

2. **EmiliaPipelineStack**: Manages the CI/CD pipeline
   - GitHub source integration
   - CodeBuild for building the application
   - Deployment to S3 and CloudFront invalidation

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. Node.js and npm installed
3. AWS CDK CLI installed (`npm install -g aws-cdk`)
4. GitHub personal access token stored in AWS Secrets Manager with name 'github-token'

## Setup

1. Install dependencies:
```bash
npm install
```

2. Bootstrap CDK (if not already done in your account):
```bash
cdk bootstrap
```

3. Deploy the stacks:
```bash
cdk deploy --all
```

## Stack Details

### EmiliaGameStack

Creates:
- S3 bucket for website hosting
- CloudFront distribution
- Origin Access Identity
- Required IAM roles and policies
- SSM parameters for bucket name and distribution ID

### EmiliaPipelineStack

Creates:
- CodePipeline with stages:
  - Source (GitHub)
  - Build (npm build)
  - Deploy (S3 sync and CloudFront invalidation)
- CodeBuild projects
- Required IAM roles and policies
- Artifact bucket

## GitHub Integration

1. Store your GitHub personal access token in AWS Secrets Manager:
```bash
aws secretsmanager create-secret --name github-token --secret-string "your-token-here"
```

2. The pipeline will automatically trigger on pushes to the main branch

## Useful Commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Security

- S3 bucket blocks all public access
- CloudFront uses Origin Access Identity
- HTTPS only
- Least privilege IAM policies

## Costs

This infrastructure uses:
- S3 (storage and requests)
- CloudFront (data transfer and requests)
- CodePipeline (pipeline hours)
- CodeBuild (build minutes)

Monitor your AWS billing dashboard for actual costs.
