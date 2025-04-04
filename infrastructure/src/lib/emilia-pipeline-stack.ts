import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';
import { EmiliaGameStack } from './emilia-game-stack';

interface EmiliaPipelineStackProps extends cdk.StackProps {
  gameStack: EmiliaGameStack;
}

export class EmiliaPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EmiliaPipelineStackProps) {
    super(scope, id, props);

    // Get references from the game stack
    const websiteBucket = props.gameStack.websiteBucket;
    const distribution = props.gameStack.distribution;

    // Create artifact bucket for pipeline
    const artifactBucket = new cdk.aws_s3.Bucket(this, 'EmiliaPipelineArtifacts', {
      encryption: cdk.aws_s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: cdk.aws_s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create the pipeline
    const pipeline = new codepipeline.Pipeline(this, 'EmiliaGamePipeline', {
      pipelineName: 'EmiliaGamePipeline',
      artifactBucket: artifactBucket,
      restartExecutionOnUpdate: true,
    });

    // Source stage
    const sourceOutput = new codepipeline.Artifact();
    
    // Create the GitHub source action without webhook
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'SimonCMoore',
      repo: 'emilasgame', // Updated to match the actual repository name
      branch: 'main',
      oauthToken: cdk.SecretValue.secretsManager('github-token'),
      output: sourceOutput,
      trigger: codepipeline_actions.GitHubTrigger.POLL, // Change to POLL instead of WEBHOOK
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    // Build stage
    const buildProject = new codebuild.PipelineProject(this, 'EmiliaGameBuild', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'echo Installing dependencies...',
              'npm install',
            ],
          },
          build: {
            commands: [
              'echo Building the game...',
              'npm run build || true', // Make build optional for now
            ],
          },
        },
        artifacts: {
          'base-directory': '.',
          files: [
            'index.html',
            'css/**/*',
            'js/**/*',
            'textures/**/*',
          ],
        },
        cache: {
          paths: [
            'node_modules/**/*',
          ],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
      },
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM),
    });

    const buildOutput = new codepipeline.Artifact();
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Build',
      project: buildProject,
      input: sourceOutput,
      outputs: [buildOutput],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction],
    });

    // Deploy stage
    const deployProject = new codebuild.PipelineProject(this, 'EmiliaGameDeploy', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              'echo Deploying to S3...',
              'aws s3 sync . s3://${BUCKET_NAME} --delete',
              'echo Creating CloudFront invalidation...',
              'aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --paths "/*"',
            ],
          },
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
      },
    });

    // Grant permissions to deploy project
    deployProject.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        's3:PutObject',
        's3:DeleteObject',
        's3:GetBucketLocation',
        's3:GetObject',
        's3:ListBucket',
        'cloudfront:CreateInvalidation',
      ],
      resources: [
        websiteBucket.bucketArn,
        `${websiteBucket.bucketArn}/*`,
        `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
      ],
    }));

    const deployAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Deploy',
      project: deployProject,
      input: buildOutput,
      environmentVariables: {
        BUCKET_NAME: {
          value: websiteBucket.bucketName,
        },
        DISTRIBUTION_ID: {
          value: distribution.distributionId,
        },
      },
    });

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction],
    });

    // Add dependency to ensure game stack is deployed first
    this.addDependency(props.gameStack);

    // Output the pipeline ARN
    new cdk.CfnOutput(this, 'PipelineArn', {
      value: pipeline.pipelineArn,
      description: 'ARN of the CodePipeline',
    });
  }
}
