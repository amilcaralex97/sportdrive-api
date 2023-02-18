import { Stack } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';
import { Dictionary } from '../src/helpers/envHelper';

type LambdaProps = {
	env_vars: Dictionary;
	interactor: string;
	method: string;
};

export class GenericLambda {
	private stack: Stack;
	private props: LambdaProps;
	private createLambda: NodejsFunction | undefined;
	public createLambdaIntegration: LambdaIntegration;

	constructor(stack: Stack, props: LambdaProps) {
		this.stack = stack;
		this.props = props;
		this.initialize();
	}

	private initialize() {
		this.createLambdas();
	}

	private createLambdas() {
		if (this.props) {
			this.createLambda = this.createSingleLambda();
			this.createLambdaIntegration = new LambdaIntegration(
				this.createLambda
			);
		}
	}

	private createSingleLambda() {
		const lambdaId = `${this.props.env_vars['env']}-${this.props.interactor}`;
		return new NodejsFunction(this.stack, lambdaId, {
			entry: join(
				__dirname,
				'..',
				'src',
				'infrastructure',
				'Lambda',
				this.props.interactor,
				this.props.method
			),
			handler: 'handler',
			functionName: lambdaId,
			environment: this.props.env_vars,
		});
	}
}
