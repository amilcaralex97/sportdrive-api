import { APIGatewayEvent } from 'aws-lambda';
import { verify } from 'argon2';
import { IUser, User } from '../entity/User';
import { sign, SignOptions } from 'jsonwebtoken';
import { resolve } from 'dns';

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

				if (!user) {
					return {
						status: 401,
						message: 'Contraseña o Usuario Inválidos',
					};
				}

				const validPassword = await verify(user.password, password);

				if (!validPassword) {
					return {
						status: 401,
						message: 'Contraseña o Usuario Inválidos',
					};
				}

				const jwtToken = this.generateToken(user);

				return { token: jwtToken, userId: user.userId };
			} catch (error) {
				return { status: 500, message: 'Error en login' };
			}
		}
	}

	private generateToken(user: IUser) {
		const signInOptions: SignOptions = {
			expiresIn: '8h',
		};

		return sign(
			{ userId: user.userId },
			process.env.PRIVATE_KEY as string,
			signInOptions
		);
	}

	/**
	 * verify
	 */
	public verify() {
		try {
			return true;
		} catch (error) {
			return { status: 500, message: 'Error en login' };
		}
	}
}
