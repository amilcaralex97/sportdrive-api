import { APIGatewayEvent } from 'aws-lambda';
import { AuthController } from '../../controller/AuthController/AuthController';
import { SignInDTO } from '../../controller/AuthController/AuthControllerTypes';

export class AuthInteractor implements IAuthInteractor {
	private event: APIGatewayEvent;
	constructor(event: APIGatewayEvent) {
		this.event = event;
	}

	/**
	 * Login
	 */
	public async Login() {
		let loginDTO: SignInDTO;
		try {
			if (process.env.SEED_PASS) {
			}

			const auth = new AuthController(this.event);
			loginDTO = await auth.signIn();
		} catch (error) {
			return { status: 500, message: 'Error en login' };
		}
		return loginDTO;
	}
}
