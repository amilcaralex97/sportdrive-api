import { Stack } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';

type LambdaProps = {
	env: string;
	model: string;
	method: string;
};

export class GenericLambda {
	private stack: Stack;
	private props: LambdaProps;
	constructor(stack: Stack, props: LambdaProps) {
		this.stack = stack;
		this.props = props;
		this.initialize();
	}

	private initialize() {
		this.createLambda();
	}

	private createLambda() {
		const lambdaId = `${this.props.env}-${this.props.model}`;
		return new NodejsFunction(this.stack, lambdaId, {
			entry: join(
				__dirname,
				'..',
				'src',
				'infrastructure',
				'Lambda',
				this.props.model,
				this.props.method
			),
			handler: 'handler',
			functionName: lambdaId,
		});
	}
}
