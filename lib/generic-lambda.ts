import { Stack } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Dictionary } from "../src/helpers/envHelper";

export class GenericLambda {
  public static createSingleLambda(
    envVars: Dictionary,
    lambdaPath: string,
    method: string,
    stack: Stack
  ): NodejsFunction {
    const lambdaId = `${envVars["env"]}-${method}`;
    return new NodejsFunction(stack, lambdaId, {
      entry: lambdaPath,
      handler: "handler",
      functionName: lambdaId,
      environment: envVars,
    });
  }
}
