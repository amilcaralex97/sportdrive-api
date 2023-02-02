import { verify } from 'argon2';
import mongoose from 'mongoose';
import { sign, SignOptions } from 'jsonwebtoken';
import { userSchema } from '../../entity/User';
import { AuthInteractorInterface, SignInRequest } from './AuthInteractorTypes';
import { IUser } from '../../controller/UserController/UserControllerTypes';
import { UserController } from '../../controller/UserController/userController';
import { APIGatewayEvent } from 'aws-lambda';
import { eventParser } from '../../helpers/jsonHelper';

export class AuthInteractor implements AuthInteractorInterface {
	private event;
	private conn;

	constructor(event: APIGatewayEvent, db: typeof mongoose) {
		this.event = eventParser(event);
		this.conn = db;
	}

	/**
	 * signIn
	 */
	public async signIn() {
		let body: SignInRequest;
		let jwtToken;
		let user;
		if (this.authRequest) {
			const { userName, password } = this.authRequest;
			try {
				user = await this.userModel.findOne({ userName });

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

				jwtToken = this.generateToken(user);
			} catch (error) {
				return { status: 500, message: 'Error en login' };
			}
			return {
				token: jwtToken,
				userId: user.userId,
				status: 200,
				message: 'Login exitoso',
			};
		}
		return { status: 500, message: 'Error en login' };
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
			return {
				status: 200,
				message: 'Usuario Verificado',
				isVerified: true,
			};
		} catch (error) {
			return {
				status: 500,
				message: 'Error en login',
				isVerified: false,
			};
		}
	}
}
