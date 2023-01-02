import { ApiDefinition } from 'aws-cdk-lib/aws-apigateway';
import { APIGatewayEvent } from 'aws-lambda';

export class AuthController {
	private event: APIGatewayEvent;

	constructor(event: APIGatewayEvent) {
		this.event = event;
	}

	/**
	 * signIn
	 */
	public async signIn() {
		let body: object;
		if (this.event.body) {
			body = JSON.parse(this.event.body);
		}
	}
}
