import { Function } from 'aws-cdk-lib/aws-lambda';

type LambdaProps = {
	dbName: string;
	method: string;
};

class GenericLambda {
	constructor(props: LambdaProps) {
		this.initialize(props);
	}

	private initialize(props: LambdaProps) {
		this.createLambda(props);
	}

	private createLambda(props: LambdaProps) {}
}
