import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { EmiliaGameStack } from '../lib/emilia-game-stack';

test('S3 Bucket Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new EmiliaGameStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::S3::Bucket', {
    WebsiteConfiguration: {
      IndexDocument: 'index.html',
      ErrorDocument: 'index.html'
    }
  });
});

test('CloudFront Distribution Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new EmiliaGameStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::CloudFront::Distribution', 1);
});

test('SSM Parameters Created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new EmiliaGameStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::SSM::Parameter', 2);
});
