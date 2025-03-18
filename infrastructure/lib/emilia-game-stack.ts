import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export class EmiliaGameStack extends cdk.Stack {
  public readonly websiteBucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket to host the website
    this.websiteBucket = new s3.Bucket(this, 'EmiliaGameBucket', {
      bucketName: `emilia-game-${this.account}-${this.region}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Create an Origin Access Identity for CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'EmiliaGameOAI', {
      comment: 'OAI for Emilia Game website',
    });

    // Grant read permissions to CloudFront
    this.websiteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [this.websiteBucket.arnForObjects('*')],
      principals: [new iam.CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
    }));

    // Create a CloudFront distribution
    this.distribution = new cloudfront.Distribution(this, 'EmiliaGameDistribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.S3Origin(this.websiteBucket, {
          originAccessIdentity,
        }),
        compress: true,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    // Store the bucket name and distribution ID in SSM Parameter Store for use by the pipeline
    new ssm.StringParameter(this, 'EmiliaGameBucketNameParam', {
      parameterName: '/emilia/game/bucket-name',
      stringValue: this.websiteBucket.bucketName,
      description: 'S3 bucket name for Emilia game hosting',
    });

    new ssm.StringParameter(this, 'EmiliaGameDistributionIdParam', {
      parameterName: '/emilia/game/distribution-id',
      stringValue: this.distribution.distributionId,
      description: 'CloudFront distribution ID for Emilia game',
    });

    // Output the website URL
    new cdk.CfnOutput(this, 'EmiliaGameWebsiteURL', {
      value: `https://${this.distribution.distributionDomainName}`,
      description: 'URL for the Emilia game website',
    });

    new cdk.CfnOutput(this, 'EmiliaGameBucketName', {
      value: this.websiteBucket.bucketName,
      description: 'Name of the S3 bucket hosting the Emilia game',
    });
  }
}
