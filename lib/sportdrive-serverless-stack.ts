import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
import { GenericLambda } from "./generic-lambda";
import { parseEnv } from "../src/helpers/envHelper";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SportdriveServerlessStack extends cdk.Stack {
  private api = new RestApi(this, "sport-drive-api");

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // auth parent resource
    const authentication = this.api.root.addResource("auth");

    // Create a sub-resource for login endpoints
    const login = authentication.addResource("login");
    const loginIntegration = new LambdaIntegration(
      GenericLambda.createSingleLambda(
        parseEnv(process.env.ENVIRONMENT),
        join(
          __dirname,
          "..",
          "src",
          "infrastructure",
          "Lambda",
          this.props.interactor,
          this.props.method
        ),
        "",
        this.api
      )
    );
    login.addMethod("POST", loginIntegration);
  }
}
