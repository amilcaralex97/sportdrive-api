import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SportdriveServerlessStack extends cdk.Stack {
  private api = new RestApi(this, 'sport-drive-api');

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'SportdriveServerlessQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
