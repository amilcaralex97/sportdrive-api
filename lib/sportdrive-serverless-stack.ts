import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
import { GenericLambda } from "./generic-lambda";
import { parseEnv } from "../src/helpers/envHelper";

export class SportdriveServerlessStack extends cdk.Stack {
  private api = new RestApi(this, "sport-drive-api");

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    (async () => {
      const env = await parseEnv(process.env.ENVIRONMENT);
      const lambda = await GenericLambda.createSingleLambda(
        env,
        join(
          __dirname,
          "..",
          "src",
          "infrastructure",
          "Lambda",
          "AuthInteractor",
          "SignIn.ts"
        ),
        "Login",
        this
      );
      const lambdaIntegration = new LambdaIntegration(lambda);

      const authentication = this.api.root.addResource("auth");
      const login = authentication.addResource("login");
      login.addMethod("POST", lambdaIntegration);
    })();
  }
}
