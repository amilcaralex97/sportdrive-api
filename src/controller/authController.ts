import { ApiDefinition } from 'aws-cdk-lib/aws-apigateway';
import { APIGatewayEvent } from 'aws-lambda';
import { User } from '../entity/User';

interface SignInRequest {
	userName: string;
	password: string;
}

export class AuthController {
	private event: APIGatewayEvent;
	private body: SignInRequest;

	constructor(event: APIGatewayEvent) {
		this.event = event;
	}

	/**
	 * signIn
	 */
	public async signIn() {
		let body: SignInRequest;
		if (this.event.body) {
			body = JSON.parse(this.event.body);
			const { userName, password } = body;
			try {
				const user = await User.findOne({ userName });
			} catch (error) {
				throw new Error('');
			}
		}
	}
}
